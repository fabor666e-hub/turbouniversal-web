// Pantalla que aparece al instante mientras carga la siguiente página
export default function Cargando() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1a2150] shadow-xl">
        <svg viewBox="0 0 200 200" className="h-16 w-16 animate-spin" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <path
              key={i}
              d="M100 100 C 115 70, 140 50, 170 55 C 150 75, 125 95, 100 100Z"
              fill="white"
              transform={`rotate(${i * 45} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="16" fill="#e8233b" />
        </svg>
      </div>
      <p className="text-sm font-semibold uppercase tracking-widest text-[#1a2150]">Cargando…</p>
    </div>
  );
}
