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


export const erfasseKundeSchema = z
    .object({
        Nachname: z.string().trim(),
        Vorname: z.string().trim(),
        Strasse: z.string().trim(),
        Plz: z.string().trim(),
        Ort: z.string().trim(),
        Tel: z.string().trim(),
        Handy: z.string().trim(),
        Email: z.string().trim().email("Ungültige E-Mail-Adresse").or(z.literal("")),
    })
    .refine((data) => data.Vorname !== "" || data.Nachname !== "", {
        message: "Mindestens Vorname oder Nachname muss angegeben sein.",
        path: ["Vorname"],
    })
    .refine((data) => data.Tel !== "" || data.Handy !== "" || data.Email !== "", {
        message: "Mindestens Telefon, Handy oder E-Mail muss angegeben sein.",
        path: ["Tel"],
    });

export type ErfasseSkiKunde = z.infer<typeof erfasseKundeSchema>;