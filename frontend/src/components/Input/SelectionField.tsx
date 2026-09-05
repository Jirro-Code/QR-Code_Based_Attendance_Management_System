type SelectionFieldProps = {
    label?: string;
    id: string;
    options: string[];
    value?: string;
    onChangeValue?: (value: string) => void;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    className?: string;
    placeholder?: string;
    isRequired?: boolean;
};


export const SelectionField = ({ label, id, options, value, onChangeValue, onChange, placeholder = "Select an option", isRequired, className }: SelectionFieldProps) => {
    let selectionClassName;
    className ? (selectionClassName = className) : (selectionClassName = `mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-400 focus:border-slate-400 text-gray-500`);
    
    return (
        <div className="flex flex-col">
            {
                label && (
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                        {label}:
                    </label>
                )
            }
            <select id={id} name={id} value={value} onChange={(e) => {
                onChange?.(e);
                onChangeValue?.(e.target.value);
            }} required={isRequired ?? true} className={selectionClassName}>
                <option value="" disabled hidden>{placeholder}</option>
                <option className="text-gray-400" value="">Default</option>
                {options.map((option, index) => (
                    <option className="text-gray-900" key={index} value={option}>{option}</option>
                ))}
            </select><br/>
        </div>
    );
}