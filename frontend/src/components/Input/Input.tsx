import styles from "./Input.module.css";

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
        <div className={styles.inputContainer}>
            <label className={styles.inputLabel} htmlFor={id}>{label}:</label><br/>
            <input className={styles.inputField} id={id} type={type} placeholder={placeholder} onChange={onChange} name={name} required={isRequired ?? true} value={value} /><br/>
        </div>
    );
}

export default Input;