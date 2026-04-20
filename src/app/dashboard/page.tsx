'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { deleteProject } from '@/lib/firebase/firestore';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, loading, error, refetch } = useProjects();
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    setDeleting(id);
    await deleteProject(id);
    setDeleting(null);
    refetch();
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-indigo-600">Evalify</Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">{user?.displayName || user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>Sign out</Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <Link href="/projects/new">
            <Button size="md">+ New Project</Button>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        )}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && projects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">No projects yet. Create your first one!</p>
            <Link href="/projects/new"><Button>Create project</Button></Link>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className={deleting === p.id ? 'opacity-50 pointer-events-none' : ''}>
              <ProjectCard project={p} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
