"use server"

import { ErfasseSkiKunde } from "../types/skikundetypes";
import { config } from "./config";

// Environment Variable
// const backendHost = process.env.Backend_Host ?? "localhost";
// const backendPort = process.env.Backend_Port ?? "8000";

// Orte zu einer PLZ, z.B. ["Weingarten"]. Wirft bei Fehlern, damit useQuery sie anzeigen kann
export async function getOrte(plz: string): Promise<string[]> {
    if (!/^\d{5}$/.test(plz)) return [];
    const response = await fetch(`${config.backendUrl}/api/v1/orte/getname?plz=${plz}`, { cache: "no-store" });
    if (!response.ok) {
        throw new Error("PLZ konnte nicht geprüft werden");
    }
    const daten: { Ort: string }[] = await response.json();
    return daten.map((eintrag) => eintrag.Ort);
}

// Hilfsfunktion zum Speichern
async function speicherKundeNeu(kunde: ErfasseSkiKunde) {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/kunden/erfassen`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(kunde),
        });

        if (!response.ok) {
            console.error("Fehler beim Speichern", response);
            return "error";
        }

        return await response.json();
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        return "error";
    }
}

// Hilfsfunktion zum Aktualisieren
async function updateKundeNeu(kunde: ErfasseSkiKunde, skiKundeID: number | null) {
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/kunden/${skiKundeID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(kunde),
        });

        if (!response.ok) {
            console.error("Fehler beim Aktualisieren", response);
            return "error";
        }

        return await response.json();
    } catch (error) {
        console.error("Fehler beim Aktualisieren:", error);
        return "error";
    }
}

type SpeicherKundeInpuzType = {
    kunde: ErfasseSkiKunde;
    updateKunde: boolean;
    skiKundeID: number | null;
}

export async function speicherKunde(previousState: unknown, data: SpeicherKundeInpuzType) {
    // try {

    //     console.log(JSON.stringify(kunde));
    //     console.log("------");

    //     const response = await fetch(`http://${backendHost}:8000/api/v1/kunden/erfassen`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(kunde),
    //     });
    //     if (!response.ok) {
    //         console.error("Beim Kunde Speichern ist ein Fehler aufgetreten ", response);
    //         return "error"
    //     }
    //     const data = await response.json();
    //     return data;
    // }
    // catch (error) {
    //     console.error("Fehler beim Laden der Daten:", error);
    //     return "error"
    // }

    if(data.updateKunde){
        if(data.skiKundeID === null) {
            console.error("skiKundeID ist erforderlich, um einen Kunden zu aktualisieren.");
            return "error";
        }
        return await updateKundeNeu(data.kunde, data.skiKundeID);
    }else {
        return await speicherKundeNeu(data.kunde);
    }
}