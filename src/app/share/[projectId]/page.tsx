import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectAdmin } from '@/lib/firebase/admin';
import { evaluateProject } from '@/lib/evaluation';
import { formatCurrency, formatPercent, formatYears } from '@/lib/utils/format';
import { MetricsCards } from '@/components/results/MetricsCards';
import { CashFlowTable } from '@/components/results/CashFlowTable';
import { CashFlowChart } from '@/components/results/CashFlowChart';
import { ReviewSection } from '@/components/review/ReviewSection';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface Props {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;
  const project = await getProjectAdmin(projectId);
  if (!project) return { title: 'Project not found — Evalify' };

  const result = evaluateProject(project);
  const description = [
    project.description,
    `NPV: ${formatCurrency(result.npv)}`,
    result.irr !== null ? `IRR: ${formatPercent(result.irr * 100)}` : null,
    `Payback: ${formatYears(result.paybackYears)}`,
  ].filter(Boolean).join(' · ');

  const ogImageUrl = `/share/${projectId}/opengraph-image`;

  return {
    title: `${project.name} — Evalify`,
    description,
    openGraph: {
      title: project.name,
      description,
      url: `/share/${projectId}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${project.name} evaluation` }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.name,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { projectId } = await params;
  const project = await getProjectAdmin(projectId);
  if (!project) notFound();

  const result = evaluateProject(project);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-indigo-600">Evalify</Link>
          <Link href="/register" className="text-sm text-indigo-600 hover:underline">
            Create your own evaluation →
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
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

        <ReviewSection projectId={projectId} ownerId={project.uid} />

        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-6 text-center">
          <p className="text-indigo-800 font-medium">Want to evaluate your own business idea?</p>
          <p className="text-indigo-600 text-sm mt-1 mb-4">
            Evalify helps you systematize and share economic project evaluations for free.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Get started for free
          </Link>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-200 mt-8">
        Made with <span className="text-indigo-400">Evalify</span> · Economic project evaluation platform
      </footer>
    </div>
  );
}
