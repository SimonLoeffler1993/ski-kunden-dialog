"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useKundeErstellen } from "@/contex/kundeerstellen-contex";
import { normalisiereKunde } from "@/lib/kundenutils";

// Wird vom Terminal-Dialog ausgelöst, wenn der Terminalname geändert wurde
export const TERMINALNAME_GEAENDERT = "terminalname-geaendert";

// Die API sendet alle 15 s ein Ping, kommt so lange nichts, ist die Verbindung tot
const WATCHDOG_MS = 40000;

type TerminalVerbindungContextType = {
    verbunden: boolean;
};

const TerminalVerbindungContext = createContext<TerminalVerbindungContextType | null>(null);

type TerminalVerbindungProviderProps = {
    // Adresse der API, kommt zur Laufzeit vom Server (BACKEND_URL)
    backendUrl: string;
    children: React.ReactNode;
};

// Hält die Verbindung zur API auf allen Seiten, damit das Center jederzeit einen Kunden senden kann
export default function TerminalVerbindungProvider({ backendUrl, children }: TerminalVerbindungProviderProps) {
    const [verbunden, setVerbunden] = useState(false);
    const [terminal, setTerminal] = useState<string | null>(null);
    const { setUpdateKunde, setSkiKundeID, setKunde } = useKundeErstellen();
    const router = useRouter();
    const pathname = usePathname();

    // Terminalname aus dem localStorage, bei Änderung neu lesen
    useEffect(() => {
        const lesen = () => setTerminal(localStorage.getItem("terminalName"));
        lesen();
        window.addEventListener(TERMINALNAME_GEAENDERT, lesen);
        window.addEventListener("storage", lesen);
        return () => {
            window.removeEventListener(TERMINALNAME_GEAENDERT, lesen);
            window.removeEventListener("storage", lesen);
        };
    }, []);

    // Aktuelle Seite für den Nachrichten-Handler, ohne bei jedem Seitenwechsel neu zu verbinden
    const seite = useRef(pathname);
    useEffect(() => {
        seite.current = pathname;
    }, [pathname]);

    useEffect(() => {
        // Ohne Terminalname keine Verbindung
        if (!terminal) return;

        let eventSource: EventSource | null = null;
        let neuVerbindenTimer: ReturnType<typeof setTimeout> | null = null;
        let watchdog: ReturnType<typeof setTimeout> | null = null;
        let beendet = false;
        let wartezeit = 1000;

        function neuVerbindenSpaeter() {
            eventSource?.close();
            if (beendet) return;
            neuVerbindenTimer = setTimeout(verbinden, wartezeit);
            wartezeit = Math.min(wartezeit * 2, 30000);
        }

        // Bei jedem Lebenszeichen neu starten, sonst gilt die Verbindung als tot
        function lebenszeichen() {
            if (watchdog) clearTimeout(watchdog);
            watchdog = setTimeout(() => {
                setVerbunden(false);
                neuVerbindenSpaeter();
            }, WATCHDOG_MS);
        }

        function verbinden() {
            if (beendet) return;
            eventSource = new EventSource(`${backendUrl.replace(/\/+$/, "")}/api/v1/event/connect/${encodeURIComponent(terminal!)}`);

            eventSource.onopen = () => {
                wartezeit = 1000;
                setVerbunden(true);
                lebenszeichen();
            };

            eventSource.addEventListener("ping", lebenszeichen);

            eventSource.onmessage = (event) => {
                lebenszeichen();
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
                    // Von jeder Seite direkt in die Erfassung
                    if (seite.current !== "/kunde/erfassen") router.push("/kunde/erfassen");
                }
            };

            eventSource.onerror = () => {
                setVerbunden(false);
                // Bei endgültig geschlossener Verbindung versucht der Browser es nicht mehr selbst
                if (eventSource?.readyState === EventSource.CLOSED) {
                    if (watchdog) clearTimeout(watchdog);
                    neuVerbindenSpaeter();
                }
            };
        }

        verbinden();

        return () => {
            beendet = true;
            if (neuVerbindenTimer) clearTimeout(neuVerbindenTimer);
            if (watchdog) clearTimeout(watchdog);
            eventSource?.close();
            setVerbunden(false);
        };
    }, [backendUrl, terminal, router, setUpdateKunde, setSkiKundeID, setKunde]);

    return (
        <TerminalVerbindungContext.Provider value={{ verbunden }}>
            {children}
        </TerminalVerbindungContext.Provider>
    );
}

export function useTerminalVerbindung() {
    const context = useContext(TerminalVerbindungContext);
    if (!context) {
        throw new Error("useTerminalVerbindung must be used within a TerminalVerbindungProvider");
    }
    return context;
}
