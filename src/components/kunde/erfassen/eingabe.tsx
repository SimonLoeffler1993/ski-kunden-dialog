import { Card, CardContent } from "@/components/ui/card";
import KundeErfassungForm from "./form";

export default function KundeEingabe() {
    return (
        <Card className="w-full py-0">
            <CardContent className="p-5 sm:p-8">
                <KundeErfassungForm />
            </CardContent>
        </Card>
    );
}
