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
    const [events, setEvents] = useState<Event[]>([]);
    const [cameras, setCameras] = useState<CameraDevice[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
    const [isLate, setIsLate] = useState<boolean>(false);
    const [showIsDetected, setShowIsDetected] = useState<boolean>(false);

    const [scannedStudent, setScannedStudent] = useState<{
        uuid: string;
        username: string;
        studentStrand: string;
        studentSection: string;
    } | null>(null);

    const [eventId, setEventId] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    const { useMarkAttendance } = useCreate();
    const { useViewAllEvents } = useView();

    /*
     * GET EVENTS
     */
    useEffect(() => {
        useViewAllEvents(setEvents);
    }, []);
    
    /*
     * ONLY TODAY AND FUTURE EVENTS
     */
    const availableEvents = events.filter((event) => {
        const localDateToday = Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
        return event.eventDate === localDateToday;
    });
    
    /*
     * MARK PRESENT
     */
    const handleMarkPresent = async () => {
        if (!scannedStudent || !eventId) return;
        
        const result = await useMarkAttendance(
            scannedStudent.uuid,
            eventId,
            isLate,
            setError
        );
        console.log("Attendance marking result:", result);
        console.log("result.ok:", result.ok);
        console.log("result.status:", result.status);
        if (result) {
            setShowIsDetected(false);
            setIsLate(false);
            setScannedStudent(null);
            setError(null)
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
        if (!selectedCamera || !eventId) return;
        
        const scanner = new Html5Qrcode("qr-reader");
        let isScanning = false;
        
        const startScanning = async () => {
            try {
                setError(null);
                await scanner.start(selectedCamera, {fps: 10,qrbox: { width: 250, height: 250, }, aspectRatio: 1.0 },
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
    }, [selectedCamera, eventId]);
    
    if (!eventId) {
        return (
            <div>
                <h2>Select Event</h2>
                {error && <p>{error}</p>}
                {availableEvents.length === 0 && (<p>No events available for today or the future.</p>)}
                
                {availableEvents?.map((event) => (
                    <button key={event.id} onClick={() => {setEventId(event.id), setError(null); }}>{event.eventName} - {event.eventDate}</button>
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
    if (!selectedCamera) {
        return (
            <div>
                <h2>Select Camera</h2>
                {error && <p>{error}</p>}
                {cameras.length === 0 && !error && (<p>Loading cameras...</p>)}
                {cameras.map((camera) => (
                    <button key={camera.id} onClick={() => { setSelectedCamera(camera.id), setError(null); }}>{camera.label || "Camera"}</button>
                ))}
                <button onClick={() => { setEventId(null), setSelectedCamera(null), setCameras([]), setError(null); }}>Back to Events</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        );
    }

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

    /*
     * SCANNER
     */
    return (
        <div>
            <div id="qr-reader" style={{ width: "500px", height: "500px" }}/>

            {error && <p>{error}</p>}

            <button onClick={() => {
                    const currentIndex =cameras.findIndex((camera) => camera.id === selectedCamera);
                    
                    const nextIndex = (currentIndex + 1) % cameras.length;

                    setSelectedCamera(cameras[nextIndex].id);

                    setError(null);
                }}
                disabled={cameras.length <= 1}
            >
                Flip Camera
            </button>
            <button onClick={() => {
                    setError(null);
                    setSelectedCamera(null);
                    setScannedStudent(null);
                }}>
                Reset Camera
            </button>
            <button onClick={onCancel}>
                Cancel
            </button>
        </div>
    );
};