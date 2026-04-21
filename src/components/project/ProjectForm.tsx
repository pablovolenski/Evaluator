'use client';

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createProject, updateProject, newProjectRef } from '@/lib/firebase/firestore';
import type { Project } from '@/types/project';
import { BasicInfoSection } from './sections/BasicInfoSection';
import { ExpensesSection } from './sections/ExpensesSection';
import { RevenueSection } from './sections/RevenueSection';
import { SettingsSection } from './sections/SettingsSection';
import { Button } from '@/components/ui/Button';

// Empty number inputs come in as NaN via valueAsNumber; .catch(0) handles that
// while keeping the inferred TypeScript type as `number`
const nn = z.number().catch(0);

const expenseItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description required'),
  amount: nn,
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

const demandItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description required'),
  unitsPerYear: nn,
  pricePerUnit: nn,
  unitsMode: z.enum(['monthly', 'yearly']).optional(),
  monthlyUnits: z.array(nn).optional(),
  yearlyUnits: z.array(nn).optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

const liquidationItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description required'),
  amount: nn,
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(1000),
  evaluationPeriodYears: z.number().min(1).max(30),
  discountRate: z.number().min(0.001).max(100),
  initialInvestment: z.array(expenseItemSchema),
  recurringExpenses: z.array(expenseItemSchema),
  demandItems: z.array(demandItemSchema),
  liquidationItems: z.array(liquidationItemSchema),
});

export type ProjectSchemaData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  existing?: Project;
}

export function ProjectForm({ existing }: ProjectFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [saveError, setSaveError] = useState('');
  const [projectId] = useState(() => existing?.id ?? newProjectRef().id);

  const methods = useForm<ProjectSchemaData>({
    resolver: zodResolver(projectSchema),
    defaultValues: existing
      ? {
          ...existing,
          liquidationItems: existing.liquidationItems ?? [],
          discountRate: existing.discountRate <= 1 ? existing.discountRate * 100 : existing.discountRate,
        }
      : {
          name: '',
          description: '',
          evaluationPeriodYears: 5,
          discountRate: 10,
          initialInvestment: [],
          recurringExpenses: [],
          demandItems: [],
          liquidationItems: [],
        },
  });

  useEffect(() => {
    if (existing) {
      methods.reset({
        ...existing,
        liquidationItems: existing.liquidationItems ?? [],
        discountRate: existing.discountRate <= 1 ? existing.discountRate * 100 : existing.discountRate,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.id]);

  async function onSubmit(data: ProjectSchemaData) {
    if (!user) return;
    setSaveError('');

    // Normalise discount rate: user sees percentage (e.g. "10"), store as decimal (0.10)
    const normalised = {
      ...data,
      discountRate: data.discountRate > 1 ? data.discountRate / 100 : data.discountRate,
    };

    try {
      if (existing) {
        await updateProject(projectId, normalised);
      } else {
        await createProject(user.uid, projectId, normalised);
      }
      router.push(`/projects/${projectId}/results`);
    } catch (e: unknown) {
      setSaveError((e as Error).message);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfoSection />
        <hr className="border-gray-200" />
        <SettingsSection />
        <hr className="border-gray-200" />
        <ExpensesSection uid={user?.uid ?? ''} projectId={projectId} />
        <hr className="border-gray-200" />
        <RevenueSection uid={user?.uid ?? ''} projectId={projectId} />

        {saveError && <p className="text-sm text-red-600">{saveError}</p>}

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" loading={methods.formState.isSubmitting}>
            {existing ? 'Save & Evaluate' : 'Create & Evaluate'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
