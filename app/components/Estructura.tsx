"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FACEBOOK, INSTAGRAM, LINK_CATALOGO, NUMERO_WHATSAPP, precio } from "@/lib/utils";
import { usarCotizacion } from "./Cotizacion";
import { guardarCotizacion } from "@/lib/rastreo";
import { IconoCorreo, IconoReloj, IconoTelefono, IconoUbicacion, IconoWhatsApp } from "./Iconos";


const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/productos", texto: "Productos" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/asistente", texto: "Asistente" },
  { href: "/marcas", texto: "Marcas" },
  { href: "/puntos-de-venta", texto: "Puntos de venta" },
];

export function Header() {
  const { totalUnidades, setAbierto } = usarCotizacion();
  const pathname = usePathname();
  const activo = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="bg-[#1a2150] px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        Arma tu cotización en línea y recibe respuesta de un asesor por WhatsApp
      </div>

      <header className="sticky top-0 z-30 bg-white/90 px-4 py-3 shadow-sm backdrop-blur sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Turbo Universal, inicio">
            <Image
              src="/logo.png"
              alt="Importadora Turbo Universal"
              width={180}
              height={72}
              priority
              className="h-12 w-auto"
            />
          </Link>

          <nav className="hidden gap-8 text-sm font-medium text-[#1a2150] md:flex">
            {enlaces.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className={`transition-colors duration-500 hover:text-[#e8233b] ${
                  activo(e.href) ? "font-bold text-[var(--acento)]" : ""
                }`}
              >
                {e.texto}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setAbierto(true)}
              className="relative rounded-full border-2 border-[#1a2150] px-3 py-2 text-sm font-semibold text-[#1a2150] transition hover:bg-[#1a2150] hover:text-white sm:px-4"
            >
              Mi cotización
              {totalUnidades > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#e8233b] text-xs font-bold text-white">
                  {totalUnidades}
                </span>
              )}
            </button>
            <a
              href="#contacto"
              className="hidden rounded-full bg-[var(--acento)] px-5 py-2 text-sm font-semibold text-white transition duration-700 hover:brightness-90 sm:block"
            >
              Contacto
            </a>
          </div>
        </div>

        {/* Menú en celular */}
        <nav className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm font-medium text-[#1a2150] md:hidden">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className={activo(e.href) ? "font-bold text-[var(--acento)]" : ""}
            >
              {e.texto}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}

// Datos de contacto que se muestran en el pie (fuente: turbouniversal.com.co)
const SEDES = [
  { ciudad: "Bogotá", direccion: "Calle 7 No. 16-22, La Estanzuela", telefono: "322 449 4190" },
  { ciudad: "Medellín", direccion: "Calle 45A No. 59-52, Barrio Triste", telefono: "304 317 3143" },
  { ciudad: "Cali", direccion: "Calle 34 No. 3-33, local 101", telefono: "" },
  { ciudad: "Duitama", direccion: "Carrera 42 No. 14-33, Sevilla 2", telefono: "" },
];
const CORREO = "fe.turbouniversal@gmail.com";
const telefonoVisible = (n: string) => `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}`;

