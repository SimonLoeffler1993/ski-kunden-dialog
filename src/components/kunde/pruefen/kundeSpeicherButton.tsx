"use client";
import {startTransition, useActionState, useEffect} from "react";
import { Button } from "@/components/ui/button";
import { useKundeErstellen } from "../../../contex/kundeerstellen-contex";
import { speicherKunde } from "@/lib/kundeactions";

export default function KundeSpeicherButton() {

    const {kunde, setKunde, setEingabe, updateKunde, setUpdateKunde, skiKundeID} = useKundeErstellen();
    const [state, action, isPending] = useActionState(speicherKunde, null);

    function speichern(){
        console.log("Speichere Kunde:", skiKundeID);
        if (!kunde) {
            console.error("Kunde ist nicht definiert");
            return;
        }
        startTransition(() => action({kunde, updateKunde, skiKundeID}));
    }

    useEffect(() => {
        if(state?.success) {
            // Daten erfolgreich gespeichert
            // TODO Daten im CustomHook zurücksetzen
            setUpdateKunde(false);
            setKunde(null);
            setEingabe(true)
        }
    },[state, setEingabe, setUpdateKunde, setKunde])

   
    if (isPending) {
        return (
            <Button className="w-full" disabled>Speichern...</Button>
        );
    }

    return (
        <>
            <Button className="w-full" onClick={speichern}>{updateKunde ? "Aktualisieren" : "Speichern"}</Button>
            {/* TODO Fehler anzeigen */}
            {state == "error" && <p>Es gab ein Fehler</p>}
        </>
    );
}   