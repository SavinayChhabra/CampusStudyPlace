'use client';

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import PlaceCard from "@/components/PlaceCard";
import { useSession } from "next-auth/react";

const fetcher = (url) => fetch(url).then(res => res.json());

export default function VisitedSection() {
    const { data: session, status } = useSession();
    const [visitedData, setVisitedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { data: allPlaces, isLoading: placesLoading, error: placesError } = useSWR("/api/places", fetcher);

    useEffect(() => {
        if (status !== "authenticated") return;

        async function fetchVisitedData() {
            setLoading(true);
            try {
                // Fetch visited
                const visitedRes = await fetch(`/api/visited`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userEmail: session.user.email })
                });
                const visitedJson = await visitedRes.json();

                if (!visitedRes.ok) setError(visitedJson);

                setVisitedData(visitedJson);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchVisitedData();
    }, [status, session]);

    const visitedIds = visitedData?.visited || [];
    const visitedPlaces = allPlaces?.filter(place => visitedIds.includes(place._id)) || [];
    const hasVisited = visitedPlaces.length > 0;
    const isNotAuthenticated = status === "unauthenticated";

    return (
        <section className="mt-8">
            {(loading || placesLoading) && (
                <div className="text-gray-500">Loading your visited places...</div>
            )}

            {isNotAuthenticated && (
                <div className="bg-red-100 p-3 rounded text-red-700">
                    You need to <Link href="/login" className="font-semibold underline">log in</Link> to see your visited places!
                </div>
            )}

            {error && !isNotAuthenticated && (
                <div className="text-red-600">Failed to load your data. Try again later.</div>
            )}

            {!loading && !placesLoading && !error && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Places You've Visited</h2>
                    {!hasVisited ? (
                        <div className="text-gray-500">You haven't marked any places as visited yet.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {visitedPlaces.map(place => <PlaceCard key={place._id} place={place} />)}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
