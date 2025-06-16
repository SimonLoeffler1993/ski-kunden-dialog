"use client"

import KundePruefung from "@/components/kunde/pruefen/kundepruefung";
import { useKundeErstellen } from "../../../../../contex/kundeerstellen-contex";
import KundeErfolgreichGespeichert from "@/components/kunde/erfassen/erfolgreich";

export default function KundePruefen() {
    const {eingabe} = useKundeErstellen();

    if (eingabe){
        return(
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <KundeErfolgreichGespeichert />
            </div>
        )
    }
    return (
        <>
            <KundePruefung />
        </>
    );
}