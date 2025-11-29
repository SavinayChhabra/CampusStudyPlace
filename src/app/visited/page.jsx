'use client';

import React from "react";
import Layout from "@/components/Layout";
import VisitedSection from "../../components/VisitedSection";

export default function VisitedPage() {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-2">
                <VisitedSection />
            </div>
        </Layout>
    );
}
