import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Place from "@/models/Place";
import User from "@/models/User";

// ✅ ADD REVIEW (POST)
export async function POST(req, context) {
    try {
        const { params } = context;
        const { id: placeId } = await params; // ✅ unwrap the promise
        const body = await req.json();

        const { rating, comment, userEmail } = body;

        if (!rating || !userEmail) {
            return NextResponse.json(
                { error: "rating and userEmail are required" },
                { status: 400 }
            );
        }

        await connectDB();

        // ✅ Find user
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ✅ Find place
        const place = await Place.findById(placeId);
        if (!place) {
            return NextResponse.json({ error: "Place not found" }, { status: 404 });
        }

        // ✅ Embedded review object
        const newReview = {
            rating,
            comment,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            createdAt: new Date(),
        };

        // ✅ Push into embedded array
        place.reviews.push(newReview);
        await place.save();

        return NextResponse.json({
            success: true,
            review: newReview,
        });

    } catch (error) {
        console.error("POST REVIEW ERROR:", error);
        return NextResponse.json(
            { error: "Failed to create review" },
            { status: 500 }
        );
    }
}

// ✅ GET ALL REVIEWS FOR A PLACE
export async function GET(req, context) {
    try {
        const { params } = context;
        const { id: placeId } = await params; // ✅ unwrap the promise

        await connectDB();

        const place = await Place.findById(placeId).select("name reviews");
        if (!place) {
            return NextResponse.json({ error: "Place not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            placeName: place.name,
            count: place.reviews.length,
            reviews: place.reviews,
        });

    } catch (error) {
        console.error("GET REVIEWS ERROR:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}
