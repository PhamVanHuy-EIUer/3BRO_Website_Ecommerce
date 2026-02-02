import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
        return NextResponse.json([]);
    }

    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            q,
        )}&limit=1&addressdetails=1&countrycodes=vn`,
        {
            headers: {
                "User-Agent": "your-app-name/1.0 (contact@email.com)",
                "Accept-Language": "vi",
            },
        },
    );

    const data = await res.json();
    return NextResponse.json(data);
}
