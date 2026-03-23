import { tw } from "../assets/theme";

export default function FormField({ icon: Icon, label, value, editing = true, name, onChange, type = "text", placeholder, children, error }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className={tw.label}>{label}</label>}
            {children ?? (
                <div className={Icon ? "relative flex items-center" : ""}>
                    {Icon && <Icon size={14} className="absolute left-3.5 text-[#664433] flex-shrink-0" />}
                    <input
                        type={type}
                        name={name}
                        value={value ?? ""}
                        onChange={onChange}
                        placeholder={placeholder}
                        readOnly={!editing}
                        className={`${tw.input} ${Icon ? "pl-9" : ""} ${!editing ? "cursor-default opacity-70" : ""}`}
                    />
                </div>
            )}
            {error && <span className={tw.error}>{error}</span>}
        </div>
    );
}