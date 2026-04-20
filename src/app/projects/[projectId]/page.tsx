'use client';

import { use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProject } from '@/hooks/useProject';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ProjectForm } from '@/components/project/ProjectForm';
import { Spinner } from '@/components/ui/Spinner';

export default function EditProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const { user } = useAuth();
  const { project, loading } = useProject(projectId);

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AuthGuard>
    );
  }

  if (!project || (user && project.uid !== user.uid)) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Project not found.</p>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Project</h1>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <ProjectForm existing={project} />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
