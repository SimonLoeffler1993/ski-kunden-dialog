import {z} from "zod";
export const skiKundeSchema = z.object({
    ID: z.number(),
    Nachname: z.string(),
    Vorname: z.string(),
    Strasse: z.string(),
    Plz: z.number(),
    Ort: z.string(),
    Tel: z.string(),
    Handy: z.string(),
    Email: z.string(),
})

export type SkiKunde = z.infer<typeof skiKundeSchema>


export const erfasseKundeSchema = z.object({
    Nachname: z.string(),
    Vorname: z.string(),
    Strasse: z.string(),
    Plz: z.string(),
    Ort: z.string(),
    Tel: z.string(),
    Handy: z.string(),
    Email: z.string(),
}).refine(
    (data) => data.Vorname.trim() !== "" || data.Nachname.trim() !== "",
    {
        message: "Mindestens Vorname oder Nachname muss angegeben sein.",
        path: ["Vorname"],
    }
)
export type ErfasseSkiKunde = z.infer<typeof erfasseKundeSchema>