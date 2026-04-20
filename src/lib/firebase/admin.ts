import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import type { Project } from '@/types/project';

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function getProjectAdmin(id: string): Promise<Project | null> {
  const adminDb = getFirestore(getAdminApp());
  const snap = await adminDb.collection('projects').doc(id).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return {
    id: snap.id,
    uid: data.uid,
    name: data.name,
    description: data.description ?? '',
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
    evaluationPeriodYears: data.evaluationPeriodYears ?? 5,
    discountRate: data.discountRate ?? 0.1,
    initialInvestment: data.initialInvestment ?? [],
    recurringExpenses: data.recurringExpenses ?? [],
    demandItems: data.demandItems ?? [],
  };
}
