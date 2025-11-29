'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function SignupPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Signup failed");
            setLoading(false);
            return;
        }

        router.push("/login");
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto mt-20 px-4">
                <form
                    onSubmit={submit}
                    className="bg-white border border-zinc-200 rounded-xl p-6 space-y-5"
                >
                    <h1 className="text-2xl font-semibold text-zinc-900 text-center">
                        Create an Account
                    </h1>

                    {error && (
                        <p className="text-sm text-red-600 text-center">
                            {error}
                        </p>
                    )}

                    <div>
                        <label className="block mb-1 text-sm font-medium text-zinc-800">
                            Name
                        </label>
                        <input
                            name="name"
                            onChange={handleChange}
                            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-zinc-800">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            onChange={handleChange}
                            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-zinc-800">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            onChange={handleChange}
                            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-900"
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-zinc-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>

                    <p className="text-center text-sm text-zinc-600">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="font-medium text-zinc-900 hover:underline"
                        >
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </Layout>
    );
}
