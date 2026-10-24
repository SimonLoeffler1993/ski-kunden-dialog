"use client";

import { startTransition, useActionState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import KundeErfolgreichGespeichert from "@/components/kunde/erfassen/erfolgreich";
import { useKundeErstellen } from "@/contex/kundeerstellen-contex";
import { speicherKunde } from "@/lib/kundeactions";
import { ErfasseSkiKunde } from "@/types/skikundetypes";

type KundePruefenDialogProps = {
    // Eingegebene Daten, null = Dialog geschlossen
    daten: ErfasseSkiKunde | null;
    // Zurück zur Eingabe, ohne zu speichern
    onZurueck: () => void;
    // Nach dem Speichern und der Erfolgsanzeige
    onFertig: () => void;
};

function Zeile({ label, wert }: { label: string; wert: string }) {
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium break-words">{wert.trim() || "–"}</p>
        </div>
    );
}

// Zeigt die Eingabe nur an. Stimmt etwas nicht, geht es zurück zum Formular, sonst wird gespeichert
export default function KundePruefenDialog({ daten, onZurueck, onFertig }: KundePruefenDialogProps) {
    const { updateKunde, skiKundeID } = useKundeErstellen();
    const [state, action, isPending] = useActionState(speicherKunde, null);
    const gespeichert = !!daten && typeof state === "object" && state?.success === true;
    const fehler = state === "error" || (typeof state === "object" && state?.success === false);

    function speichern() {
        if (!daten) return;
        startTransition(() => action({ kunde: daten, updateKunde, skiKundeID }));
    }

    const fertig = useCallback(() => onFertig(), [onFertig]);

    return (
        <Dialog
            open={!!daten}
            onOpenChange={(offen) => {
                // Während des Speicherns und nach Erfolg nicht schließen
                if (!offen && !isPending && !gespeichert) onZurueck();
            }}
        >
            <DialogContent className="sm:max-w-lg">
                {gespeichert ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Fertig!</DialogTitle>
                            <DialogDescription>Vielen Dank.</DialogDescription>
                        </DialogHeader>
                        <KundeErfolgreichGespeichert onFertig={fertig} />
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Bitte Daten prüfen</DialogTitle>
                            <DialogDescription>
                                Stimmt alles? Falls nicht, gehe zurück und korrigiere deine Eingabe.
                            </DialogDescription>
                        </DialogHeader>
                        {daten && (
                            <div className="grid grid-cols-2 gap-4">
                                <Zeile label="Vorname" wert={daten.Vorname} />
                                <Zeile label="Nachname" wert={daten.Nachname} />
                                <div className="col-span-2"><Zeile label="Straße" wert={daten.Strasse} /></div>
                                <Zeile label="PLZ" wert={daten.Plz} />
                                <Zeile label="Ort" wert={daten.Ort} />
                                <Separator className="col-span-2" />
                                <Zeile label="Telefon" wert={daten.Tel} />
                                <Zeile label="Handy" wert={daten.Handy} />
                                <div className="col-span-2"><Zeile label="E-Mail" wert={daten.Email} /></div>
                            </div>
                        )}
                        {fehler && (
                            <p className="text-sm text-red-600">Die Daten konnten nicht gespeichert werden. Bitte wende dich an das Personal.</p>
                        )}
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={onZurueck} disabled={isPending}>
                                Zurück
                            </Button>
                            <Button type="button" onClick={speichern} disabled={isPending}>
                                {isPending ? "Speichern..." : updateKunde ? "Daten stimmen, aktualisieren" : "Daten stimmen, speichern"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
