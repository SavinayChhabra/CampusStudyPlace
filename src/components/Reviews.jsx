'use client';

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Reviews({ placeId }) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (!placeId) return;
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/places/${placeId}/reviews`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch reviews");
                setReviews(data.reviews || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [placeId]);

    const submitReview = async (e) => {
        e.preventDefault();
        if (!session?.user?.email) return alert("You must be logged in to leave a review.");
        if (!rating || rating < 1 || rating > 5) return alert("Please select a rating between 1 and 5.");
        setSubmitting(true);

        try {
            const res = await fetch(`/api/places/${placeId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment, userEmail: session.user.email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit review");
            setReviews((prev) => [data.review, ...prev]);
            setRating(5);
            setHoverRating(0);
            setComment("");
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

            {session && (
                <form
                    onSubmit={submitReview}
                    className="mb-6 p-4 border border-zinc-200 rounded-xl bg-zinc-50 shadow-sm"
                >
                    <h3 className="font-semibold mb-2">Leave a Review</h3>
                    <div className="mb-3 flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setRating(num)}
                                onMouseEnter={() => setHoverRating(num)}
                                onMouseLeave={() => setHoverRating(0)}
                                className={`text-2xl transition-colors ${
                                    (hoverRating || rating) >= num
                                        ? "!text-yellow-400"
                                        : "!text-zinc-400"
                                }`}
                            >
                                ★
                            </button>
                        ))}
                        <span className="ml-2 text-gray-600">{rating} / 5</span>
                    </div>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        placeholder="Write your review..."
                        className="w-full p-2 border border-zinc-200 rounded-lg mb-3"
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-zinc-900 text-white w-full py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            )}

            {loading && <p className="text-gray-500">Loading reviews...</p>}

            {!loading && reviews.length === 0 && (
                <p className="text-gray-500">
                    No reviews yet. Be the first to review this study spot!
                </p>
            )}

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="border border-zinc-200 rounded-xl p-4 bg-white shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-zinc-900">
                                {review.user?.name || review.user?.email || "Anonymous"}
                            </p>
                            <div className="text-yellow-400">
                                {"★".repeat(review.rating)}
                                {"☆".repeat(5 - review.rating)}
                            </div>
                        </div>
                        {review.comment && <p className="text-gray-700">{review.comment}</p>}
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
