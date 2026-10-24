import { ErfasseSkiKunde } from "@/types/skikundetypes";
// Ändert die inhalte von null auf string, damit die Validierung von zod nicht fehlschlägt
export function normalisiereKunde(raw: Record<string, unknown>): ErfasseSkiKunde {
    const s = (v: unknown) => (v == null ? "" : String(v));
    return {
        Vorname: s(raw.Vorname),
        Nachname: s(raw.Nachname),
        Strasse: s(raw.Strasse),
        Plz: s(raw.Plz),
        Ort: s(raw.Ort),
        Tel: s(raw.Tel),
        Handy: s(raw.Handy),
        Email: s(raw.Email),
    };
}