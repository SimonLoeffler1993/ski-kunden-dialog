import { config } from "@/lib/config";
import { NextResponse } from "next/server";

export async function GET() {
    const url = config.backendUrl;

    return NextResponse.json({ backendUrl: url });
}