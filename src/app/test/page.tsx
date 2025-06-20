"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function TestPage() {
    const [nachricht, setNachricht] = useState("Willkommen auf der Testseite!");
    const [verbinden, setVerbinden] = useState(false);
    const [terminal, setTerminal] = useState("Terminal1");

    useEffect(() => {
        if (!verbinden) {
            setNachricht("Verbindung ist nicht aktiv.");
            return;
        }
        const eventSource = new EventSource("http://localhost:8000/api/v1/event/connect/terminal");

        eventSource.onmessage = (event) => {
            setNachricht(event.data);
        };

        return () => {
            eventSource.close();
        };
    }, [verbinden]);

    return (
        <div>
            <h1>Test Page</h1>
            <p>This is a test page to verify client-side rendering.</p>
            <Input type="text" onChange={(e) => setTerminal(e.target.value)} value={terminal}/>
            <p>Aktuelles Terminal: {terminal}</p>
            <p>Verbindung: {verbinden ? "Aktiv" : "Inaktiv"}</p>
            <Button onClick={() => setVerbinden(!verbinden)}>
                {verbinden ? "Verbindung trennen" : "Verbindung herstellen"}
            </Button>
            <p>Nachricht vom Server: {nachricht}</p>
        </div>
    );
}