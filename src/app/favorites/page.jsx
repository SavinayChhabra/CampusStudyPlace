'use client';

import React from "react";
import Layout from "@/components/Layout";
import FavSection from "../../components/FavSection";

export default function FavoritesPage() {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-2">
                <FavSection />
            </div>
        </Layout>
    );
}
