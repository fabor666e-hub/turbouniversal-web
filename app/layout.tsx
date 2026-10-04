import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Proveedor } from "./components/Cotizacion";
import { Header, Footer, PanelCotizacion, WhatsAppFlotante } from "./components/Estructura";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turbo Universal | Turboalimentadores Turboman",
  description:
    "Importadora Turbo Universal: turboalimentadores y repuestos con calidad de equipo original en Colombia. Busca, revisa disponibilidad y cotiza en línea.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Proveedor>
          <Header />
          {children}
          <Footer />
          <PanelCotizacion />
          <WhatsAppFlotante />
        </Proveedor>
      </body>
    </html>
  );
}