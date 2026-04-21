'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllProjects } from '@/lib/firebase/firestore';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Spinner } from '@/components/ui/Spinner';
import type { Project } from '@/types/project';

export default function BoardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllProjects(50)
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-indigo-600">Evalify</Link>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">Sign in</Link>
            <Link href="/register" className="text-sm bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Projects</h1>
          <p className="mt-2 text-gray-500">
            Browse real business evaluations shared by the community. Every project posted on Evalify appears here.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        )}

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg mb-4">No projects yet — be the first!</p>
            <Link href="/register">
              <span className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                Create a project
              </span>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} readonly />
          ))}
        </div>

        {!loading && projects.length > 0 && (
          <div className="mt-12 text-center rounded-xl border border-indigo-100 bg-indigo-50 p-8">
            <p className="text-indigo-800 font-semibold text-lg">Have a business idea to evaluate?</p>
            <p className="text-indigo-600 text-sm mt-1 mb-4">Create your free account and add your project to the board.</p>
            <Link href="/register" className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
              Start for free
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
