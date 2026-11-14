// Íconos SVG de la marca (reemplazan los emojis). Heredan el color con currentColor.
type P = { className?: string };
const base = (className = "h-5 w-5") => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const IconoBuscar = ({ className }: P) => (
  <svg {...base(className)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);

export const IconoEscudo = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>
);

export const IconoLista = ({ className }: P) => (
  <svg {...base(className)}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>
);

export const IconoCaja = ({ className }: P) => (
  <svg {...base(className)}><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="m3 8 9 5 9-5M12 13v8" /></svg>
);

export const IconoLibro = ({ className }: P) => (
  <svg {...base(className)}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></svg>
);

export const IconoUbicacion = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);

export const IconoTelefono = ({ className }: P) => (
  <svg {...base(className)}><path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" /></svg>
);

export const IconoCorreo = ({ className }: P) => (
  <svg {...base(className)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);

export const IconoReloj = ({ className }: P) => (
  <svg {...base(className)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);

// Burbuja de chat con teléfono (para los botones de WhatsApp)
export const IconoWhatsApp = ({ className = "h-6 w-6" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
    <path d="M16.6 14.2c-.3-.1-1.5-.8-1.8-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
  </svg>
);

// Rueda de turbo: se usa cuando un producto aún no tiene foto
export const IconoTurbo = ({ className = "h-16 w-16" }: P) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="3" />
    {Array.from({ length: 8 }).map((_, i) => (
      <path
        key={i}
        d="M32 32c4-8 10-13 18-13-5 6-11 11-18 13Z"
        fill="currentColor"
        transform={`rotate(${i * 45} 32 32)`}
      />
    ))}
    <circle cx="32" cy="32" r="5" fill="#e8233b" />
  </svg>
);
