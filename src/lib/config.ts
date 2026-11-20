// function getEnv(name: string): string {
//   const value = process.env[name];
//   if (!value) {
//     throw new Error(`Environment variable "${name}" is missing`);
//   }
//   return value;
// }

export const config = {
    // TODO: wen env existiert prüfen das am schluss kein slash ist
    // backendUrl: getEnv('NEXT_PUBLIC_BACKEND_URL') || 'http://localhost:8000',
    backendUrl: process.env.BACKEND_URL ?? 'http://localhost:8000',
    // Geräteschlüssel "Kundenterminal" aus dem Center (Verwalten → Geräte), nur auf dem Server
    geraeteSchluessel: process.env.GERAETE_SCHLUESSEL?.trim() || undefined,
};

/** Header mit dem Geräteschlüssel für die API; ohne Schlüssel leer (Übergang). */
export function schluesselKopf(): Record<string, string> {
    return config.geraeteSchluessel ? { "X-Geraete-Schluessel": config.geraeteSchluessel } : {};
}