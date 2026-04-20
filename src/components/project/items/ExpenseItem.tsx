'use client';

import { useFormContext } from 'react-hook-form';
import type { ProjectSchemaData } from '@/components/project/ProjectForm';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';

interface ExpenseItemProps {
  prefix: 'initialInvestment' | 'recurringExpenses';
  index: number;
  uid: string;
  projectId: string;
  onRemove: () => void;
}

export function ExpenseItem({ prefix, index, uid, projectId, onRemove }: ExpenseItemProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProjectSchemaData>();
  const amountLabel = prefix === 'recurringExpenses' ? 'Amount / year' : 'Amount';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldErrors = (errors as any)?.[prefix]?.[index];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const watched = watch() as any;
  const fileUrl = watched?.[prefix]?.[index]?.fileUrl as string | undefined;
  const fileName = watched?.[prefix]?.[index]?.fileName as string | undefined;
  const fileValue = fileUrl ? { fileUrl, fileName: fileName ?? '' } : null;
  const itemId = `${prefix}-${index}`;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Description"
          placeholder="e.g. Buy machinery"
          error={fieldErrors?.description?.message}
          {...register(`${prefix}.${index}.description`)}
        />
        <Input
          label={amountLabel}
          type="number"
          min={0}
          step="0.01"
          placeholder="0.00"
          error={fieldErrors?.amount?.message}
          {...register(`${prefix}.${index}.amount`, { valueAsNumber: true })}
        />
      </div>
      <FileUpload
        uid={uid}
        projectId={projectId}
        itemId={itemId}
        value={fileValue}
        onChange={(v) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (setValue as any)(`${prefix}.${index}.fileUrl`, v?.fileUrl ?? undefined);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (setValue as any)(`${prefix}.${index}.fileName`, v?.fileName ?? undefined);
        }}
      />
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-red-500 hover:text-red-700 hover:bg-red-50">
          Remove
        </Button>
      </div>
    </div>
  );
}
