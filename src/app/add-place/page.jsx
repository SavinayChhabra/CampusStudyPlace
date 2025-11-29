'use client';

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";

export default function AddPlace() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        building: "",
        description: "",
        noise: "",
        crowd: "",
        wifiQuality: 3,
        foodNearby: false,
        environment: "indoor",
        lat: "",
        lng: "",
        address: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const bodyData = {
            ...formData,
            indoor: formData.environment === "indoor",
            outdoor: formData.environment === "outdoor",
            location: {
                lat: parseFloat(formData.lat),
                lng: parseFloat(formData.lng),
                address: formData.address
            }
        };

        try {
            const res = await fetch("/api/places", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData),
            });

            if (!res.ok) throw new Error("Failed to add place");

            setLoading(false);
            router.push("/places");
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-xl mx-auto p-6">
                <div className="bg-white border border-zinc-200 rounded-xl p-6">
                    <h1 className="text-2xl font-semibold mb-6 text-zinc-900">
                        Add a Study Place
                    </h1>

                    {error && (
                        <p className="text-sm text-red-600 mb-4">{error}</p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-zinc-800">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-zinc-800">Building</label>
                            <input type="text" name="building" value={formData.building} onChange={handleChange} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-zinc-800">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm min-h-[100px]" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-zinc-800">Noise Level</label>
                            <select name="noise" value={formData.noise} onChange={handleChange} required className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white">
                                <option value="">Select</option>
                                <option value="quiet">Low</option>
                                <option value="moderate">Medium</option>
                                <option value="loud">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-zinc-800">Crowd Level</label>
                            <select name="crowd" value={formData.crowd} onChange={handleChange} required className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white">
                                <option value="">Select</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-zinc-800">WiFi Quality (0–5)</label>
                            <input type="number" name="wifiQuality" value={formData.wifiQuality} onChange={handleChange} min={0} max={5} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-zinc-700">
                            <input type="checkbox" name="foodNearby" checked={formData.foodNearby} onChange={handleChange} className="accent-zinc-900" />
                            <label>Food Nearby</label>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-zinc-700">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="environment" value="indoor" checked={formData.environment === "indoor"} onChange={handleChange} className="accent-zinc-900" />
                                Indoor
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="environment" value="outdoor" checked={formData.environment === "outdoor"} onChange={handleChange} className="accent-zinc-900" />
                                Outdoor
                            </label>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-zinc-800">Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm mb-2" />
                            <div className="flex gap-2">
                                <input type="number" step="any" placeholder="Latitude" name="lat" value={formData.lat} onChange={handleChange} className="w-1/2 border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
                                <input type="number" step="any" placeholder="Longitude" name="lng" value={formData.lng} onChange={handleChange} className="w-1/2 border border-zinc-300 rounded-lg px-3 py-2 text-sm" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-zinc-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60">
                            {loading ? "Adding..." : "Add Place"}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
