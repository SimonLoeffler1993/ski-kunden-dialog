import { NextRequest, NextResponse } from "next/server";

// TODO function aus Utils
export async function GET(request: NextRequest) {
    const getParams = request.nextUrl.searchParams;
    const plz = getParams.get("plz");

    try{
        const response = await fetch(`http://localhost:8000/api/v1/orte/getname?plz=${plz}`);
        
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return NextResponse.json(data);
    }
    catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        return NextResponse.json({ error: "Fehler beim Laden der Daten" }, { status: 500 });
    }
}