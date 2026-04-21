'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import type { ProjectSchemaData } from '@/components/project/ProjectForm';
import { DemandItem } from '../items/DemandItem';
import { LiquidationItem } from '../items/LiquidationItem';
import { Button } from '@/components/ui/Button';

interface RevenueSectionProps {
  uid: string;
  projectId: string;
}

export function RevenueSection({ uid, projectId }: RevenueSectionProps) {
  const { control } = useFormContext<ProjectSchemaData>();

  const demand = useFieldArray({ control, name: 'demandItems' });
  const liquidation = useFieldArray({ control, name: 'liquidationItems' });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Revenue Estimation</h2>

      {/* Demand sub-section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Demand</h3>
            <p className="text-xs text-gray-500 mt-0.5">Annual revenue from sales (quantity × price per unit).</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => demand.append({ id: uuid(), description: '', unitsPerYear: 0, pricePerUnit: 0 })}
          >
            + Add item
          </Button>
        </div>
        {demand.fields.length === 0 && (
          <p className="text-sm text-gray-400 italic">No demand items yet.</p>
        )}
        {demand.fields.map((field, i) => (
          <DemandItem
            key={field.id}
            index={i}
            uid={uid}
            projectId={projectId}
            onRemove={() => demand.remove(i)}
          />
        ))}
      </div>

      <hr className="border-gray-100" />

      {/* Asset liquidation sub-section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Asset Liquidation</h3>
            <p className="text-xs text-gray-500 mt-0.5">Salvage or resale value of assets recovered at the end of the project.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => liquidation.append({ id: uuid(), description: '', amount: 0 })}
          >
            + Add item
          </Button>
        </div>
        {liquidation.fields.length === 0 && (
          <p className="text-sm text-gray-400 italic">No liquidation items yet.</p>
        )}
        {liquidation.fields.map((field, i) => (
          <LiquidationItem
            key={field.id}
            index={i}
            uid={uid}
            projectId={projectId}
            onRemove={() => liquidation.remove(i)}
          />
        ))}
      </div>
    </div>
  );
}
