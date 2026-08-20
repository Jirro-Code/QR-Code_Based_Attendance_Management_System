import { useState } from "react";
import { SelectionField } from "./Input/SelectionField.tsx";

type FilterOptionsProps = {
    onClose: () => void;
    onApplyFilters: (
        sortAlphabetical: "A-Z" | "Z-A" | null,
        month: string | null,
        year: string | null,
        strand: string | null,
        byTime: "latest" | "earliest" | null
    ) => void;
};

export const FilterOptions = ({ onClose, onApplyFilters }: FilterOptionsProps) => {
    const [selectedOrder, setSelectedOrder] = useState<"A-Z" | "Z-A" | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedStrand, setSelectedStrand] = useState<string | null>(null);
    const [selectedByTime, setSelectedByTime] = useState<"latest" | "earliest" | null>(null);
    
    const handleApply = () => {
        onApplyFilters(selectedOrder, selectedMonth, selectedYear, selectedStrand, selectedByTime);
        onClose();
    };
    
    const toggleButtonClass = (active: boolean) =>
        `px-3 py-1.5 rounded-md text-[13px] transition-colors ${
            active ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
        }`;
        
    return (
        <div className="inset-0 min-h-screen fixed flex justify-center z-120">
            <div className="relative h-2/4 mt-auto w-full max-w-200 bg-white shadow-md p-4 rounded-t-2xl overflow-y-scroll">
                
                <button onClick={onClose} className="absolute top-4 right-4"> X </button>
                
                <div className="flex justify-between items-center mb-4">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
                    <button onClick={handleApply} className="text-blue-500 hover:text-blue-700">Apply</button>
                </div>
                
                <h2 className="text-lg font-semibold mb-4">Filter Options</h2>
                
                <div className="flex flex-col gap-4 mb-5">
                    <h1 className="text-lg font-semibold"> Alphabetical:</h1>
                    
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectedOrder(selectedOrder === "A-Z" ? null : "A-Z")}
                            className={toggleButtonClass(selectedOrder === "A-Z")}
                        >
                            A-Z
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedOrder(selectedOrder === "Z-A" ? null : "Z-A")}
                            className={toggleButtonClass(selectedOrder === "Z-A")}
                        >
                            Z-A
                        </button>
                    </div>
                </div>
                
                <div className="flex flex-col gap-1 mb-2">
                    <h1 className="text-lg font-semibold">Chronological:</h1>
                    
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectedByTime(selectedByTime === "latest" ? null : "latest")}
                            className={toggleButtonClass(selectedByTime === "latest")}
                        >
                            Latest to earliest
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedByTime(selectedByTime === "earliest" ? null : "earliest")}
                            className={toggleButtonClass(selectedByTime === "earliest")}
                        >
                            Earliest to latest
                        </button>
                    </div>
                </div>
                
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-semibold">Strand:</h1>
                    <SelectionField id="strand" label="Select Strand" onChangeValue={setSelectedStrand} options={["STEM", "ABM", "HUMSS", "GAS", "ICT", "HRCTO"]} />
                </div>
                
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-semibold">Date:</h1>
                    <SelectionField id="month" label="Select Month" onChangeValue={setSelectedMonth} options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]} />
                    <SelectionField id="year" label="Select Year" onChangeValue={setSelectedYear} options={["2020", "2021", "2022", "2023", "2024", "2025", "2026"]} />
                </div>
            </div>
        </div>
    );
};