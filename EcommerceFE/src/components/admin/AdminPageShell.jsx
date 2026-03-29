import { tw } from "../../assets/theme";

export default function AdminPageShell({ kicker, title, description, children }) {
    return (
        <div className="max-w-6xl">
            <p className={`${tw.labelOrange} mb-2`}>{kicker}</p>
            <h2 className="heading text-2xl text-white mb-2">{title}</h2>
            {description && <p className="text-sm text-[#664433] mb-6 max-w-2xl leading-relaxed">{description}</p>}
            {children}
        </div>
    );
}
