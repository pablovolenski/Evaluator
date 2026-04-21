'use client';

import type { Review } from '@/types/review';

interface ReviewListProps {
  reviews: Review[];
}

function RatingBadge({ rating }: { rating: number }) {
  const color =
    rating >= 8 ? 'bg-green-100 text-green-800' :
    rating >= 5 ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-bold ${color}`}>
      {rating}<span className="font-normal text-xs opacity-70">/10</span>
    </span>
  );
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="text-sm text-gray-400 italic">No reviews yet. Be the first to review this project.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="flex gap-3">
          <div className="shrink-0 mt-0.5">
            <RatingBadge rating={r.rating} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-900">{r.displayName}</span>
              <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            {r.comment && (
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">{r.comment}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
