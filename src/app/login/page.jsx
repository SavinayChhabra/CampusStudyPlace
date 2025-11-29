'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import Layout from "@/components/Layout";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        if (res.error) {
            setError("Invalid email or password");
            setLoading(false);
        } else {
            window.location.href = "/";
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto mt-20 px-4">
                <form
                    onSubmit={submit}
                    className="bg-white border border-zinc-200 rounded-xl p-6 space-y-5"
                >
                    <h1 className="text-2xl font-semibold text-zinc-900 text-center">
                        Login
                    </h1>

                    {error && (
                        <p className="text-sm text-red-600 text-center">
                            {error}
                        </p>
                    )}

                    <div>
                        <label className="block mb-1 text-sm font-medium text-zinc-800">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-900"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-zinc-800">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-900"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zinc-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center text-sm text-zinc-600">
                        Don’t have an account?{" "}
                        <a
                            href="/signup"
                            className="font-medium text-zinc-900 hover:underline"
                        >
                            Sign up
                        </a>
                    </p>
                </form>
            </div>
        </Layout>
    );
}
