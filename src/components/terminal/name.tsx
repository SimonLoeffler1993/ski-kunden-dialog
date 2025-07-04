"use client";

import { useEffect, useState } from "react";
import TerminalDialog from "./dialog";

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
            <p>Terminal: {terminalName}</p>
            <TerminalDialog terminalName={terminalName} setzeTerminalName={setTerminalName} />
        </>
    );
}