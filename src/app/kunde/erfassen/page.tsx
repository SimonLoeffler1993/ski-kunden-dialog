import { connection } from "next/server";

import KundeEingabe from "@/components/kunde/erfassen/eingabe";
import Statusanzeige from "@/components/kunde/statusanzeige";
import { config } from "@/lib/config";

export default async function Erfassen() {
    // Zur Laufzeit lesen (Docker), nicht beim Build
    await connection();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Statusanzeige backendUrl={config.backendUrl} />
            <KundeEingabe />
        </div>
    );
}
