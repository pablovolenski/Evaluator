'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProjectReviews, getUserReview } from '@/lib/firebase/reviews';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';
import type { Review } from '@/types/review';
import Link from 'next/link';

interface ReviewSectionProps {
  projectId: string;
  ownerId: string;
}

export function ReviewSection({ projectId, ownerId }: ReviewSectionProps) {
  const { user, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const isOwner = user?.uid === ownerId;
  const canReview = !!user && !isOwner;

  useEffect(() => {
    getProjectReviews(projectId)
      .then(setReviews)
      .finally(() => setLoadingReviews(false));
  }, [projectId]);

  useEffect(() => {
    if (!user) { setMyReview(null); return; }
    getUserReview(projectId, user.uid).then(setMyReview);
  }, [projectId, user]);

  function handleSaved(rating: number, comment: string) {
    const updated: Review = {
      id: `${projectId}_${user!.uid}`,
      projectId,
      uid: user!.uid,
      displayName: user!.displayName || user!.email || 'Anonymous',
      rating,
      comment,
      createdAt: myReview?.createdAt ?? new Date(),
    };
    setMyReview(updated);
    setReviews((prev) => {
      const without = prev.filter((r) => r.uid !== user!.uid);
      return [updated, ...without];
    });
    setShowForm(false);
  }

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Community Reviews</h2>
          {avg !== null ? (
            <p className="text-sm text-gray-500 mt-0.5">
              Average <span className="font-bold text-gray-800">{avg}/10</span> · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-0.5">No reviews yet</p>
          )}
        </div>

        {canReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {myReview ? 'Edit your review' : '+ Write a review'}
          </button>
        )}
      </div>

      {/* Form */}
      {canReview && showForm && (
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-indigo-900">
              {myReview ? 'Update your review' : 'Write a review'}
            </p>
            <button onClick={() => setShowForm(false)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          <ReviewForm
            projectId={projectId}
            uid={user!.uid}
            displayName={user!.displayName || user!.email || 'Anonymous'}
            existing={myReview ?? undefined}
            onSaved={handleSaved}
          />
        </div>
      )}

      {/* Not logged in prompt */}
      {!authLoading && !user && (
        <p className="text-sm text-gray-500">
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">Sign in</Link> to leave a review.
        </p>
      )}

      {/* Own project notice */}
      {!authLoading && isOwner && (
        <p className="text-sm text-gray-400 italic">You can&apos;t review your own project.</p>
      )}

      {/* Reviews list */}
      {loadingReviews ? (
        <p className="text-sm text-gray-400">Loading reviews…</p>
      ) : (
        <ReviewList reviews={reviews} />
      )}
    </div>
  );
}