export function Footer() {
  const enlace = "transition hover:text-white";
  return (
    <footer id="contacto" className="mt-16 bg-[#1a2150] px-8 pb-8 pt-14 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xl font-extrabold">
            TURBO <span className="text-[#ff6b7d]">UNIVERSAL</span>
          </p>
          <p className="mt-3 text-sm text-white/70">
            Importadora de turboalimentadores y repuestos con calidad de equipo original. Distribuidores
            oficiales de Turboman y Master Power.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              data-track="instagram-pie"
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Turboman"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#e8233b]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            <a
              data-track="facebook-pie"
              href={FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook de Turboman"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#e8233b]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <p className="font-semibold">Enlaces</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {enlaces.map((e) => (
              <li key={e.href}>
                <Link className={enlace} href={e.href}>
                  {e.href === "/asistente" ? "Asistente por vehículo" : e.texto}
                </Link>
              </li>
            ))}
            <li>
              <a className={enlace} href={LINK_CATALOGO} target="_blank" rel="noopener noreferrer">
                Catálogo completo (PDF)
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold">Sedes</p>
          <ul className="mt-3 space-y-3 text-sm text-white/70">
            {SEDES.map((s) => (
              <li key={s.ciudad}>
                <Link href="/puntos-de-venta" className={`flex gap-2 ${enlace}`}>
                  <IconoUbicacion className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6b7d]" />
                  <span>
                    <b className="text-white">{s.ciudad}</b>
                    <br />
                    {s.direccion}
                  </span>
                </Link>
                {s.telefono && (
                  <a
                    href={`tel:+57${s.telefono.replace(/\s/g, "")}`}
                    className={`mt-1 flex items-center gap-2 pl-6 ${enlace}`}
                  >
                    <IconoTelefono className="h-3.5 w-3.5" />
                    {s.telefono}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold">Contacto</p>
          <ul className="mt-3 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <IconoWhatsApp className="h-4 w-4 shrink-0" />
              WhatsApp: {telefonoVisible(NUMERO_WHATSAPP)}
            </li>
            <li>
              <a href={`mailto:${CORREO}`} className={`flex items-center gap-2 break-all ${enlace}`}>
                <IconoCorreo className="h-4 w-4 shrink-0" />
                {CORREO}
              </a>
            </li>
            <li className="flex gap-2">
              <IconoReloj className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Lunes a viernes: 8:00 a. m. a 6:00 p. m.
                <br />
                Sábados: 8:00 a. m. a 1:00 p. m.
              </span>
            </li>
          </ul>
          <a
            data-track="whatsapp-pie"
            href={`https://wa.me/${NUMERO_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d91e34] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#c71c32]"
          >
            <IconoWhatsApp className="h-4 w-4" />
            Escríbenos
          </a>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Importadora Turbo Universal. Todos los derechos reservados.
      </p>
    </footer>
  );
}

export function WhatsAppFlotante() {
  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
      <div className="flex gap-3">
        <a
          data-track="instagram"
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de Turboman"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1a2150] shadow-lg transition hover:bg-[#e8233b] hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
        </a>
        <a
          data-track="facebook"
          href={FACEBOOK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook de Turboman"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1a2150] shadow-lg transition hover:bg-[#e8233b] hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z" />
          </svg>
        </a>
      </div>

      <a
        data-track="whatsapp-flotante"
        href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent("Hola, necesito ayuda con una cotización.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="pulso flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition hover:scale-110"
      >
        <IconoWhatsApp className="h-7 w-7" />
      </a>
    </div>
  );
}

export function PanelCotizacion() {
  const { items, abierto, setAbierto, totalPrecio, cambiar, quitar } = usarCotizacion();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const formularioCompleto = nombre.trim().length > 1 && telefono.trim().length >= 7;

  const enviarWhatsApp = () => {
    const lineas = items.map(
      (i) => `• ${i.cantidad} x ${i.p.nombre} (Ref. ${i.p.referencia})`
    );
    const mensaje = [
      "Hola, quiero cotizar los siguientes productos:",
      "",
      ...lineas,
      "",
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
    ].join("\n");
    guardarCotizacion({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      items: items.map((i) => ({
        referencia: i.p.referencia,
        nombre: i.p.nombre,
        cantidad: i.cantidad,
        precio: i.p.precio,
      })),
      total: totalPrecio,
    });
    window.open(
      `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  };

  return (
    <>
      <div
        onClick={() => setAbierto(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform duration-300 ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between bg-[#1a2150] px-6 py-4 text-white">
          <h2 className="text-lg font-bold">Mi cotización</h2>
          <button onClick={() => setAbierto(false)} className="text-2xl leading-none hover:text-[#ff6b7d]">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-slate-400">
              Aún no has agregado productos.
              <br />
              Busca un turbo y presiona “Agregar a cotización”.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map(({ p, cantidad }) => (
                <li key={p.referencia} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#1a2150]">{p.nombre}</p>
                      <p className="text-xs text-slate-400">Ref. {p.referencia}</p>
                    </div>
                    <button
                      onClick={() => quitar(p.referencia)}
                      className="text-sm text-slate-400 hover:text-[#e8233b]"
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => cambiar(p.referencia, -1)}
                        className="h-8 w-8 rounded-full border border-slate-300 font-bold hover:bg-slate-200"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-semibold">{cantidad}</span>
                      <button
                        onClick={() => cambiar(p.referencia, 1)}
                        disabled={cantidad >= p.stock}
                        className="h-8 w-8 rounded-full border border-slate-300 font-bold hover:bg-slate-200 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-[#e8233b]">{precio(p.precio * cantidad)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t bg-white p-6">
            <div className="flex justify-between text-lg font-bold text-[#1a2150]">
              <span>Total estimado</span>
              <span>{precio(totalPrecio)}</span>
            </div>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#e8233b]"
            />
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Tu teléfono"
              inputMode="tel"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#e8233b]"
            />
            <button
              onClick={enviarWhatsApp}
              disabled={!formularioCompleto}
              className="w-full rounded-full bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Enviar cotización por WhatsApp
            </button>
            <p className="text-center text-xs text-slate-400">
              Usaremos tus datos solo para responder tu cotización. Precios de ejemplo; la disponibilidad final se confirma con un asesor.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}