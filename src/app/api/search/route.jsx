// Simple redirect to /api/places with same params; kept for semantic separation.
import { NextResponse } from 'next/server';


export async function GET(req) {
    const url = new URL(req.url);
    const q = url.searchParams.toString();
    const target = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/places?${q}`;
    return NextResponse.redirect(target);
}