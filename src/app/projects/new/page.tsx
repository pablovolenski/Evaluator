import { AuthGuard } from '@/components/auth/AuthGuard';
import { ProjectForm } from '@/components/project/ProjectForm';

export const metadata = { title: 'New Project — Evalify' };

export default function NewProjectPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">New Project</h1>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <ProjectForm />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
