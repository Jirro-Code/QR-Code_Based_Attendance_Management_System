import { useEffect, useRef, useState } from "react";
import { SelectionField } from "../Input/SelectionField.tsx";
import { Input } from "../Input/Input.tsx";
import { useScrollFunctions } from "../../hooks/useScrollFunctions.ts";

type FilterOptionsProps = {
    onClose: () => void;
    onApplyFilters: (
        sortAlphabetical: "A-Z" | "Z-A" | null,
        month: string | null,
        year: string | null,
        strand: string | null,
        bySection: string | null,
        byTime: "latest" | "earliest" | null
    ) => void;
    selectedOrder: "A-Z" | "Z-A" | null;
    setSelectedOrder: React.Dispatch<React.SetStateAction<"A-Z" | "Z-A" | null>>;
    selectedMonth: string | null;
    setSelectedMonth: React.Dispatch<React.SetStateAction<string | null>>;
    selectedYear: string | null;
    setSelectedYear: React.Dispatch<React.SetStateAction<string | null>>;
    selectedStrand: string | null;
    setSelectedStrand: React.Dispatch<React.SetStateAction<string | null>>;
    selectedBySection: string | null;
    setSelectedBySection: React.Dispatch<React.SetStateAction<string | null>>;
    selectedByTime: "latest" | "earliest" | null;
    setSelectedByTime: React.Dispatch<React.SetStateAction<"latest" | "earliest" | null>>;
};

const COLLAPSED_VH = 48;
const EXPANDED_VH = 92;
const CLOSE_THRESHOLD_VH = 28;

export const AttendanceFilterOptions = ({
        onClose,
        onApplyFilters,
        selectedOrder,
        setSelectedOrder,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        selectedStrand,
        setSelectedStrand,
        selectedBySection,
        setSelectedBySection,
        selectedByTime,
        setSelectedByTime,
    }: FilterOptionsProps) => {
    
    const { useDisableScroll } = useScrollFunctions();
    useDisableScroll();
    const [heightVh, setHeightVh] = useState<number>(COLLAPSED_VH);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    
    const dragStartY = useRef<number>(0);
    const dragStartHeight = useRef<number>(COLLAPSED_VH);
    
    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);
    
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };
    
    const handleApply = () => {
        onApplyFilters(selectedOrder, selectedMonth, selectedYear, selectedStrand, selectedBySection, selectedByTime);
        handleClose();
    };
    
    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        dragStartY.current = e.clientY;
        dragStartHeight.current = heightVh;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };
    
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const deltaPx = dragStartY.current - e.clientY;
        const deltaVh = (deltaPx / window.innerHeight) * 100;
        const newHeight = Math.min(EXPANDED_VH, Math.max(15, dragStartHeight.current + deltaVh));
        setHeightVh(newHeight);
    };
    
    const handlePointerUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        
        if (heightVh < CLOSE_THRESHOLD_VH) {
            handleClose();
            return;
        }
        
        const midpoint = (COLLAPSED_VH + EXPANDED_VH) / 2;
        setHeightVh(heightVh >= midpoint ? EXPANDED_VH : COLLAPSED_VH);
    };
    
    const toggleButtonClass = (active: boolean) =>
        `px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-colors duration-200 ${
            active
                ? "border border-blue-700 text-blue-700 shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`;
    
    return (
        <div
            className={`fixed inset-0 z-120 flex justify-center transition-colors duration-200 ${
                isVisible ? "bg-black/30" : "bg-black/0"
            }`}
            onClick={handleClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative mt-auto w-full max-w-200 overflow-hidden rounded-t-2xl bg-white shadow-xl"
                style={{
                    height: `${heightVh}vh`,
                    transform: isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: isDragging ? "none" : "height 0.25s ease, transform 0.25s ease",
                    touchAction: "none",
                }}
            >
                
                <div className="flex items-center justify-between border-b border-slate-100 px-4 pb-4 mt-3">
                    <button onClick={handleClose} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
                        Close
                    </button>
                    <h2 className="text-base font-bold text-slate-900">Filter Options</h2>
                    <button onClick={handleApply} className="text-sm font-semibold text-blue-700 hover:text-blue-900">
                        Apply
                    </button>
                </div>
                
                <div className="px-6 py-5">
                    <div className="mb-8 flex flex-col gap-2">
                        <h3 className="text-sm font-bold text-slate-900">Sort by</h3>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setSelectedOrder(selectedOrder === "A-Z" ? null : "A-Z")} className={toggleButtonClass(selectedOrder === "A-Z")}>
                                A-Z
                            </button>
                            <button type="button" onClick={() => setSelectedOrder(selectedOrder === "Z-A" ? null : "Z-A")} className={toggleButtonClass(selectedOrder === "Z-A")}>
                                Z-A
                            </button>
                        </div>
                        <div className="flex gap-2 mb-5">
                            <button type="button" onClick={() => setSelectedByTime(selectedByTime === "latest" ? null : "latest")} className={toggleButtonClass(selectedByTime === "latest")}>
                                Latest to earliest
                            </button>
                            <button type="button" onClick={() => setSelectedByTime(selectedByTime === "earliest" ? null : "earliest")} className={toggleButtonClass(selectedByTime === "earliest")}>
                                Earliest to latest
                            </button>
                        </div>
                        
                        <Input id="section" label="Section" type="text" placeholder="Enter Section" onChange={(e) => setSelectedBySection(e.target.value)} name="section" value={selectedBySection ?? ""}/>
                        
                        <SelectionField id="strand" label="Strand" value={selectedStrand ?? ""} onChangeValue={setSelectedStrand} options={["STEM", "ABM", "HUMSS", "GAS", "AAD", "ICT", "HRCTO"]} />
                        
                        <SelectionField id="month" label="Month" value={selectedMonth ?? ""} onChangeValue={setSelectedMonth} options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]} />
                        
                        <SelectionField id="year" label="Year" value={selectedYear ?? ""} onChangeValue={setSelectedYear} options={["2020", "2021", "2022", "2023", "2024", "2025", "2026"]} />
                    </div>
                </div>
            </div>
        </div>
    );
};
