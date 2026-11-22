import Link from "next/link";
import { NUMERO_WHATSAPP } from "@/lib/utils";

export const metadata = {
  title: "Política de tratamiento de datos | Turbo Universal",
  description:
    "Cómo Importadora Turbo Universal recoge, usa y protege tus datos personales según la Ley 1581 de 2012.",
};

// EDITA con los datos legales reales de la empresa (razón social, NIT y dirección de notificaciones).
// Este texto es un modelo basado en la Ley 1581 de 2012 y el Decreto 1074 de 2015;
// la empresa debe revisarlo con su asesor legal antes de publicarlo como definitivo.
const EMPRESA = {
  razonSocial: "Importadora Turbo Universal",
  nit: "Por confirmar",
  direccion: "Calle 7 No. 16-22, La Estanzuela, Bogotá, Colombia",
  correo: "fe.turbouniversal@gmail.com",
  whatsapp: "+57 313 827 5485",
  vigencia: "22 de noviembre de 2026",
};

const derechos = [
  "Conocer, actualizar y rectificar tus datos personales.",
  "Pedir prueba de la autorización que nos diste.",
  "Saber para qué hemos usado tus datos, cuando lo solicites.",
  "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) después de haber hecho tu consulta o reclamo con nosotros.",
  "Revocar la autorización o pedir que borremos tus datos cuando no se respeten tus derechos o ya no los necesitemos.",
  "Consultar tus datos gratis.",
];

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-slate-200 pt-6">
      <h2 className="text-xl font-bold tracking-tight text-[#1a2150]">{titulo}</h2>
      <div className="mt-3 space-y-3 text-slate-600">{children}</div>
    </section>
  );
}

export default function Privacidad() {
  return (
    <main>
      <section className="fondo-marca border-b-4 border-[#e8233b] px-6 py-14 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-widest text-white/70">Ley 1581 de 2012</p>
        <h1 className="mt-2 text-3xl font-bold md:text-5xl">Política de tratamiento de datos</h1>
        <p className="mx-auto mt-3 max-w-2xl text-white/70">
          Qué datos te pedimos, para qué los usamos y cómo puedes consultarlos, corregirlos o pedir que los borremos.
        </p>
      </section>

      <article className="mx-auto max-w-3xl space-y-8 px-6 py-12 sm:px-8">
        <Seccion titulo="1. Quién es el responsable">
          <p>
            <strong>{EMPRESA.razonSocial}</strong> (NIT {EMPRESA.nit}), con domicilio en {EMPRESA.direccion}.
          </p>
          <p>
            Correo: <a className="font-semibold text-[#1a2150] underline" href={`mailto:${EMPRESA.correo}`}>{EMPRESA.correo}</a>
            {" · "}WhatsApp: {EMPRESA.whatsapp}
          </p>
        </Seccion>

        <Seccion titulo="2. Qué datos recogemos">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Cuando envías una cotización:</strong> tu nombre, tu teléfono y los productos y cantidades que
              elegiste.
            </li>
            <li>
              <strong>Mientras navegas:</strong> datos de uso sin tu nombre ni teléfono, como qué productos se ven,
              qué se busca y qué botones se pulsan. Sirven para mejorar el catálogo.
            </li>
            <li>
              <strong>En tu propio navegador:</strong> tu lista de cotización se guarda en tu equipo
              (almacenamiento local) para que no la pierdas al recargar. No la recibimos hasta que la envías.
            </li>
          </ul>
          <p>No pedimos datos sensibles ni datos de menores de edad.</p>
        </Seccion>

        <Seccion titulo="3. Para qué los usamos">
          <ul className="list-disc space-y-2 pl-5">
            <li>Responder tu cotización por WhatsApp o por teléfono.</li>
            <li>Confirmar disponibilidad, precio y entrega de los productos que pediste.</li>
            <li>Saber qué productos se buscan y se cotizan para mantener el inventario y mejorar el sitio.</li>
          </ul>
          <p>
            No vendemos ni compartimos tus datos con terceros para publicidad. Los guardamos en proveedores de
            tecnología (alojamiento y base de datos) que solo los procesan por cuenta nuestra.
          </p>
        </Seccion>

        <Seccion titulo="4. Tus derechos">
          <ul className="list-disc space-y-2 pl-5">
            {derechos.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Seccion>

        <Seccion titulo="5. Cómo ejercerlos">
          <p>
            Escríbenos a <a className="font-semibold text-[#1a2150] underline" href={`mailto:${EMPRESA.correo}`}>{EMPRESA.correo}</a>{" "}
            o por{" "}
            <a
              className="font-semibold text-[#1a2150] underline"
              href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent("Hola, quiero hacer una consulta sobre mis datos personales.")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>{" "}
            con tu nombre, tu teléfono y lo que necesitas.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Consultas</strong> (saber qué datos tenemos): te respondemos en máximo 10 días hábiles. Si
              necesitamos más tiempo, te avisamos y no pasaremos de 5 días hábiles adicionales.
            </li>
            <li>
              <strong>Reclamos</strong> (corregir, actualizar, borrar o revocar): te respondemos en máximo 15 días
              hábiles. Si necesitamos más tiempo, te avisamos y no pasaremos de 8 días hábiles adicionales.
            </li>
          </ul>
        </Seccion>

        <Seccion titulo="6. Cuánto tiempo los guardamos">
          <p>
            Mientras sean necesarios para atender tu cotización y las obligaciones legales y comerciales de la
            empresa. Después los borramos o los dejamos sin datos que te identifiquen.
          </p>
        </Seccion>

        <Seccion titulo="7. Seguridad">
          <p>
            Los datos viajan cifrados (HTTPS). La base de datos solo permite que el visitante cree cotizaciones y
            registros de uso; consultarlos exige la clave de la empresa.
          </p>
        </Seccion>

        <Seccion titulo="8. Vigencia y cambios">
          <p>
            Esta política rige desde el {EMPRESA.vigencia}. Si la cambiamos, publicaremos la nueva versión en esta
            misma página.
          </p>
        </Seccion>

        <p className="pt-4">
          <Link href="/productos" className="inline-block rounded-md bg-[#1a2150] px-6 py-3 font-semibold text-white transition hover:bg-[#d91e34]">
            Volver al catálogo
          </Link>
        </p>
      </article>
    </main>
  );
}
