import { connectDB } from '@/lib/mongodb';
import Place from '@/models/Place';
import { NextResponse } from 'next/server';


export async function GET(req) {
    await connectDB();
    const url = new URL(req.url);
    const searchParams = url.searchParams;


    const filters = {};
    if (searchParams.get('noise')) filters.noiseLevel = searchParams.get('noise');
    if (searchParams.get('food')) filters.foodNearby = searchParams.get('food') === 'true';
    if (searchParams.get('indoor')) filters.indoor = searchParams.get('indoor') === 'true';


// simple text search
    if (searchParams.get('q')) {
        filters.$or = [
            { name: { $regex: searchParams.get('q'), $options: 'i' } },
            { building: { $regex: searchParams.get('q'), $options: 'i' } },
            { 'location.address': { $regex: searchParams.get('q'), $options: 'i' } }
        ];
    }


    const places = await Place.find(filters).limit(200).lean();


    return NextResponse.json(places);
}


export async function POST(req) {
    const body = await req.json();
    await connectDB();
    const place = await Place.create(body);
    return NextResponse.json(place);
}