type InputProps = {
    label: string;
    id: string;
    type: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    isRequired?: boolean;
    value: string | number;
};

function Input({ label, id, type, placeholder, onChange, name, isRequired, value }: InputProps) {
    return (
        <div className="inputField">
            <label htmlFor={id}>{label}:</label><br/>
            <input id={id} type={type} placeholder={placeholder} onChange={onChange} name={name} required={isRequired ?? true} value={value} /><br/>
        </div>
    );
}

export default Input;