'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserProjects } from '@/lib/firebase/firestore';
import type { Project } from '@/types/project';

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setProjects([]); setLoading(false); return; }
    setLoading(true);
    getUserProjects(user.uid)
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  return { projects, loading, error, refetch: () => {
    if (!user) return;
    getUserProjects(user.uid).then(setProjects).catch((e) => setError(e.message));
  }};
}
