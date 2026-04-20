'use client';

import { useState, useEffect } from 'react';
import { getProject } from '@/lib/firebase/firestore';
import type { Project } from '@/types/project';

export function useProject(id: string | null) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    getProject(id)
      .then(setProject)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { project, loading, error, setProject };
}
