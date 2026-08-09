type SelectionFieldProps = {
    label: string;
    id: string;
    options: string[];
    value: string;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
    placeholder?: string;
    isRequired?: boolean;
};

export const SelectionField = ({ label, id, options, value, onChange, placeholder = "Select an option", isRequired }: SelectionFieldProps) => {
    return (
        <div className="selectionField">
            <label htmlFor={id}>{label}:</label><br/>
            <select id={id} name={id} value={value} onChange={onChange} required={isRequired ?? true}>
                <option value="" disabled hidden>{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select><br/>
        </div>
    );
}