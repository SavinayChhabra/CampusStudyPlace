import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// POST /api/visited/[placeId]
export async function POST(req, { params }) {
    console.log("--- POST /api/visited/[placeId] STARTED ---");

    let body = {};
    try {
        body = await req.json();
    } catch (e) {
        console.error("POST: Failed to parse request body.", e);
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { userEmail, placeId: bodyPlaceId } = body;

    if (!userEmail) {
        console.log("POST: Missing userEmail in payload.");
        return NextResponse.json({ error: "User identity missing in payload (401 bypass)" }, { status: 401 });
    }

    const finalPlaceId = bodyPlaceId;
    if (!finalPlaceId) {
        console.log("POST: Missing placeId in payload.");
        return NextResponse.json({ error: "No placeId provided" }, { status: 400 });
    }

    console.log(`POST: User identity (INSECURE): ${userEmail}`);
    console.log(`POST: placeId extracted from payload: ${finalPlaceId}`);

    await connectDB();

    // Look up user using insecure email from body
    const user = await User.findOne({ email: userEmail });

    if (!user) {
        console.log(`POST: User not found for email: ${userEmail}`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Before update visited:", user.visited);

    const alreadyVisited = user.visited.includes(finalPlaceId.toString());

    if (alreadyVisited) {
        user.visited.pull(finalPlaceId.toString());
    } else {
        user.visited.push(finalPlaceId.toString());
    }

    await user.save();

    console.log("After update visited:", user.visited);
    console.log("--- POST /api/visited/[placeId] FINISHED ---");

    return NextResponse.json({ success: true, visited: !alreadyVisited });
}


// GET /api/visited/[placeId]
export async function GET(req, { params }) {
    const { placeId } = await params;
    return NextResponse.json({ message: `Visited placeId: ${placeId}` });
}
