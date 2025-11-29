import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// POST /api/visited
// Fetches all visited Place IDs for the current user (INSECURE email-based)
export async function POST(req) {
    console.log("--- GET /api/visited (Collection) STARTED ---");

    let body = {};
    try {
        body = await req.json();
    } catch (e) {
        console.error("POST: Failed to parse request body.", e);
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { userEmail } = body;

    if (!userEmail) {
        return NextResponse.json(
            { error: "Missing userEmail" },
            { status: 400 }
        );
    }

    try {
        // 1. Connect to Database
        await connectDB();

        // 2. Find user and ONLY return visited
        const user = await User.findOne({ email: userEmail }).select("visited");

        if (!user) {
            console.log(`GET: User not found for email: ${userEmail}`);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log(`GET: Successfully found ${user.visited.length} visited.`);

        // 3. Return visited place IDs
        return NextResponse.json({
            success: true,
            visited: user.visited,
        });

    } catch (error) {
        console.error("GET: Server error while fetching visited:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
