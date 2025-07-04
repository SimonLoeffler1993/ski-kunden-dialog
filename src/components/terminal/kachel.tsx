import { Card, CardContent, CardTitle } from "../ui/card";
import TerminalName from "./name";

export default function TerminalKachel() {
    return (
        <Card>
            <CardContent>
                <CardTitle>Terminal</CardTitle>
                <TerminalName />
            </CardContent>
        </Card>
    )
}