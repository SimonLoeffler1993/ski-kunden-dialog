"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge"
import { useKundeErstellen } from "@/contex/kundeerstellen-contex";
import { normalisiereKunde } from "@/lib/kundenutils";

type StatusanzeigeProps = {
    // Adresse der API, kommt zur Laufzeit vom Server (BACKEND_URL)
    backendUrl: string;
};

export default function Statusanzeige({ backendUrl }: StatusanzeigeProps) {
    const [verbunden, setVerbunden] = useState(false);
    const {setUpdateKunde, setSkiKundeID, setKunde} = useKundeErstellen();

    

    useEffect(() => {
        const terminal = localStorage.getItem("terminalName")

        if (!terminal) {
            // TODO Alert bei fehlendem Terminalnamen
            console.error("Kein Terminalname gefunden. Bitte Terminalnamen setzen.");
            return;
        }

        let eventSource: EventSource | null = null;
        let neuVerbindenTimer: ReturnType<typeof setTimeout> | null = null;
        let beendet = false;
        let wartezeit = 1000;

        function verbinden() {
            if (beendet) return;
            eventSource = new EventSource(`${backendUrl.replace(/\/+$/, "")}/api/v1/event/connect/${encodeURIComponent(terminal!)}`);

            eventSource.onopen = () => {
                wartezeit = 1000;
                setVerbunden(true);
            };

            eventSource.onmessage = (event) => {
                let kundenDaten;
                try {
                    kundenDaten = JSON.parse(event.data);
                } catch {
                    // Keine JSON Nachricht (z.B. Testnachricht), ignorieren
                    return;
                }
                if (kundenDaten?.command === "zeige_kunde" && kundenDaten.kunde) {
                    setUpdateKunde(true);
                    setSkiKundeID(kundenDaten.kunde.id);
                    setKunde(normalisiereKunde(kundenDaten.kunde));
                }
            };

            eventSource.onerror = () => {
                setVerbunden(false);
                // Bei endgültig geschlossener Verbindung versucht der Browser es nicht mehr selbst
                if (eventSource?.readyState === EventSource.CLOSED) {
                    eventSource.close();
                    neuVerbindenTimer = setTimeout(verbinden, wartezeit);
                    wartezeit = Math.min(wartezeit * 2, 30000);
                }
            };
        }

        verbinden();

        return () => {
            beendet = true;
            if (neuVerbindenTimer) clearTimeout(neuVerbindenTimer);
            eventSource?.close();
        };
    }, [backendUrl, setUpdateKunde, setSkiKundeID, setKunde]);


    return (
        <div className="m-4">
            <Badge variant={verbunden ? "success" : "destructive"}>
                {verbunden ? "Online" : "Offline"}
            </Badge>
        </div>
    );
}