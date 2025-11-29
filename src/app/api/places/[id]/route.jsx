import { connectDB } from "@/lib/mongodb";
import Place from "@/models/Place";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, context) {
    try {
        await connectDB();

        // ✅ MUST AWAIT PARAMS IN NEXT 15+
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid ID" },
                { status: 400 }
            );
        }

        const place = await Place.findById(id);

        if (!place) {
            return NextResponse.json(
                { error: "Place not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(place);
    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
