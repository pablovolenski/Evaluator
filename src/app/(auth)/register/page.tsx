import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = { title: 'Register — Evalify' };

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <RegisterForm />
    </main>
  );
}
