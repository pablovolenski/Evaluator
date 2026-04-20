import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = { title: 'Sign In — Evalify' };

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <LoginForm />
    </main>
  );
}
