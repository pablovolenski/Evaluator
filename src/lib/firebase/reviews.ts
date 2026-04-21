import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import type { Review } from '@/types/review';

const REVIEWS = 'reviews';
const PROJECTS = 'projects';

function reviewId(projectId: string, uid: string) {
  return `${projectId}_${uid}`;
}

export async function getProjectReviews(projectId: string): Promise<Review[]> {
  const q = query(collection(getFirebaseDb(), REVIEWS), where('projectId', '==', projectId));
  const snap = await getDocs(q);
  const reviews = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Review, 'id' | 'createdAt'>),
    createdAt: d.data().createdAt?.toDate() ?? new Date(),
  }));
  // sort newest first client-side (avoids needing a composite index)
  return reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getUserReview(projectId: string, uid: string): Promise<Review | null> {
  const snap = await getDoc(doc(getFirebaseDb(), REVIEWS, reviewId(projectId, uid)));
  if (!snap.exists()) return null;
  return {
    id: snap.id,
    ...(snap.data() as Omit<Review, 'id' | 'createdAt'>),
    createdAt: snap.data().createdAt?.toDate() ?? new Date(),
  };
}

export async function submitReview(
  projectId: string,
  uid: string,
  displayName: string,
  rating: number,
  comment: string,
): Promise<void> {
  const db = getFirebaseDb();
  const rRef = doc(db, REVIEWS, reviewId(projectId, uid));
  const pRef = doc(db, PROJECTS, projectId);

  await runTransaction(db, async (tx) => {
    const [rSnap, pSnap] = await Promise.all([tx.get(rRef), tx.get(pRef)]);
    const currentCount: number = pSnap.data()?.reviewCount ?? 0;
    const currentAvg: number = pSnap.data()?.averageRating ?? 0;

    if (rSnap.exists()) {
      const oldRating: number = rSnap.data().rating;
      const newAvg = currentCount > 0
        ? (currentAvg * currentCount - oldRating + rating) / currentCount
        : rating;
      tx.update(rRef, { rating, comment, updatedAt: serverTimestamp() });
      tx.update(pRef, { averageRating: newAvg, reviewCount: currentCount });
    } else {
      const newAvg = (currentAvg * currentCount + rating) / (currentCount + 1);
      tx.set(rRef, { projectId, uid, displayName, rating, comment, createdAt: serverTimestamp() });
      tx.update(pRef, { averageRating: newAvg, reviewCount: currentCount + 1 });
    }
  });
}
