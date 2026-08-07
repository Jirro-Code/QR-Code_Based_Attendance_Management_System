function Input({ label, id, type, placeholder, onChange, name, isRequired }: { label: string; id: string; type: string; placeholder: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string; isRequired?: boolean }) {
    return (
        <div className="inputField">
            <label htmlFor={id}>{label}:</label><br/>
            <input id={id} type={type} placeholder={placeholder} onChange={onChange} name={name} required={isRequired ?? true} /><br/>
        </div>
    );
}

export default Input;