import { useEffect, useState } from "react";
import { Html5Qrcode, type CameraDevice } from "html5-qrcode";
import { ScannedStudentCard } from "./cards/ScannedStudentCard.tsx";
import { NotificationCard } from "./cards/NotificationCard.tsx";
import { RefreshCw, X } from "lucide-react";
import { type User } from "../services/users.ts";
import { getProfilePictureById } from "../services/users.ts";
import { ApiError } from "../services/error.ts";
import { useView } from "../hooks/useView.ts";

type ScannerProps = {
    onClose: () => void;
    eventId: string;
    cameras: CameraDevice[];
}

export const Scanner = ({ onClose, eventId, cameras }: ScannerProps) => {
    const { useViewUser, useCheckAttendance } = useView();
    const [error, setError] = useState<string>("");
    const [student, setStudent] = useState<Partial<User | null>>();
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [orderedCameras, setOrderedCameras] = useState<CameraDevice[]>(cameras);
    const [showIsDetected, setShowIsDetected] = useState<boolean>(false);
    const [restartScanner, setRestartScanner] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string}>({
        title: "",
        message: ""
    });
    
    const onCloseScannedStudentCard = () => {
        setShowIsDetected(false);
        setStudent(null);
        setProfilePicture(null);
        setRestartScanner((prev) => !prev);
    }
    
    useEffect(() => {
        if (orderedCameras.length === 0 || !eventId) return;
        
        const scanner = new Html5Qrcode("qr-reader");
        let isScanning = false;
        let cancelled = false;
        
        const startScanning = async () => {
            try {
                setError("");
                
                await scanner.start(orderedCameras[0].id,{fps: 10, qrbox: { width: 210, height: 210 }, aspectRatio: 1.0},
                    async (decodedText) => {
                        if (!isScanning || cancelled) return;
                        
                        const parts = decodedText.split("|icpsantamaria|");
                        if (parts.length !== 3) {
                            setError("Invalid QR code. This is not a student QR code.");
                            return;
                        }
                        
                        const [schoolName, uuid, schoolName2 ] = parts;
                        if ((!schoolName.trim() || !uuid.trim() || !schoolName2.trim()) || (schoolName.trim() !== "ICP" || schoolName2.trim() !== "SantaMaria")) {
                            setError("Invalid student QR code.");
                            return;
                        }
                        
                        isScanning = false;
                        try {
                            await scanner.stop();
                            scanner.clear();
                        }
                        catch (error) {
                            console.error("Error stopping QR scanner:", error);
                        }
                        
                        useEffect(() => {
                            const fetchStudentData = async () => {
                                try {
                                    const studentData = await useViewUser(uuid.trim(), setError);
                                    
                                    if (studentData.isArchived) {
                                        setNotificationMessage({ title: "Error", message: "This student is archived and cannot be marked present." });
                                        setShowNotification(true);
                                        return;
                                    }
                                    
                                    setStudent(studentData);
                                    
                                    const checkAttendanceResult = await useCheckAttendance(eventId, uuid.trim(), setError);
                                    
                                    if (!checkAttendanceResult) {
                                        setNotificationMessage({ title: "Error", message: "Unable to check attendance for this student." });
                                        setShowNotification(true);
                                        return;
                                    }
                                    
                                    if (checkAttendanceResult.canMark === false) {
                                        setNotificationMessage({ title: "Attendance Already Marked", message: "This student has already been marked present for this event." });
                                        setShowNotification(true);
                                        return;
                                    }
                                    
                                    if (checkAttendanceResult.canMark === true) {
                                        setStudent(studentData);
                                    }
                                    
                                    try {
                                        const profilePictureData = await getProfilePictureById(uuid.trim());
                                        setProfilePicture(profilePictureData.url as string);
                                    }
                                    catch (profilePictureError) {
                                        if (!(profilePictureError instanceof ApiError) || profilePictureError.status !== 404) {
                                            console.error("Error fetching scanned student's profile picture:", profilePictureError);
                                        }
                                        setProfilePicture(null);
                                    }
                                }
                                catch (e) {
                                    setNotificationMessage({ title: "Error", message: `${e instanceof Error ? e.message : "An unknown error occurred"}` });
                                    setShowNotification(true);
                                    onClose();
                                    return;
                                }
                            }
                            
                            fetchStudentData();        
                            
                        }, [uuid.trim(), eventId, setError]);
                        
                        
                        setShowNotification(false);
                        setShowIsDetected(true);
                        
                    },
                    () => {
                        // SPAM AREA
                    }
                );
                
                if (cancelled) {
                    await scanner.stop();
                    scanner.clear();
                    return;
                }
                
                isScanning = true;
            }
            catch (error) {
                if (!cancelled) {
                    console.error("Error starting QR scanner:", error);
                    setError("Unable to start the selected camera.");
                }
            }
        };
        
        startScanning();
        
        return () => {
            cancelled = true;
            
            if (isScanning) {
                scanner.stop()
                    .then(() => scanner.clear())
                    .catch((error) => {
                        console.error("Error stopping QR scanner:", error);
                    });
                    
                isScanning = false;
            }
        };
    }, [orderedCameras, eventId, restartScanner]);
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-4 sm:p-5 flex flex-col gap-3">
                
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-800">Scanning...</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <X size={20} />
                    </button>
                </div>
                
                {error && <p className="text-red-700 text-sm">{error}</p>}
                
                <div id="qr-reader" className="w-full aspect-square rounded-md overflow-hidden bg-black" />
                
                <div className="flex gap-2">
                    <button
                        onClick={() => setOrderedCameras((prev) => [...prev.slice(1), prev[0]])}
                        disabled={orderedCameras.length <= 1}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded transition-colors duration-200"
                    >
                        <RefreshCw size={16} />
                        Flip Camera
                    </button>
                    <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded transition-colors duration-200">
                        Cancel
                    </button>
                </div>
            </div>
            
            {showIsDetected && <ScannedStudentCard student={student!} profilePicture={profilePicture || null} setNotificationMessage={setNotificationMessage} setShowNotification={setShowNotification} eventId={eventId} setError={setError} onClose={onCloseScannedStudentCard}/> }
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
        </div>
    );
}