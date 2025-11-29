'use client';

import React from "react";
import Link from "next/link";

export default function PlaceCard({ place }) {
    return (
        <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col justify-between hover:bg-zinc-50 transition">

            {/* PLACE NAME */}
            <h3 className="text-base font-semibold mb-2 text-zinc-900">
                {place.name}
            </h3>

            {/* PLACE DESCRIPTION */}
            <p className="text-sm text-zinc-600 mb-4 line-clamp-3">
                {place.description}
            </p>

            {/* PLACE ATTRIBUTES */}
            <div className="text-sm text-zinc-500 mb-6 space-y-1">
                <p>
                    Noise Level:{" "}
                    <span className="font-medium text-zinc-800 capitalize">
                        {place.noiseLevel}
                    </span>
                </p>
                <p>
                    Crowdedness:{" "}
                    <span className="font-medium text-zinc-800 capitalize">
                        {place.crowdedness}
                    </span>
                </p>
            </div>

            {/* PRIMARY CTA – NEXT.JS DOCS STYLE */}
            <Link
                href={`/places/${place._id}`}
                className="mt-auto w-full text-center bg-zinc-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
            >
                Learn More
            </Link>
        </div>
    );
}
