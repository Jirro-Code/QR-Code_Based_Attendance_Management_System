import { useState } from "react";
import { SelectionField } from "./Input/SelectionField.tsx";

type SideFilterOptionsProps = {
    onClose: () => void;
    onApplyFilters: (
        sortAlphabetical: "A-Z" | "Z-A" | null,
        month: string | null,
        year: string | null
    ) => void;
};

export const SideFilterOptions = ({ onClose, onApplyFilters }: SideFilterOptionsProps) => {
    const [selectedOrder, setSelectedOrder] = useState<"A-Z" | "Z-A" | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    
    const handleApply = () => {
        onApplyFilters(selectedOrder, selectedMonth, selectedYear);
        onClose();
    };
    
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
                    
                    <div>
                        <input type="radio" id="asc" name="alphabetical" value="A-Z" checked={selectedOrder === "A-Z"} onChange={() => setSelectedOrder("A-Z")} className="mr-2"/>
                        <label htmlFor="asc"> A-Z</label>
                    </div>
                    
                    <div>
                        <input type="radio" id="desc" name="alphabetical" value="Z-A" checked={selectedOrder === "Z-A"} onChange={() => setSelectedOrder("Z-A")} className="mr-2"/>
                        <label htmlFor="desc"> Z-A</label>
                    </div>
                </div>
                
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-semibold">Strand:</h1>
                    <SelectionField id="strand" label="Select Strand" options={["STEM", "ABM", "HUMSS", "GAS", "TVL"]} />
                </div>
                
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-semibold">Date:</h1>
                    <label htmlFor="month" className="text-sm text-gray-600"> Select month and year:</label>
                    <SelectionField id="month" label="Select Month" onChangeValue={setSelectedMonth} options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]} />
                    <SelectionField id="year" label="Select Year" onChangeValue={setSelectedYear} options={["2020", "2021", "2022", "2023", "2024", "2025", "2026"]} />
                </div>
            </div>
        </div>
    );
};