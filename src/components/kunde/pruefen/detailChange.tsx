"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { ErfasseSkiKunde } from "../../../types/skikundetypes";
import { useKundeErstellen } from "../../../contex/kundeerstellen-contex";

type KundePruefungDetailsChangeProps = {
    kundeKey: keyof ErfasseSkiKunde;
    toggleOff: React.Dispatch<React.SetStateAction<boolean>>;
};
// TODO auf react-hool-form umstellen
export default function KundePruefungDetailsChange({
    kundeKey,
    toggleOff,
}: KundePruefungDetailsChangeProps) {
    const { kunde, setKunde } = useKundeErstellen();
    const [wert, setWert] = useState(kunde[kundeKey] ?? "");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setKunde({ ...kunde, [kundeKey]: wert });
        toggleOff(false);
    }

    function handleCancel(e: FormEvent) {
        e.stopPropagation();
        setWert(kunde[kundeKey] ?? "");
        toggleOff(false);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
                type="text"
                value={wert}
                onChange={(e) => setWert(e.target.value)}
                autoFocus
            />
            <Button type="submit" variant="default">
                Speichern
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
                Abbrechen
            </Button>
        </form>
    );
}
