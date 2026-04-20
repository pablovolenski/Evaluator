'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerWithEmail, signInWithGoogle } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ['confirm'] });

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setAuthError('');
    try {
      await registerWithEmail(data.email, data.password, data.displayName);
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
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">Start evaluating your business projects today.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" error={errors.displayName?.message} {...register('displayName')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
        <Input label="Confirm Password" type="password" error={errors.confirm?.message} {...register('confirm')} />
        {authError && <p className="text-sm text-red-600">{authError}</p>}
        <Button type="submit" loading={isSubmitting} className="w-full">Create account</Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">or</span></div>
      </div>

      <Button type="button" variant="outline" onClick={handleGoogle} className="w-full">
        Continue with Google
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
      </p>
    </div>
  );
}
