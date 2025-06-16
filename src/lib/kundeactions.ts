"use server"

import { ErfasseSkiKunde } from "../../types/skikundetypes";

// Environment Variable
const backendHost = process.env.Backend_Host ?? "localhost";

export async function plzToOrtsname(previousState: unknown, plz: string) {
    const response = await fetch(`http://${backendHost}:8000/api/v1/orte/getname?plz=${plz}`);
    const data = await response.json();
    return data.result;
}


export async function speicherKunde(previousState: unknown, kunde: ErfasseSkiKunde) {
    try {

        console.log(JSON.stringify(kunde));
        console.log("------");

        const response = await fetch(`http://${backendHost}:8000/api/v1/kunden/erfassen`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(kunde),
        });
        if (!response.ok) {
            console.error("Beim Kunde Speichern ist ein Fehler aufgetreten ", response);
            return "error"
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        return "error"
    }
}