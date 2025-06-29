"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge"
import { useKundeErstellen } from "@/contex/kundeerstellen-contex";

export default function Statusanzeige() {
    const [verbunden, setVerbunden] = useState(false);
    const {setUpdateKunde, setSkiKundeID, setKunde} = useKundeErstellen();

    useEffect(() => {
        const terminal = localStorage.getItem("terminalName")

        if (!terminal) {
            // TODO Alert bei fehlendem Terminalnamen
             console.error("Kein Terminalname gefunden. Bitte Terminalnamen setzen.");
            return;
        }

        // TODO URL aus der Konfiguration laden
        const eventSource = new EventSource(`http://localhost:8000/api/v1/event/connect/${terminal}`);

        eventSource.onopen = () => {
            // console.log("Verbindung zum Server hergestellt.");
            setVerbunden(true);
        };

        eventSource.onmessage = (event) => {
            // console.log(event.data);
            const kundenDaten = JSON.parse(event.data);
            // Hier können Sie die empfangenen Kundendaten verarbeiten
            // Zum Beispiel: console.log("Empfangene Kundendaten:", kundenDaten);
            // console.log("Empfangene Kundendaten:", kundenDaten);
            if (kundenDaten.command === "zeige_kunde"){
                setUpdateKunde(true);
                setSkiKundeID(kundenDaten.kunde.id);
                setKunde(kundenDaten.kunde);
            }
        };

        eventSource.onerror = (error) => {
            console.error("Fehler bei der Verbindung:", error);
            setVerbunden(false);
        };

        return () => {
            // console.log("Verbindung wird geschlossen.");
            eventSource.close();
        };
    }, [setUpdateKunde, setSkiKundeID, setKunde]);
    

    return (
        <div className="m-4">
            <Badge variant={verbunden ? "success" : "destructive"}>
                {verbunden ? "Online" : "Offline"}
            </Badge>
        </div>
    );
}