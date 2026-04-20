'use client';

import { useFormContext } from 'react-hook-form';
import type { ProjectSchemaData } from '@/components/project/ProjectForm';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export function BasicInfoSection() {
  const { register, formState: { errors } } = useFormContext<ProjectSchemaData>();
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Project Info</h2>
      <Input
        label="Project Name"
        placeholder="My Business Idea"
        error={errors.name?.message}
        {...register('name')}
      />
      <Textarea
        label="Description"
        placeholder="Describe your project..."
        error={errors.description?.message}
        {...register('description')}
      />
    </div>
  );
}
