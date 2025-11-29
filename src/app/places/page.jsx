'use client';

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PlaceCard from "@/components/PlaceCard";

export default function SearchPlaces() {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchText, setSearchText] = useState("");
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [filters, setFilters] = useState({
        noise: "",
        crowd: "",
        wifiQuality: 3,
        foodNearby: false,
        indoor: false,
        outdoor: false,
    });

    const fetchPlaces = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/places");
            if (!res.ok) throw new Error("Failed to fetch places");
            const data = await res.json();
            setPlaces(data);
            setFilteredPlaces(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, []);

    useEffect(() => {
        let result = [...places];

        if (searchText.trim() !== "") {
            const text = searchText.toLowerCase();
            result = result.filter(p =>
                (p.name && p.name.toLowerCase().includes(text)) ||
                (p.building && p.building.toLowerCase().includes(text)) ||
                (p.location?.address && p.location.address.toLowerCase().includes(text))
            );
        }

        if (filters.noise) result = result.filter(p => p.noiseLevel === filters.noise);
        if (filters.crowd) result = result.filter(p => p.crowdedness === filters.crowd);
        result = result.filter(p => p.wifiQuality >= filters.wifiQuality);
        if (filters.foodNearby) result = result.filter(p => p.foodNearby);
        if (filters.indoor) result = result.filter(p => p.indoor);
        if (filters.outdoor) result = result.filter(p => p.outdoor);

        setFilteredPlaces(result);
    }, [searchText, filters, places]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "indoor" && checked) {
            setFilters(prev => ({ ...prev, indoor: true, outdoor: false }));
            return;
        }

        if (name === "outdoor" && checked) {
            setFilters(prev => ({ ...prev, outdoor: true, indoor: false }));
            return;
        }

        setFilters(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-semibold text-zinc-900 mb-4">Search Study Places</h1>

                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Search by name, building, or address"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="flex-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-900"
                    />

                    <button
                        type="button"
                        onClick={() => setFiltersVisible(!filtersVisible)}
                        className="bg-zinc-900 text-white py-2.5 px-4 rounded text-sm font-medium hover:bg-zinc-800 transition"
                    >
                        {filtersVisible ? "Hide Filters ▲" : "Show Filters ▼"}
                    </button>
                </div>


                {filtersVisible && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <select
                            name="noise"
                            value={filters.noise}
                            onChange={handleFilterChange}
                            className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-900"
                        >
                            <option value="">Noise Level</option>
                            <option value="quiet">Low</option>
                            <option value="moderate">Medium</option>
                            <option value="loud">High</option>
                        </select>

                        <select
                            name="crowd"
                            value={filters.crowd}
                            onChange={handleFilterChange}
                            className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-900"
                        >
                            <option value="">Crowd Level</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>

                        <div className="flex flex-col">
                            <label className="text-sm text-zinc-800 mb-1">
                                Minimum WiFi Quality: {filters.wifiQuality}
                            </label>
                            <input
                                type="range"
                                name="wifiQuality"
                                min={0}
                                max={5}
                                step={1}
                                value={filters.wifiQuality}
                                onChange={handleFilterChange}
                                className="w-full accent-zinc-900"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm text-zinc-800">
                            <input
                                type="checkbox"
                                name="foodNearby"
                                checked={filters.foodNearby}
                                onChange={handleFilterChange}
                                className="accent-zinc-900"
                            />
                            Food Nearby
                        </label>

                        <label className="flex items-center gap-2 text-sm text-zinc-800">
                            <input
                                type="checkbox"
                                name="indoor"
                                checked={filters.indoor}
                                onChange={handleFilterChange}
                                className="accent-zinc-900"
                            />
                            Indoor
                        </label>

                        <label className="flex items-center gap-2 text-sm text-zinc-800">
                            <input
                                type="checkbox"
                                name="outdoor"
                                checked={filters.outdoor}
                                onChange={handleFilterChange}
                                className="accent-zinc-900"
                            />
                            Outdoor
                        </label>
                    </div>
                )}

                {loading && <p className="text-zinc-600">Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {!loading && filteredPlaces.length === 0 && <p className="text-zinc-600">No places found.</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPlaces.map(place => (
                        <PlaceCard key={place._id} place={place} />
                    ))}
                </div>
            </div>
        </Layout>
    );
}
