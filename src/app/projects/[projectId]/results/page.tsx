'use client';

import { use } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useProject } from '@/hooks/useProject';
import { useEvaluation } from '@/hooks/useEvaluation';
import { MetricsCards } from '@/components/results/MetricsCards';
import { CashFlowTable } from '@/components/results/CashFlowTable';
import { CashFlowChart } from '@/components/results/CashFlowChart';
import { ShareButton } from '@/components/results/ShareButton';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';

export default function ResultsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const { project, loading } = useProject(projectId);
  const result = useEvaluation(project);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">Evalify</Link>
            <div className="flex gap-2">
              {project && <ShareButton projectId={project.id} />}
              {project && (
                <Link href={`/projects/${project.id}`}>
                  <Button variant="outline" size="sm">Edit project</Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {loading && <div className="flex justify-center py-16"><Spinner size="lg" /></div>}

          {!loading && project && result && (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                  {project.description && <p className="mt-1 text-gray-500">{project.description}</p>}
                  <p className="mt-2 text-sm text-gray-400">
                    {project.evaluationPeriodYears}-year evaluation · {(project.discountRate * 100).toFixed(1)}% discount rate
                  </p>
                </div>
                <Badge variant={result.isViable ? 'success' : 'danger'} className="text-sm px-3 py-1">
                  {result.isViable ? 'Viable' : 'Not viable'}
                </Badge>
              </div>

              <MetricsCards result={result} />

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Chart</h2>
                <CashFlowChart cashFlows={result.cashFlows} />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Table</h2>
                <CashFlowTable cashFlows={result.cashFlows} />
              </div>
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
