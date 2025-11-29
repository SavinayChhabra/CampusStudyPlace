import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    console.log("--- POST /api/favorites/[placeId] STARTED ---");

    let body = {};
    try {
        body = await req.json();
    } catch (e) {
        // Handle case where body is not valid JSON
        console.error("POST: Failed to parse request body.", e);
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { userEmail, placeId: bodyPlaceId } = body;
    // We are ignoring the placeId from URL params for simplicity of this insecure test:
    // const { placeId: urlPlaceId } = await params;

    // 2. Perform the Insecure Authentication/Data Check
    if (!userEmail) {
        console.log("POST: Missing userEmail in payload.");
        return NextResponse.json({ error: "User identity missing in payload (401 bypass)" }, { status: 401 });
    }

    // Use the placeId from the body payload (or from the URL if you prefer)
    const finalPlaceId = bodyPlaceId;

    if (!finalPlaceId) {
        console.log("POST: Missing placeId in payload.");
        return NextResponse.json({ error: "No placeId provided" }, { status: 400 });
    }

    console.log(`POST: User identity (INSECURE): ${userEmail}`);
    console.log(`POST: placeId extracted from payload: ${finalPlaceId}`);

    await connectDB();

    // 3. Look up user using the untrusted email from the payload
    const user = await User.findOne({ email: userEmail });

    if (!user) {
        console.log(`POST: User not found for email: ${userEmail}`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Before update favorites:", user.favorites);

    const alreadyFavorited = user.favorites.includes(finalPlaceId.toString());

    if (alreadyFavorited) {
        user.favorites.pull(finalPlaceId.toString());
    } else {
        user.favorites.push(finalPlaceId.toString());
    }

    await user.save();

    console.log("After update favorites:", user.favorites);
    console.log("--- INSECURE POST /api/favorites/[placeId] FINISHED ---");

    return NextResponse.json({ success: true, favorited: !alreadyFavorited });
}


export async function GET(req, { params }) {
    // return new Response(JSON.stringify(params));
    const { placeId } = await params
    return NextResponse.json({ message: `User with ID: ${placeId}` });
}