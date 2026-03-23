import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { tw } from "../assets/theme";

export default function PasswordInput({ label, placeholder, value, onChange, required = true, icon: Icon }) {
    const [show, setShow] = useState(false);

    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className={tw.label}>{label}</label>}
            <div className="relative flex items-center">
                {Icon && <Icon size={14} className="absolute left-3.5 text-[#664433] flex-shrink-0" />}
                <input
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`${tw.input} ${Icon ? "pl-9" : ""} pr-10`}
                />
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 flex items-center text-[#664433] hover:text-[#ff6b00] transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                    {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
            </div>
        </div>
    );
}