'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import type { ProjectSchemaData } from '@/components/project/ProjectForm';
import { DemandItem } from '../items/DemandItem';
import { Button } from '@/components/ui/Button';

interface DemandSectionProps {
  uid: string;
  projectId: string;
}

export function DemandSection({ uid, projectId }: DemandSectionProps) {
  const { control } = useFormContext<ProjectSchemaData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'demandItems' });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Demand</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ id: uuid(), description: '', unitsPerYear: 0, pricePerUnit: 0 })}
        >
          + Add item
        </Button>
      </div>
      <p className="text-sm text-gray-500">Define annual revenue sources (units sold × price per unit).</p>
      {fields.length === 0 && (
        <p className="text-sm text-gray-400 italic">No demand items yet.</p>
      )}
      {fields.map((field, i) => (
        <DemandItem
          key={field.id}
          index={i}
          uid={uid}
          projectId={projectId}
          onRemove={() => remove(i)}
        />
      ))}
    </div>
  );
}
