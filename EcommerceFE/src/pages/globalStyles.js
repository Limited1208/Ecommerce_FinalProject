export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');

  .heading  { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
  .body     { font-family: 'Inter', sans-serif; }

  :root {
    --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slideIn   { from { transform: translateX(100%) } to { transform: translateX(0) } }
  @keyframes slideUp   { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes toastIn   { 0% { opacity:0; transform:translateY(16px) } 15% { opacity:1; transform:translateY(0) } 80% { opacity:1 } 100% { opacity:0; transform:translateY(-8px) } }
  @keyframes marquee   { from { transform: translateX(0) } to { transform: translateX(-50%) } }
  @keyframes pulse-fire {
    0%, 100% { box-shadow: 0 0 8px #ff6b0055, 0 0 16px #ff000033; }
    50%       { box-shadow: 0 0 20px #ff6b00aa, 0 0 40px #ff000055; }
  }

  .stagger-1 { animation: slideUp 0.7s 0.05s both var(--motion-ease); }
  .stagger-2 { animation: slideUp 0.75s 0.15s both var(--motion-ease); }
  .stagger-3 { animation: slideUp 0.75s 0.25s both var(--motion-ease); }
  .stagger-4 { animation: slideUp 0.75s 0.38s both var(--motion-ease); }

  .card-grid > *:nth-child(1) { animation: slideUp 0.65s 0.05s both var(--motion-ease); }
  .card-grid > *:nth-child(2) { animation: slideUp 0.65s 0.12s both var(--motion-ease); }
  .card-grid > *:nth-child(3) { animation: slideUp 0.65s 0.19s both var(--motion-ease); }
  .card-grid > *:nth-child(4) { animation: slideUp 0.65s 0.26s both var(--motion-ease); }
  .card-grid > *:nth-child(5) { animation: slideUp 0.65s 0.33s both var(--motion-ease); }
  .card-grid > *:nth-child(6) { animation: slideUp 0.65s 0.40s both var(--motion-ease); }

  .cart-badge { animation: fadeIn 0.25s var(--motion-ease); }
  .neon-btn   { animation: pulse-fire 2.5s ease-in-out infinite; }

  *, *::before, *::after {
    transition-timing-function: var(--motion-ease) !important;
    animation-timing-function: var(--motion-ease) !important;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0d0800; }
  ::-webkit-scrollbar-thumb { background: #ff6b0044; border-radius: 4px; }
`;