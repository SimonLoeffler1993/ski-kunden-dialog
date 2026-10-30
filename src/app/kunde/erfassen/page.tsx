import KundeEingabe from "@/components/kunde/erfassen/eingabe";
import Statusanzeige from "@/components/kunde/statusanzeige";

export default function Erfassen() {
    return (
        // Oben ausgerichtet statt zentriert, damit nichts springt, wenn die Tastatur aufgeht
        <main className="min-h-dvh bg-gray-100 px-4 pt-6 pb-10 sm:px-6 sm:pt-10">
            <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
                <header className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Deine Daten</h1>
                        <p className="text-muted-foreground sm:text-lg">
                            Bitte trage deine Kontaktdaten ein. Anschließend kannst du alles noch einmal prüfen.
                        </p>
                    </div>
                    <Statusanzeige />
                </header>
                <KundeEingabe />
            </div>
        </main>
    );
}
