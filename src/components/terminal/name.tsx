"use client";

import { useEffect, useState } from "react";
import TerminalDialog from "./dialog";
import Statusanzeige from "@/components/kunde/statusanzeige";

export default function TerminalName() {
    const [terminalName, setTerminalName] = useState<string | null>(null);
    // Checken ob der Terminalname in der localstorege steckt
    useEffect(() => {
        setTerminalName(localStorage.getItem("terminalName"));
        console.log(terminalName);
    }, [terminalName]);

    if (terminalName === null) {
        return (
            <>
                <p className="text-red-500 font-bold">kein Terminal Name vergeben!</p>
                <TerminalDialog terminalName={terminalName} setzeTerminalName={setTerminalName} />
            </>
        );
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <p>Terminal: {terminalName}</p>
                <Statusanzeige />
            </div>
            <TerminalDialog terminalName={terminalName} setzeTerminalName={setTerminalName} />
        </>
    );
}