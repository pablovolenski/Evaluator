'use client';

import { useFormContext } from 'react-hook-form';
import type { ProjectSchemaData } from '@/components/project/ProjectForm';
import { Input } from '@/components/ui/Input';

export function SettingsSection() {
  const { register, formState: { errors } } = useFormContext<ProjectSchemaData>();
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Evaluation Settings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Evaluation Period (years)"
          type="number"
          min={1}
          max={30}
          error={errors.evaluationPeriodYears?.message}
          helper="How many years to project cash flows"
          {...register('evaluationPeriodYears', { valueAsNumber: true })}
        />
        <Input
          label="Discount Rate (%)"
          type="number"
          min={0.1}
          max={100}
          step="0.1"
          error={errors.discountRate?.message}
          helper="Annual rate for NPV calculation (e.g. 10)"
          {...register('discountRate', { valueAsNumber: true })}
        />
      </div>
    </div>
  );
}
