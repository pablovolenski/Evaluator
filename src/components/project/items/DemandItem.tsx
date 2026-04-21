'use client';

import { useFormContext } from 'react-hook-form';
import type { ProjectSchemaData } from '@/components/project/ProjectForm';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface DemandItemProps {
  index: number;
  uid: string;
  projectId: string;
  onRemove: () => void;
}

export function DemandItem({ index, uid, projectId, onRemove }: DemandItemProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProjectSchemaData>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldErrors = (errors as any)?.demandItems?.[index];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const watched = watch() as any;

  const mode = watched?.demandItems?.[index]?.unitsMode as 'monthly' | 'yearly' | undefined;
  const evaluationPeriodYears = (watched?.evaluationPeriodYears as number) || 5;
  const fileUrl = watched?.demandItems?.[index]?.fileUrl as string | undefined;
  const fileName = watched?.demandItems?.[index]?.fileName as string | undefined;
  const fileValue = fileUrl ? { fileUrl, fileName: fileName ?? '' } : null;

  function activateMonthly() {
    if (mode === 'monthly') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (setValue as any)(`demandItems.${index}.unitsMode`, undefined);
      return;
    }
    const existing = watched?.demandItems?.[index]?.monthlyUnits;
    if (!existing || existing.length !== 12) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (setValue as any)(`demandItems.${index}.monthlyUnits`, Array(12).fill(0));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (setValue as any)(`demandItems.${index}.unitsMode`, 'monthly');
  }

  function activateYearly() {
    if (mode === 'yearly') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (setValue as any)(`demandItems.${index}.unitsMode`, undefined);
      return;
    }
    const existing = watched?.demandItems?.[index]?.yearlyUnits;
    if (!existing || existing.length !== evaluationPeriodYears) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (setValue as any)(`demandItems.${index}.yearlyUnits`, Array(evaluationPeriodYears).fill(0));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (setValue as any)(`demandItems.${index}.unitsMode`, 'yearly');
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
      {/* Description + price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Description"
          placeholder="e.g. Product sales"
          error={fieldErrors?.description?.message}
          {...register(`demandItems.${index}.description`)}
        />
        <Input
          label="Price / unit"
          type="number"
          min={0}
          step="0.01"
          placeholder="0.00"
          error={fieldErrors?.pricePerUnit?.message}
          {...register(`demandItems.${index}.pricePerUnit`, { valueAsNumber: true })}
        />
      </div>

      {/* Units with mode toggle */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Units / year</span>
          <button
            type="button"
            onClick={activateMonthly}
            className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
              mode === 'monthly'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            monthly
          </button>
          <button
            type="button"
            onClick={activateYearly}
            className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
              mode === 'yearly'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            yearly
          </button>
          {mode && <span className="text-xs text-gray-400">(click to collapse)</span>}
        </div>

        {/* Default: single total input */}
        {!mode && (
          <input
            type="number"
            min={0}
            step="1"
            placeholder="0"
            className="w-full sm:w-40 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            {...register(`demandItems.${index}.unitsPerYear`, { valueAsNumber: true })}
          />
        )}

        {/* Monthly breakdown */}
        {mode === 'monthly' && (
          <div className="rounded-md bg-gray-50 border border-gray-200 p-3 space-y-2">
            <p className="text-xs text-gray-500">Units sold per month (repeats every year)</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {MONTHS.map((m, i) => (
                <div key={m} className="space-y-0.5">
                  <label className="text-xs text-gray-400 block text-center">{m}</label>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    placeholder="0"
                    className="w-full rounded border border-gray-300 px-1.5 py-1 text-xs text-center text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    {...register(`demandItems.${index}.monthlyUnits.${i}`, { valueAsNumber: true })}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yearly breakdown */}
        {mode === 'yearly' && (
          <div className="rounded-md bg-gray-50 border border-gray-200 p-3 space-y-2">
            <p className="text-xs text-gray-500">Units sold per year (can vary each year)</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {Array.from({ length: evaluationPeriodYears }, (_, i) => (
                <div key={i} className="space-y-0.5">
                  <label className="text-xs text-gray-400 block text-center">Yr {i + 1}</label>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    placeholder="0"
                    className="w-full rounded border border-gray-300 px-1.5 py-1 text-xs text-center text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    {...register(`demandItems.${index}.yearlyUnits.${i}`, { valueAsNumber: true })}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <FileUpload
        uid={uid}
        projectId={projectId}
        itemId={`demand-${index}`}
        value={fileValue}
        onChange={(v) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (setValue as any)(`demandItems.${index}.fileUrl`, v?.fileUrl ?? undefined);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (setValue as any)(`demandItems.${index}.fileName`, v?.fileName ?? undefined);
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
