import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import KundePruefungDetails from "@/components/kunde/pruefen/detail";
import KundeSpeicherButton from "./kundeSpeicherButton";
import { Separator } from "@/components/ui/separator";

export default function KundePruefung() {


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-xl p-4">
                <CardHeader>
                    <CardTitle>Eingabe Prüfuen</CardTitle>
                    <CardDescription>Prüfe die Eingabe, und klicke anschließend auf Speichern.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <KundePruefungDetails  wertBeschreibung="Vorname" kundeKey="Vorname" />
                        <KundePruefungDetails  wertBeschreibung="Nachname" kundeKey="Nachname" />
                        <div className="col-span-2" >
                            <KundePruefungDetails  wertBeschreibung="Srtraße" kundeKey="Strasse" />
                        </div>
                        <KundePruefungDetails wertBeschreibung="PLZ" kundeKey="Plz"/>
                        <KundePruefungDetails  wertBeschreibung="Ort" canEditing={false} kundeKey="Ort"/>
                        <Separator className="col-span-2" />
                        <KundePruefungDetails  wertBeschreibung="Telefon" kundeKey="Tel"/>
                        <KundePruefungDetails  wertBeschreibung="Handy" kundeKey="Handy"/>
                        <div className="col-span-2">
                            <KundePruefungDetails  wertBeschreibung="E-Mail" kundeKey="Email"/>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <KundeSpeicherButton />
                </CardFooter>
            </Card>
        </div>
    );
}