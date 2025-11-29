'use client';

import React from "react";
import useSWR from "swr";
import Link from "next/link";
import Layout from "@/components/Layout";
import PlaceCard from "@/components/PlaceCard";
import FavSection from "@/components/FavSection";
import { FaSearch, FaStar, FaHeart } from "react-icons/fa";

// @ts-ignore
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
    const { data: places, error, isLoading } = useSWR("/api/places", fetcher);

    return (
        <Layout>
            <div className="p-6 max-w-6xl mx-auto">
                {/* HERO SECTION */}
                <section className="text-center py-16 border-b border-zinc-200">
                    <h1 className="text-4xl font-semibold mb-4">
                        Find Your Perfect Study Spot 📚
                    </h1>
                    <p className="text-zinc-600 max-w-2xl mx-auto">
                        Discover, review, and save the best places to study on campus — from
                        quiet library floors to buzzing cafés and outdoor spaces.
                    </p>

                    <div className="mt-8">
                        <Link
                            href="/places"
                            className="inline-block border border-zinc-300 px-6 py-3 rounded-lg font-medium hover:bg-zinc-100 transition"
                        >
                            Browse All Study Places
                        </Link>
                    </div>
                </section>

                {/* FEATURED PLACES */}
                <section className="mt-12">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">
                            Featured Study Spots
                        </h2>
                        <Link
                            href="/places"
                            className="text-sm underline underline-offset-4 text-zinc-700 hover:text-zinc-900"
                        >
                            View all
                        </Link>
                    </div>

                    {isLoading && (
                        <div className="text-zinc-500">
                            Loading study places...
                        </div>
                    )}

                    {error && (
                        <div className="text-red-600">
                            Failed to load places.
                        </div>
                    )}

                    {!isLoading && places?.length === 0 && (
                        <div className="text-zinc-500">
                            No study places found. Add one!
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
                        {places?.slice(0, 6).map((place) => (
                            <PlaceCard key={place._id} place={place} />
                        ))}
                    </div>
                </section>

                <hr className="my-12 border-zinc-200" />

                <div className="my-12">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-zinc-900">Your Favorites</h1>
                        <Link
                            href="/favorites"
                            className="text-sm underline underline-offset-4 text-zinc-700 hover:text-zinc-900"
                        >
                            View all
                        </Link>
                    </div>
                    <FavSection />
                </div>
                <hr className="my-12 border-zinc-200" />

                <hr className="my-12 border-zinc-200" />

                <section className="mt-20 grid md:grid-cols-3 gap-8 text-center">
                    <div className="bg-white p-6 rounded-lg border border-zinc-200 flex flex-col items-center shadow-sm hover:shadow-md transition">
                        <h3 className="font-medium text-lg mb-4 text-zinc-900">Discover</h3>
                        <FaSearch className="text-5xl text-blue-500 mb-4" />
                        <p className="text-sm text-zinc-600">
                            Search and filter study spaces by noise, Wi-Fi,
                            crowd level, and food proximity.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-zinc-200 flex flex-col items-center shadow-sm hover:shadow-md transition">
                        <h3 className="font-medium text-lg mb-4 text-zinc-900">Review</h3>
                        <FaStar className="text-5xl text-yellow-400 mb-4" />
                        <p className="text-sm text-zinc-600">
                            Share your experience, leave ratings,
                            and help other students find great study spots.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-zinc-200 flex flex-col items-center shadow-sm hover:shadow-md transition">
                        <h3 className="font-medium text-lg mb-4 text-zinc-900">Favorite</h3>
                        <FaHeart className="text-5xl text-pink-500 mb-4" />
                        <p className="text-sm text-zinc-600">
                            Save your favorite places and keep track
                            of where you’ve studied.
                        </p>
                    </div>
                </section>

                <hr className="my-12 border-zinc-200" />

                {/* CALL TO ACTION */}
                <section className="mt-20 text-center border border-zinc-200 p-10 rounded-lg bg-white">
                    <h2 className="text-2xl font-semibold mb-3">
                        Know a Great Study Spot?
                    </h2>
                    <p className="text-zinc-600 mb-6">
                        Help the campus community by adding a new study place.
                    </p>

                    <Link
                        href="/add-place"
                        className="inline-block border border-zinc-300 px-6 py-3 rounded-lg font-medium hover:bg-zinc-100 transition"
                    >
                        Add a Study Place
                    </Link>
                </section>
            </div>
        </Layout>

    );
}
