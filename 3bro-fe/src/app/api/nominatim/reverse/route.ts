import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
        return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
    }

    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        {
            headers: {
                "User-Agent": "your-app-name/1.0 (your-email@gmail.com)",
                "Accept-Language": "vi",
            },
        },
    );

    const data = await res.json();
    return NextResponse.json(data);
}
