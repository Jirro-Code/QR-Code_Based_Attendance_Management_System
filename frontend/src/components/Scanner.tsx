import { useEffect, useState } from "react";
import { Html5Qrcode, type CameraDevice } from "html5-qrcode";
import { useCreate } from "../hooks/useCreate.ts";
import { useView } from "../hooks/useView.ts";
import { type Event } from "../services/events.ts";
import style from "./Scanner.module.css";

type ScannerProps = {
    onCancel: () => void;
};

export const Scanner = ({ onCancel }: ScannerProps) => {
    const { useMarkAttendance } = useCreate();
    const { useViewAllEvents } = useView();
    const [error, setError] = useState<string>("");
    const [events, setEvents] = useState<Event[]>([]);
    const [eventId, setEventId] = useState<string | null>(null);
    const [isLate, setIsLate] = useState<boolean>(false);
    const [cameras, setCameras] = useState<CameraDevice[]>([]);
    const [showIsDetected, setShowIsDetected] = useState<boolean>(false);
    const [restartScanner, setRestartScanner] = useState<boolean>(false);
    const [scannedStudent, setScannedStudent] = useState<{
        uuid: string;
        username: string;
        studentStrand: string;
        studentSection: string;
    } | null>(null);
    
    useEffect(() => {
        useViewAllEvents(setEvents, setError);
    }, []);
    
    
    const availableEvents = events.filter((event) => {
        const localDateToday = Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
        return event.eventDate === localDateToday;
    });
    
    const handleMarkPresent = async () => {
        if (!scannedStudent || !eventId) return;
        
        const result = await useMarkAttendance( { uuid: scannedStudent.uuid, eventId, isLate, setError } );
        if (result?.result === "Attendance already marked.") {
            setShowIsDetected(false);
            setIsLate(false);
            setScannedStudent(null);
            setRestartScanner((prev) => !prev);
            return;
        }
        if (result) {
            setShowIsDetected(false);
            setIsLate(false);
            setScannedStudent(null);
            setRestartScanner((prev) => !prev);
        }
    };
    
    /*
     * GET CAMERAS
     */
    useEffect(() => {
        // Don't get cameras until an event has been selected
        if (!eventId) return;
        
        const getCameras = async () => {
            try {
                const devices = await Html5Qrcode.getCameras();
                
                if (devices.length === 0) {
                    setError("No camera was found.");
                    return;
                }
                
                setCameras(devices);
            } catch (error) {
                console.error("Error getting cameras:", error);
                
                setError(
                    "Unable to access the camera. Please allow camera permission."
                );
            }
        };

        getCameras();
    }, [eventId]);

    /*
     * START SCANNER
     */
    useEffect(() => {
        if (cameras.length === 0 || !eventId) return;
        
        const scanner = new Html5Qrcode("qr-reader");
        let isScanning = false;
        
        const startScanning = async () => {
            try {
                setError("");
                await scanner.start(cameras[0].id, {fps: 10,qrbox: { width: 250, height: 250, }, aspectRatio: 1.0 },
                    async (decodedText) => {
                        if (!isScanning) return;
                        
                        const parts = decodedText.split("|icpsantamaria|");
                        if (parts.length !== 4) {
                            setError( "Invalid QR code. This is not a student QR code.");
                            return;
                        }
                        
                        const [ uuid, username, strand, section ] = parts;
                        
                        if ( !uuid.trim() || !username.trim() || !strand.trim() || !section.trim() ) {
                            setError("Invalid student QR code.");
                            return;
                        }
                        isScanning = false;
                        
                        try {
                            await scanner.stop();
                        } 
                        catch (error) {
                            console.error(
                                "Error stopping QR scanner:",
                                error
                            );
                        }
                        
                        
                        setScannedStudent({ uuid: uuid.trim(), username: username.trim(), studentStrand: strand.trim(), studentSection: section.trim() });
                        setShowIsDetected(true);
                    
                    },
                    () => {
                        // No action
                    }
                );
                
                isScanning = true;
            } 
            catch (error) {
                console.error("Error starting QR scanner:", error);
                setError("Unable to start the selected camera.");
            }
        };
        
        startScanning();
        
        return () => {
            if (isScanning) {
                scanner.stop().catch((error) => {
                    console.error("Error stopping QR scanner:", error);
                });
                
                isScanning = false;
            }
        };
    }, [cameras, eventId, restartScanner]);
    
    if (!eventId) {
        return (
            <div>
                <h2>Select Event</h2>
                {error && <p>{error}</p>}
                {availableEvents.length === 0 && (<p>No events available for today or the future.</p>)}
                
                {availableEvents?.map((event) => (
                    <button key={event.id} onClick={() => {setEventId(event.id), setError(""); }}>{event.eventName} - {event.eventDate}</button>
                ))}
                <button onClick={onCancel}>Cancel</button>
            </div>
        );
    }
    
    /*
     * CAMERA SELECTION
     *
     * Camera is selected only after event selection.
     */

    /*
     * STUDENT DETECTED
     */
    if (showIsDetected && scannedStudent) {
        return (
            <div>
                <h2>Student Detected</h2>

                <p>
                    <strong>Username:</strong>{" "}
                    {scannedStudent.username}
                </p>

                <p>
                    <strong>Strand:</strong>{" "}
                    {scannedStudent.studentStrand}
                </p>

                <p>
                    <strong>Section:</strong>{" "}
                    {scannedStudent.studentSection}
                </p>

                <button onClick={() => setIsLate((prev) => !prev)} className={isLate ? style.late : style.notLate}>
                    Set as late
                </button>
                <button onClick={handleMarkPresent}>
                    Mark as Present
                </button>

                <button onClick={onCancel}>
                    Cancel
                </button>
            </div>
        );
    }
    
    return (
        <div>
            <div id="qr-reader" style={{ width: "500px", height: "500px" }}/>
            {error && <p>{error}</p>}
            <button onClick={() => {cameras.unshift(cameras.pop()!); setError("");}} disabled={cameras.length <= 1}> Flip Camera </button>
            <button onClick={onCancel}> Cancel </button>
        </div>
    );
};