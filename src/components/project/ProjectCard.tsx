'use client';

import Link from 'next/link';
import type { Project } from '@/types/project';
import { Badge } from '@/components/ui/Badge';
import { evaluateProject } from '@/lib/evaluation';
import { formatCurrency } from '@/lib/utils/format';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  readonly?: boolean;
}

export function ProjectCard({ project, onDelete, readonly }: ProjectCardProps) {
  const result = evaluateProject(project);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
          {project.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
          )}
        </div>
        <Badge variant={result.isViable ? 'success' : 'danger'}>
          {result.isViable ? 'Viable' : 'Not viable'}
        </Badge>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-gray-500">NPV</dt>
          <dd className={`font-medium ${result.npv >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {formatCurrency(result.npv)}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">IRR</dt>
          <dd className="font-medium text-gray-900">
            {result.irr !== null ? `${(result.irr * 100).toFixed(1)}%` : 'N/A'}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Period</dt>
          <dd className="font-medium text-gray-900">{project.evaluationPeriodYears} yrs</dd>
        </div>
        <div>
          <dt className="text-gray-500">Updated</dt>
          <dd className="font-medium text-gray-900">{new Date(project.updatedAt).toLocaleDateString()}</dd>
        </div>
      </dl>

      <div className="mt-4 flex gap-2">
        <Link href={readonly ? `/share/${project.id}` : `/projects/${project.id}/results`} className="flex-1 text-center rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors">
          View results
        </Link>
        {!readonly && (
          <Link href={`/projects/${project.id}`} className="flex-1 text-center rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Edit
          </Link>
        )}
        {!readonly && onDelete && (
          <button
            onClick={() => onDelete(project.id)}
            className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
