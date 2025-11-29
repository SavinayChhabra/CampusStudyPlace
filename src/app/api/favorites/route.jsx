import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// GET /api/favorites
// Fetches all favorite Place IDs for the current authenticated user.
export async function POST(req) {
    console.log("--- GET /api/favorites (Collection) STARTED ---");

    let body = {};
    try {
        body = await req.json();
    } catch (e) {
        // Handle case where body is not valid JSON
        console.error("POST: Failed to parse request body.", e);
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // const { userEmail, placeId: bodyPlaceId } = body;
    const { userEmail, placeId: bodyPlaceId } = body;
    try {
        // 2. Connect to Database
        await connectDB();

        // 3. Find the User using the verified email and ONLY retrieve the 'favorites' field
        const user = await User.findOne({ email: userEmail }).select('favorites');

        if (!user) {
            console.log(`GET: User not found for email: ${userEmail}`);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log(`GET: Successfully found ${user.favorites.length} favorites.`);

        // 4. Return the array of Place IDs (strings)
        return NextResponse.json({
            success: true,
            favorites: user.favorites
        });

    } catch (error) {
        console.error("GET: Server error while fetching favorites:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}