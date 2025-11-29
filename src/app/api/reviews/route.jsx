import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import Place from '@/models/Place';
import { NextResponse } from 'next/server';


export async function POST(req) {
    const body = await req.json();
    await connectDB();


    const review = await Review.create(body);


// optionally compute average rating and attach (not stored persistently here)
    const agg = await Review.aggregate([
        { $match: { place: review.place } },
        { $group: { _id: '$place', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);


    const meta = agg[0] || { avg: review.rating, count: 1 };


    return NextResponse.json({ review, meta });
}


export async function GET(req) {
    await connectDB();
    const url = new URL(req.url);
    const placeId = url.searchParams.get('placeId');
    if (!placeId) return NextResponse.json([]);


    const reviews = await Review.find({ place: placeId }).populate('user', 'name').lean();
    return NextResponse.json(reviews);
}