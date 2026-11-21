// Lee la configuración desde variables de entorno (nunca se escriben claves en el código).
function requerida(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre}. Revisa backend/env.ejemplo.`);
  return valor;
}

export const config = () => ({
  puerto: Number(process.env.PORT ?? 4000),
  baseDeDatos: {
    url: requerida('DATABASE_URL'),
    ssl: process.env.DATABASE_SSL === 'true',
  },
  jwtSecreto: requerida('JWT_SECRETO'),
  claveAdmin: requerida('PANEL_CLAVE'),
  origenesFront: (process.env.ORIGEN_FRONT ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
});

export type Config = ReturnType<typeof config>;
