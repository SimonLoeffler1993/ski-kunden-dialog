"use client"

import { useEffect, useState } from "react";
import { CheckIcon } from "@radix-ui/react-icons";

import { Progress } from "@/components/ui/progress";

type KundeErfolgreichGespeichertProps = {
    // Wird nach Ablauf der Anzeige aufgerufen (ca. 5 Sekunden)
    onFertig: () => void;
};

export default function KundeErfolgreichGespeichert({ onFertig }: KundeErfolgreichGespeichertProps) {
    const [count, setCount] = useState(100);

    useEffect(() => {
        if (count <= 0) {
            onFertig();
            return;
        }
        const timer = setTimeout(() => setCount((wert) => wert - 2), 100);
        return () => clearTimeout(timer);
    }, [count, onFertig]);

    return (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckIcon className="h-12 w-12 text-green-600" />
            <p className="text-lg font-medium">Deine Daten wurden erfolgreich gespeichert!</p>
            <Progress value={count} />
        </div>
    );
}
