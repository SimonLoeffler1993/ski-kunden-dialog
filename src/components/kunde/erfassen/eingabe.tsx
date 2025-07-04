
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card";
import KundeErfassungForm from "./form";


export default function KundeEingabe() {
    return (
        <>
            <Card className="w-full max-w-xl p-4">
                <CardHeader>
                    <CardTitle>Kunde erfassen</CardTitle>
                    <CardDescription>Hier kannst du einen neuen Kunden erfassen.</CardDescription>
                </CardHeader>
                <CardContent>
                    <KundeErfassungForm />
                </CardContent>
            </Card>
        </>
    );
}