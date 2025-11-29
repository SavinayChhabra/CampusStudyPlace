'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Reviews from "../../../components/Reviews";

export default function PlaceDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [favLoading, setFavLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const [visitedLoading, setVisitedLoading] = useState(false);
    const [isVisited, setIsVisited] = useState(false);

    const toggleFavorite = async () => {
        if (!id || !session?.user?.email) return;
        setFavLoading(true);
        try {
            const res = await fetch(`/api/favorites/${id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ placeId: id, userEmail: session.user.email }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 401) router.push("/login");
                throw new Error(data.error || "Failed to update favorite");
            }
            setIsFavorite(data.favorited);
        } catch (err) {
            console.error(err);
            alert("Error updating favorite");
        } finally {
            setFavLoading(false);
        }
    };

    const toggleVisited = async () => {
        if (!id || !session?.user?.email) return;
        setVisitedLoading(true);
        try {
            const res = await fetch(`/api/visited/${id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ placeId: id, userEmail: session.user.email }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 401) router.push("/login");
                throw new Error(data.error || "Failed to update visited");
            }
            setIsVisited(data.visited);
        } catch (err) {
            console.error(err);
            alert("Error updating visited");
        } finally {
            setVisitedLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        const fetchPlace = async () => {
            try {
                const res = await fetch(`/api/places/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch place");
                setPlace(data);
                setIsFavorite(data.isFavorite || false);
                setIsVisited(data.isVisited || false);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPlace();
    }, [id]);

    if (loading)
        return (
            <Layout>
                <p className="p-6">Loading study place...</p>
            </Layout>
        );

    if (error)
        return (
            <Layout>
                <p className="p-6 text-red-600">{error}</p>
                <div className="p-6">
                    <button
                        onClick={() => router.push("/places")}
                        className="bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition"
                    >
                        Back to Places
                    </button>
                </div>
            </Layout>
        );

    return (
        <Layout>
            <div className="max-w-3xl mx-auto p-6 bg-white border border-zinc-200 rounded-xl shadow mt-8">
                <h1 className="text-3xl font-bold mb-4">{place.name}</h1>
                <p className="text-gray-700 mb-6">{place.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
                    <div className="bg-zinc-100 p-3 rounded">
                        <strong>Noise Level:</strong> {place.noiseLevel}
                    </div>
                    <div className="bg-zinc-100 p-3 rounded">
                        <strong>Crowd Level:</strong> {place.crowdedness}
                    </div>
                    <div className="bg-zinc-100 p-3 rounded">
                        <strong>WiFi Quality:</strong> {place.wifiQuality} / 5
                    </div>
                    <div className="bg-zinc-100 p-3 rounded">
                        <strong>Food Nearby:</strong> {place.foodNearby ? "Yes" : "No"}
                    </div>
                    <div className="bg-zinc-100 p-3 rounded">
                        <strong>Indoor:</strong> {place.indoor ? "Yes" : "No"}
                    </div>
                    <div className="bg-zinc-100 p-3 rounded">
                        <strong>Outdoor:</strong> {place.outdoor ? "Yes" : "No"}
                    </div>
                    {place.location?.address && (
                        <div className="bg-zinc-100 p-3 rounded col-span-2">
                            <strong>Address:</strong> {place.location.address}
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mb-6">
                    {session && (
                        <>
                            <button
                                onClick={toggleFavorite}
                                disabled={favLoading}
                                className={`flex-1 text-center py-2.5 rounded-lg text-sm font-medium transition ${
                                    isFavorite
                                        ? "bg-yellow-400 text-white hover:bg-yellow-500"
                                        : "bg-zinc-900 text-white hover:bg-zinc-800"
                                }`}
                            >
                                {favLoading
                                    ? "Saving..."
                                    : isFavorite
                                        ? "⭐ Favorited"
                                        : "⭐ Add Favorite"}
                            </button>

                            <button
                                onClick={toggleVisited}
                                disabled={visitedLoading}
                                className={`flex-1 text-center py-2.5 rounded-lg text-sm font-medium transition ${
                                    isVisited
                                        ? "bg-green-700 text-white hover:bg-green-800"
                                        : "bg-green-600 text-white hover:bg-green-700"
                                }`}
                            >
                                {visitedLoading
                                    ? "Saving..."
                                    : isVisited
                                        ? "✅ Visited"
                                        : "✅ Mark as Visited"}
                            </button>
                        </>
                    )}
                </div>

                <Reviews placeId={id} />

                <div className="mt-10">
                    <button
                        onClick={() => router.push("/places")}
                        className="text-zinc-900 hover:underline"
                    >
                        ← Back to all places
                    </button>
                </div>
            </div>
        </Layout>
    );
}
