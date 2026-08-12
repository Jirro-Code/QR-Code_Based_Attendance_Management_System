import { useEffect, useState } from "react";
import { Html5Qrcode, type CameraDevice } from "html5-qrcode";
import { ScannedStudentCard } from "./Cards/ScannedStudentCard.tsx";

type ScannerProps = {
    onClose: () => void;
    eventId: string;
}

export const Scanner = ({ onClose, eventId }: ScannerProps) => {
    const [error, setError] = useState<string>("");
    const [cameras, setCameras] = useState<CameraDevice[]>([]);
    const [showIsDetected, setShowIsDetected] = useState<boolean>(false);
    const [restartScanner, setRestartScanner] = useState<boolean>(false);
    const [scannedStudent, setScannedStudent] = useState<{
        uuid: string;
        username: string;
        studentStrand: string;
        studentSection: string;
    } | null>(null);
    
    const onCloseScannedStudentCard = () => {
        setShowIsDetected(false);
        setScannedStudent(null);
        setRestartScanner((prev) => !prev);
        console.log("Scanner restarted:", !restartScanner);
    }
    
    useEffect(() => {
        if (!eventId) return;
        
        const getCameras = async () => {
            try {
                const devices = await Html5Qrcode.getCameras();
                
                if (devices.length === 0) {
                    setError("No camera was found.");
                    return;
                }
                setCameras(devices);
            } 
            catch (error) {
                console.error("Error getting cameras:", error);
                setError("Unable to access the camera. Please allow camera permission.");
            }
        };
        
        getCameras();
    }, [eventId]);
    
    useEffect(() => {
        if (cameras.length === 0 || !eventId) return;
        
        const scanner = new Html5Qrcode("qr-reader");
        let isScanning = false;
        let cancelled = false;
        
        const startScanning = async () => {
            try {
                setError("");
                
                await scanner.start(cameras[0].id,{fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0},
                    async (decodedText) => {
                        if (!isScanning || cancelled) return;
                        
                        const parts = decodedText.split("|icpsantamaria|");
                        if (parts.length !== 4) {
                            setError("Invalid QR code. This is not a student QR code.");
                            return;
                        }
                        
                        const [uuid, username, strand, section] = parts;
                        if (!uuid.trim() || !username.trim() || !strand.trim() || !section.trim()) {
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
                        
                        setScannedStudent({ uuid: uuid.trim(), username: username.trim(), studentStrand: strand.trim(), studentSection: section.trim() });
                        
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
            } catch (error) {
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
    }, [cameras, eventId, restartScanner]);
    
    
    return (
        <>  
            <div id="qr-reader" style={{ width: "500px", height: "500px" }}/>
            {error && <p>{error}</p>}
            <button onClick={() => {cameras.unshift(cameras.pop()!); setError("");}} disabled={cameras.length <= 1}> Flip Camera </button>
            <button onClick={onClose}> Cancel </button>
            {showIsDetected && <ScannedStudentCard scannedStudent={scannedStudent} eventId={eventId} setError={setError} onClose={onCloseScannedStudentCard}/>}
        </>
    );
}