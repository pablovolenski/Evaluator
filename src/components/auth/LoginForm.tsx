'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setAuthError('');
    try {
      await signInWithEmail(data.email, data.password);
      router.push('/dashboard');
    } catch (e: unknown) {
      setAuthError((e as Error).message.replace('Firebase: ', ''));
    }
  }

  async function handleGoogle() {
    setAuthError('');
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (e: unknown) {
      setAuthError((e as Error).message.replace('Firebase: ', ''));
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sign in to Evalify</h1>
        <p className="mt-1 text-sm text-gray-500">Evaluate your business ideas with confidence.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
        {authError && <p className="text-sm text-red-600">{authError}</p>}
        <Button type="submit" loading={isSubmitting} className="w-full">Sign in</Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">or</span></div>
      </div>

      <Button type="button" variant="outline" onClick={handleGoogle} className="w-full">
        Continue with Google
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register</Link>
      </p>
    </div>
  );
}
