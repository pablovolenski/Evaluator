'use client';

import { useMemo } from 'react';
import { evaluateProject } from '@/lib/evaluation';
import type { Project } from '@/types/project';
import type { EvaluationResult } from '@/types/evaluation';

export function useEvaluation(project: Project | null): EvaluationResult | null {
  return useMemo(() => {
    if (!project) return null;
    return evaluateProject(project);
  }, [project]);
}
