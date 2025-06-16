"use client";
import {startTransition, useActionState, useEffect} from "react";
import { Button } from "@/components/ui/button";
import { useKundeErstellen } from "../../../../contex/kundeerstellen-contex";
import { speicherKunde } from "@/lib/kundeactions";

export default function KundeSpeicherButton() {

    const {kunde, setEingabe} = useKundeErstellen();
    const [state, action, isPending] = useActionState(speicherKunde, null);

    function speichern(){
        startTransition(() => action(kunde));
    
    }

    useEffect(() => {
        if(state?.success) {
            setEingabe(true)
        }
    },[state, setEingabe])

   
    if (isPending) {
        return (
            <Button className="w-full" disabled>Speichern...</Button>
        );
    }

    return (
        <>
            <Button className="w-full" onClick={speichern}>Speichern</Button>
            {/* TODO Fehler anzeigen */}
            {state == "error" && <p>Es gab ein Fehler</p>}
        </>
    );
}   