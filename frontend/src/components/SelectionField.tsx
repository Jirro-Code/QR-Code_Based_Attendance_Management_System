

function SelectionField({ label, id, options, value, onChange}: {label: string; id: string; options: string[]; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;}) {
    return (
        <div className="selectionField">
            <label htmlFor={id}>{label}:</label><br/>
            <select id={id} name={id} value={value} onChange={onChange} required>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select><br/>
        </div>
    );
}

export default SelectionField;