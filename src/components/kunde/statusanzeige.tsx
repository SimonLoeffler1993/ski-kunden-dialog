"use client";

import { Badge } from "@/components/ui/badge"
import { useTerminalVerbindung } from "@/contex/terminalverbindung-contex";

// Verbindung zur API, wird vom TerminalVerbindungProvider gehalten
export default function Statusanzeige() {
    const { verbunden } = useTerminalVerbindung();

    return (
        <div className="shrink-0 pt-1">
            <Badge variant={verbunden ? "success" : "destructive"}>
                {verbunden ? "Online" : "Offline"}
            </Badge>
        </div>
    );
}
