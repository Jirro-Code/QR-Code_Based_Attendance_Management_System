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

export const Input = ({ label, id, type, placeholder, onChange, name, isRequired, value }: InputProps) => {
    return (
        <div className="flex flex-col mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
                {label}:
            </label>
            <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                id={id}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                name={name}
                required={isRequired ?? true}
                value={value}
            />
        </div>
    );
}