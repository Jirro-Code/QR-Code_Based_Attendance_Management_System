import { useRef, useState, useEffect, useCallback } from "react";
import { CancelButton } from "./Button.tsx";

type ImageCropModalProps = {
    file: File;
    onConfirm: (croppedFile: File) => void;
    onClose: () => void;
};

const OUTPUT_SIZE = 500;

export const ImageCropModal = ({ file, onConfirm, onClose }: ImageCropModalProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    
    const CANVAS_SIZE = 320; 
    
    useEffect(() => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            imageRef.current = img;
            
            const minZoom = Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
            setZoom(minZoom);
            setOffset({ x: 0, y: 0 });
            setImageLoaded(true);
        };
        img.src = url;
        return () => URL.revokeObjectURL(url);
    }, [file]);
    
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img || !imageLoaded) return;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        const drawWidth = img.width * zoom;
        const drawHeight = img.height * zoom;
        const x = (CANVAS_SIZE - drawWidth) / 2 + offset.x;
        const y = (CANVAS_SIZE - drawHeight) / 2 + offset.y;
        
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
    }, [zoom, offset, imageLoaded]);
    
    useEffect(() => {
        draw();
    }, [draw]);
    
    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    };
    
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current || !imageRef.current) return;
        
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        lastPos.current = { x: e.clientX, y: e.clientY };
        
        setOffset((current) => clampOffset({ x: current.x + dx, y: current.y + dy }, zoom));
    };
    
    const handlePointerUp = () => {
        isDragging.current = false;
    };
    
    const clampOffset = (candidate: { x: number; y: number }, currentZoom: number) => {
        const img = imageRef.current;
        if (!img) return candidate;
        
        const drawWidth = img.width * currentZoom;
        const drawHeight = img.height * currentZoom;
        
        const maxX = Math.max(0, (drawWidth - CANVAS_SIZE) / 2);
        const maxY = Math.max(0, (drawHeight - CANVAS_SIZE) / 2);
        
        return {
            x: Math.min(maxX, Math.max(-maxX, candidate.x)),
            y: Math.min(maxY, Math.max(-maxY, candidate.y)),
        };
    };
    
    const handleZoomChange = (newZoom: number) => {
        setZoom(newZoom);
        setOffset((current) => clampOffset(current, newZoom));
    };
    
    const handleConfirm = () => {
        const img = imageRef.current;
        if (!img) return;
        
        const outputCanvas = document.createElement("canvas");
        outputCanvas.width = OUTPUT_SIZE;
        outputCanvas.height = OUTPUT_SIZE;
        const ctx = outputCanvas.getContext("2d");
        if (!ctx) return;
        
        const scaleFactor = OUTPUT_SIZE / CANVAS_SIZE;
        const drawWidth = img.width * zoom * scaleFactor;
        const drawHeight = img.height * zoom * scaleFactor;
        const x = (OUTPUT_SIZE - drawWidth) / 2 + offset.x * scaleFactor;
        const y = (OUTPUT_SIZE - drawHeight) / 2 + offset.y * scaleFactor;
        
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        
        outputCanvas.toBlob((blob) => {
            if (!blob) return;
            const croppedFile = new File([blob], file.name, { type: "image/jpeg" });
            onConfirm(croppedFile);
        }, "image/jpeg", 0.92);
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <h2 className="text-base font-semibold text-gray-800">Crop Profile Picture</h2>
                    <CancelButton onClose={onClose} />
                </div>
                
                <div className="p-5 flex flex-col items-center gap-4">
                    <div
                        className="relative rounded-md overflow-hidden bg-gray-900 touch-none"
                        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
                    >
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_SIZE}
                            height={CANVAS_SIZE}
                            className="cursor-move"
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                        />
                    </div>
                    
                    <div className="w-full flex items-center gap-3">
                        <span className="text-xs text-gray-500">Zoom</span>
                        <input
                            type="range"
                            min={imageRef.current ? Math.max(CANVAS_SIZE / imageRef.current.width, CANVAS_SIZE / imageRef.current.height) : 1}
                            max={imageRef.current ? Math.max(CANVAS_SIZE / imageRef.current.width, CANVAS_SIZE / imageRef.current.height) * 3 : 3}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => handleZoomChange(Number(e.target.value))}
                            className="flex-1"
                        />
                    </div>
                    
                    <p className="text-xs text-gray-400 text-center">Drag to reposition, use the slider to zoom. Output will be a square (2x2) image.</p>
                </div>
                
                <div className="flex justify-between items-center px-5 py-4 border-t border-gray-200">
                    <button type="button" onClick={onClose} className="bg-gray-100 border border-gray-400 hover:bg-gray-200 text-gray-500 font-bold py-1.5 px-4 rounded">
                        Cancel
                    </button>
                    <button type="button" onClick={handleConfirm} className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-1.5 px-4 rounded">
                        Use this photo
                    </button>
                </div>
            </div>
        </div>
    );
};