import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import type { Project, ProjectFormData } from '@/types/project';

const COLLECTION = 'projects';

function toProject(id: string, data: DocumentData): Project {
  return {
    id,
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

export function newProjectRef() {
  return doc(collection(getFirebaseDb(), COLLECTION));
}

export async function createProject(uid: string, id: string, data: ProjectFormData): Promise<void> {
  await setDoc(doc(getFirebaseDb(), COLLECTION, id), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProject(id: string, data: Partial<ProjectFormData>): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), COLLECTION, id));
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(getFirebaseDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  return toProject(snap.id, snap.data());
}

export async function getAllProjects(limitCount = 50): Promise<Project[]> {
  const q = query(
    collection(getFirebaseDb(), COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProject(d.id, d.data()));
}

export async function getUserProjects(uid: string): Promise<Project[]> {
  const q = query(
    collection(getFirebaseDb(), COLLECTION),
    where('uid', '==', uid),
    orderBy('updatedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProject(d.id, d.data()));
}
