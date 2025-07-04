"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { Dispatch, SetStateAction } from "react"

type TerminalDialogProps = {
    terminalName: string | null;
    setzeTerminalName:  Dispatch<SetStateAction<string | null>>;
}

export default function TerminalDialog({setzeTerminalName, terminalName}: TerminalDialogProps) {

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        console.log("Eingegebener Name:", name);
        localStorage.setItem("terminalName", name);
        setzeTerminalName(name);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">ändern</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Terminal</DialogTitle>
                        <DialogDescription>
                            Gib den neuen Terminal Namen ein
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Input id="name" name="name" defaultValue={terminalName || ""} placeholder="Terminal Name" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Abbrechen</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit">Speichern</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
