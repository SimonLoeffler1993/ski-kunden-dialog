"use server"

import { ErfasseSkiKunde } from "../types/skikundetypes";

// Environment Variable
const backendHost = process.env.Backend_Host ?? "localhost";

export async function plzToOrtsname(previousState: unknown, plz: string) {
    const response = await fetch(`http://${backendHost}:8000/api/v1/orte/getname?plz=${plz}`);
    const data = await response.json();
    return data.result;
}

// Hilfsfunktion zum Speichern
async function speicherKundeNeu(kunde: ErfasseSkiKunde) {
    try {
        console.log("Speichere Kunde:", JSON.stringify(kunde));
        const response = await fetch(`http://${backendHost}:8000/api/v1/kunden/erfassen`, {
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
        console.log("Aktualisiere Kunde ID", skiKundeID, "mit Daten:", JSON.stringify(kunde));
        const response = await fetch(`http://${backendHost}:8000/api/v1/kunden/aktualisieren/${skiKundeID}`, {
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