"use server";

import { config, schluesselKopf } from "./config";

/**
 * Kurzzeit-Ticket für die SSE-Verbindung: EventSource kann keine Header senden, deshalb holt der Server
 * mit dem Geräteschlüssel ein Ticket, das der Browser als ?ticket= anhängt. Ohne Schlüssel null (Übergang).
 */
export async function holeSseTicket(terminal: string): Promise<string | null> {
    if (!config.geraeteSchluessel) return null;
    try {
        const response = await fetch(`${config.backendUrl}/api/v1/auth/ticket`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...schluesselKopf() },
            body: JSON.stringify({ pfad: `/event/connect/${terminal}` }),
            cache: "no-store",
        });
        if (!response.ok) {
            console.error("Ticket für das Kundenterminal abgelehnt:", response.status, await response.text().catch(() => ""));
            return null;
        }
        return (await response.json())?.ticket ?? null;
    } catch (error) {
        console.error("Ticket für das Kundenterminal nicht abrufbar:", error);
        return null;
    }
}
