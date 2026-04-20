'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import type { ProjectSchemaData } from '@/components/project/ProjectForm';
import { ExpenseItem } from '../items/ExpenseItem';
import { Button } from '@/components/ui/Button';

interface ExpensesSectionProps {
  uid: string;
  projectId: string;
}

export function ExpensesSection({ uid, projectId }: ExpensesSectionProps) {
  const { control } = useFormContext<ProjectSchemaData>();

  const initial = useFieldArray({ control, name: 'initialInvestment' });
  const recurring = useFieldArray({ control, name: 'recurringExpenses' });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Expenses</h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Initial Investment</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => initial.append({ id: uuid(), description: '', amount: 0 })}
          >
            + Add item
          </Button>
        </div>
        {initial.fields.length === 0 && (
          <p className="text-sm text-gray-400 italic">No initial investment items yet.</p>
        )}
        {initial.fields.map((field, i) => (
          <ExpenseItem
            key={field.id}
            prefix="initialInvestment"
            index={i}
            uid={uid}
            projectId={projectId}
            onRemove={() => initial.remove(i)}
          />
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Recurring Expenses (per year)</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => recurring.append({ id: uuid(), description: '', amount: 0 })}
          >
            + Add item
          </Button>
        </div>
        {recurring.fields.length === 0 && (
          <p className="text-sm text-gray-400 italic">No recurring expenses yet.</p>
        )}
        {recurring.fields.map((field, i) => (
          <ExpenseItem
            key={field.id}
            prefix="recurringExpenses"
            index={i}
            uid={uid}
            projectId={projectId}
            onRemove={() => recurring.remove(i)}
          />
        ))}
      </div>
    </div>
  );
}
