import { FiSearch } from "react-icons/fi";
import { tw } from "../../assets/theme";

export default function SearchBar({
    value,
    onChange,
    placeholder = "Search...",
    className = "",
}) {
    return (
        <div className={`relative flex-1 max-w-xs ${className}`}>
            <FiSearch
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#664433] pointer-events-none"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`${tw.input} pl-8 py-2 text-xs w-full`}
            />
        </div>
    );
}