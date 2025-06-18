"use client"

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "../ui/card";

export default function StartseiteKachel(){
    const router = useRouter();
    function handleKlickErfassen(){
        router.push("kunde/erfassen")
    }
    return(
    <Card>
        <CardContent>
            <CardTitle>neu erfassen</CardTitle>
            <CardDescription>Es wird ein Kunde neu erfasst und steht in alle Skiservice Programmen dann zuverfügung.</CardDescription>
            <Button onClick={handleKlickErfassen}>Kunde erfassen</Button>
        </CardContent>
    </Card>
    );
}