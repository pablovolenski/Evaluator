'use client';

import { useState } from 'react';
import { submitReview } from '@/lib/firebase/reviews';
import { Button } from '@/components/ui/Button';

interface ReviewFormProps {
  projectId: string;
  uid: string;
  displayName: string;
  existing?: { rating: number; comment: string };
  onSaved: (rating: number, comment: string) => void;
}

export function ReviewForm({ projectId, uid, displayName, existing, onSaved }: ReviewFormProps) {
  const [rating, setRating] = useState<number | null>(existing?.rating ?? null);
  const [comment, setComment] = useState(existing?.comment ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError('Please select a rating.'); return; }
    setSaving(true);
    setError('');
    try {
      await submitReview(projectId, uid, displayName, rating, comment);
      onSaved(rating, comment);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Your rating</p>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-colors ${
                rating === n
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Justification <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your reasoning..."
          rows={3}
          maxLength={500}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" loading={saving} size="sm">
        {existing ? 'Update review' : 'Submit review'}
      </Button>
    </form>
  );
}
