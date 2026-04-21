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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sv = setValue as any;

  function initAndSetMode(newMode: 'monthly' | 'yearly') {
    if (mode === newMode) {
      sv(`demandItems.${index}.unitsMode`, undefined);
      return;
    }
    if (newMode === 'monthly') {
      const existing = watched?.demandItems?.[index]?.monthlyUnits;
      if (!existing || existing.length !== 12) sv(`demandItems.${index}.monthlyUnits`, Array(12).fill(0));
    } else {
      const existing = watched?.demandItems?.[index]?.yearlyUnits;
      if (!existing || existing.length !== evaluationPeriodYears) sv(`demandItems.${index}.yearlyUnits`, Array(evaluationPeriodYears).fill(0));
    }
    sv(`demandItems.${index}.unitsMode`, newMode);
  }

  function fillAll(field: 'monthlyUnits' | 'yearlyUnits', count: number, raw: string) {
    const v = parseFloat(raw);
    const num = isNaN(v) ? 0 : Math.max(0, v);
    for (let i = 0; i < count; i++) sv(`demandItems.${index}.${field}.${i}`, num);
  }

  const modeBtn = (m: 'monthly' | 'yearly', label: string) => (
    <button
      type="button"
      onClick={() => initAndSetMode(m)}
      className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
        mode === m
          ? 'bg-indigo-600 border-indigo-600 text-white'
          : 'border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600'
      }`}
    >
      {label}
    </button>
  );

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
          {modeBtn('monthly', 'by month')}
          {modeBtn('yearly', 'by year')}
        </div>

        {/* Default: single total */}
        {!mode && (
          <input
            type="number" min={0} step="1" placeholder="0"
            className="w-full sm:w-40 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            {...register(`demandItems.${index}.unitsPerYear`, { valueAsNumber: true })}
          />
        )}

        {/* Monthly breakdown */}
        {mode === 'monthly' && (
          <div className="rounded-md bg-gray-50 border border-gray-200 p-3 space-y-3">
            {/* Fill-all row */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600 whitespace-nowrap">All months:</label>
              <input
                type="number" min={0} step="1" placeholder="same every month"
                className="w-44 rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onChange={(e) => fillAll('monthlyUnits', 12, e.target.value)}
              />
              <span className="text-xs text-gray-400 hidden sm:inline">or edit individually →</span>
            </div>
            {/* Individual months */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {MONTHS.map((m, i) => (
                <div key={m} className="space-y-0.5">
                  <label className="text-xs text-gray-400 block text-center">{m}</label>
                  <input
                    type="number" min={0} step="1" placeholder="0"
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
          <div className="rounded-md bg-gray-50 border border-gray-200 p-3 space-y-3">
            {/* Fill-all row */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600 whitespace-nowrap">All years:</label>
              <input
                type="number" min={0} step="1" placeholder="same every year"
                className="w-44 rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onChange={(e) => fillAll('yearlyUnits', evaluationPeriodYears, e.target.value)}
              />
              <span className="text-xs text-gray-400 hidden sm:inline">or edit individually →</span>
            </div>
            {/* Individual years */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {Array.from({ length: evaluationPeriodYears }, (_, i) => (
                <div key={i} className="space-y-0.5">
                  <label className="text-xs text-gray-400 block text-center">Yr {i + 1}</label>
                  <input
                    type="number" min={0} step="1" placeholder="0"
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
          sv(`demandItems.${index}.fileUrl`, v?.fileUrl ?? undefined);
          sv(`demandItems.${index}.fileName`, v?.fileName ?? undefined);
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
