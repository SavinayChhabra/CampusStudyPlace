'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Layout({ children }) {
    const { data: session } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const navLinks = (
        <>
            <Link href="/places" className="block px-3 py-2 hover:bg-zinc-100 rounded whitespace-nowrap">
                Places
            </Link>
            <Link href="/add-place" className="block px-3 py-2 hover:bg-zinc-100 rounded whitespace-nowrap">
                Add Place
            </Link>
            <Link href="/favorites" className="block px-3 py-2 hover:bg-zinc-100 rounded whitespace-nowrap">
                Favorites
            </Link>
            <Link href="/visited" className="block px-3 py-2 hover:bg-zinc-100 rounded whitespace-nowrap">
                Visited
            </Link>
            {session ? (
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-3 py-2 border bg-red-500 border-zinc-300 rounded-md hover:bg-black transition mt-2 whitespace-nowrap"
                >
                    Logout
                </button>
            ) : (
                <>
                    <Link
                        href="/login"
                        className="block px-3 py-2 border border-zinc-300 rounded-md hover:bg-zinc-100 transition mt-2 whitespace-nowrap"
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="block px-3 py-2 border border-zinc-300 rounded-md hover:bg-zinc-100 transition mt-2 whitespace-nowrap"
                    >
                        Signup
                    </Link>
                </>
            )}
        </>
    );

    return (
        <div className="min-h-screen flex flex-col bg-white text-zinc-900">
            {/* HEADER */}
            <header className="border-b border-zinc-200 bg-white relative z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
                    <Link href="/" className="text-lg font-semibold tracking-tight whitespace-nowrap">
                        Campus Study Places
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden sm:flex items-center gap-5 text-sm flex-nowrap">
                        {navLinks}
                    </nav>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={toggleMobileMenu}
                        className="sm:hidden flex flex-col gap-1.5 p-2"
                        aria-label="Toggle menu"
                    >
                        <span className="block w-6 h-0.5 bg-zinc-900"></span>
                        <span className="block w-6 h-0.5 bg-zinc-900"></span>
                        <span className="block w-6 h-0.5 bg-zinc-900"></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden fixed inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center gap-4 p-6 z-50">
                        {navLinks}
                        <button
                            onClick={toggleMobileMenu}
                            className="absolute top-4 right-4 p-2"
                            aria-label="Close menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </header>

            {/* MAIN */}
            <main className="flex-1 bg-zinc-50">{children}</main>

            {/* FOOTER */}
            <footer className="border-t border-zinc-200 text-zinc-600 p-4 text-center text-sm bg-white space-y-1">
                <div className="text-xl mb-2">Campus Study Places</div>
                <div>Savinay Chhabra</div>
                <div>SFWRENG 4HC3</div>
                <div>McMaster University</div>
            </footer>

        </div>
    );
}
