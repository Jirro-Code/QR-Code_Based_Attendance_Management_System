type InputProps = {
    label: string;
    id: string;
    type: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    isRequired?: boolean;
    error?: string;
    value: string | number;
};

export const Input = ({ label, id, type, placeholder, onChange, name, isRequired, value, error }: InputProps) => {
    const inputClassName = `mt-1 block w-full border ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-400 focus:border-slate-400`;
    return (
        <div className="flex flex-col mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
                {label}:
            </label>
            {type === "textarea" ? (
                <textarea
                    className={`${inputClassName} resize-none`}
                    id={id}
                    placeholder={placeholder}
                    onChange={onChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>}
                    name={name}
                    required={isRequired ?? true}
                    value={value}
                    rows={4}
                />
            ) : (
                <input className={inputClassName} id={id} type={type} placeholder={placeholder} onChange={onChange} name={name} required={isRequired ?? true} value={value} />
            )}
        </div>
    );
}