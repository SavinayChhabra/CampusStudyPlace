'use client';

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import PlaceCard from "@/components/PlaceCard";
import { useSession } from "next-auth/react";

const fetcher = (url) => fetch(url).then(res => res.json());

export default function FavSection() {
    const { data: session, status } = useSession();
    const [favData, setFavData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { data: allPlaces, isLoading: placesLoading, error: placesError } = useSWR("/api/places", fetcher);

    useEffect(() => {
        if (status !== "authenticated") return;

        async function fetchFavorites() {
            setLoading(true);
            try {
                const res = await fetch(`/api/favorites`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userEmail: session.user.email })
                });
                const data = await res.json();

                if (!res.ok) setError(data);
                else setFavData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchFavorites();
    }, [status, session]);

    const favoriteIds = favData?.favorites || [];
    const favoritePlaces = allPlaces?.filter(place => favoriteIds.includes(place._id)) || [];
    const hasFavorites = favoritePlaces.length > 0;
    const isNotAuthenticated = status === "unauthenticated";

    return (
        <section className="mt-8">
            {(loading || placesLoading) && (
                <div className="text-gray-500">Loading your favorites...</div>
            )}

            {isNotAuthenticated && (
                <div className="bg-red-100 p-3 rounded text-red-700">
                    You need to <Link href="/login" className="font-semibold underline">log in</Link> to see your saved favorites!
                </div>
            )}

            {error && !isNotAuthenticated && (
                <div className="text-red-600">Failed to load your data. Try again later.</div>
            )}

            {!loading && !placesLoading && !error && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Your Favorites</h2>
                    {!hasFavorites ? (
                        <div className="text-gray-500">You haven't saved any favorites yet. Start browsing!</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {favoritePlaces.map(place => <PlaceCard key={place._id} place={place} />)}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
