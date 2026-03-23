import { tw } from "../assets/theme";

export default function AuthCard({ children, wide = false }) {
  return (
    <div
      className={`${tw.card} animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_both] w-full p-10 ${wide ? "max-w-[440px]" : "max-w-[420px]"}`}
      style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,0,0.05)" }}
    >
      {children}
    </div>
  );
}