'use client';

import { useFormContext } from 'react-hook-form';
import type { ProjectSchemaData } from '@/components/project/ProjectForm';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';

interface LiquidationItemProps {
  index: number;
  uid: string;
  projectId: string;
  onRemove: () => void;
}

export function LiquidationItem({ index, uid, projectId, onRemove }: LiquidationItemProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProjectSchemaData>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldErrors = (errors as any)?.liquidationItems?.[index];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const watched = watch() as any;
  const fileUrl = watched?.liquidationItems?.[index]?.fileUrl as string | undefined;
  const fileName = watched?.liquidationItems?.[index]?.fileName as string | undefined;
  const fileValue = fileUrl ? { fileUrl, fileName: fileName ?? '' } : null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Description"
          placeholder="e.g. Equipment salvage value"
          error={fieldErrors?.description?.message}
          {...register(`liquidationItems.${index}.description`)}
        />
        <Input
          label="Amount"
          type="number"
          min={0}
          step="0.01"
          placeholder="0.00"
          error={fieldErrors?.amount?.message}
          {...register(`liquidationItems.${index}.amount`, { valueAsNumber: true })}
        />
      </div>
      <FileUpload
        uid={uid}
        projectId={projectId}
        itemId={`liquidation-${index}`}
        value={fileValue}
        onChange={(v) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (setValue as any)(`liquidationItems.${index}.fileUrl`, v?.fileUrl ?? undefined);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (setValue as any)(`liquidationItems.${index}.fileName`, v?.fileName ?? undefined);
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
