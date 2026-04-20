'use client';

import type { EvaluationResult } from '@/types/evaluation';
import { formatCurrency, formatPercent, formatYears } from '@/lib/utils/format';
import { clsx } from 'clsx';

interface MetricsCardsProps {
  result: EvaluationResult;
}

interface CardProps {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean | null;
}

function MetricCard({ label, value, sub, positive }: CardProps) {
  return (
    <div className={clsx(
      'rounded-xl border p-5',
      positive === true && 'border-green-200 bg-green-50',
      positive === false && 'border-red-200 bg-red-50',
      positive === null || positive === undefined ? 'border-gray-200 bg-white' : ''
    )}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={clsx(
        'mt-1 text-2xl font-bold',
        positive === true && 'text-green-700',
        positive === false && 'text-red-700',
        positive === null || positive === undefined ? 'text-gray-900' : ''
      )}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

export function MetricsCards({ result }: MetricsCardsProps) {
  const { npv, irr, paybackYears, roi } = result;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="NPV"
        value={formatCurrency(npv)}
        sub="Net Present Value"
        positive={npv >= 0}
      />
      <MetricCard
        label="IRR"
        value={irr !== null ? formatPercent(irr * 100) : 'N/A'}
        sub="Internal Rate of Return"
        positive={irr !== null ? irr > 0 : undefined}
      />
      <MetricCard
        label="Payback"
        value={formatYears(paybackYears)}
        sub="Time to recover investment"
        positive={paybackYears !== null ? true : false}
      />
      <MetricCard
        label="ROI"
        value={formatPercent(roi)}
        sub="Return on Investment"
        positive={roi >= 0}
      />
    </div>
  );
}
