'use client';

import { useState } from 'react';
import type { EvaluationResult } from '@/types/evaluation';
import { formatCurrency, formatPercent, formatYears } from '@/lib/utils/format';
import { clsx } from 'clsx';

interface MetricsCardsProps {
  result: EvaluationResult;
}

interface CardProps {
  label: string;
  description: string;
  value: string;
  sub?: string;
  positive?: boolean | null;
}

function MetricCard({ label, description, value, sub, positive }: CardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={clsx(
      'rounded-xl border p-5',
      positive === true && 'border-green-200 bg-green-50',
      positive === false && 'border-red-200 bg-red-50',
      (positive === null || positive === undefined) && 'border-gray-200 bg-white'
    )}>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={`What is ${label}?`}
          className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 transition-colors text-xs font-bold leading-none select-none"
        >
          i
        </button>
      </div>

      {open && (
        <p className="mt-2 text-xs text-gray-600 leading-relaxed bg-white/70 rounded-lg px-2.5 py-2 border border-gray-100">
          {description}
        </p>
      )}

      <p className={clsx(
        'mt-2 text-2xl font-bold',
        positive === true && 'text-green-700',
        positive === false && 'text-red-700',
        (positive === null || positive === undefined) && 'text-gray-900'
      )}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

export function MetricsCards({ result }: MetricsCardsProps) {
  const { npv, irr, paybackYears, roi, netValue } = result;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      <MetricCard
        label="NPV"
        description="Net Present Value — how much your project is worth in today's money after discounting future cash flows. Positive means it creates real value."
        value={formatCurrency(npv)}
        sub="Net Present Value"
        positive={npv >= 0}
      />
      <MetricCard
        label="IRR"
        description="The annual return rate your project generates. If this is higher than what you'd get elsewhere (e.g. a bank), your project is worth it."
        value={irr !== null ? formatPercent(irr * 100) : 'N/A'}
        sub="Internal Rate of Return"
        positive={irr !== null ? irr > 0 : undefined}
      />
      <MetricCard
        label="Payback"
        description="How long until the project pays for itself. After this point, everything it earns is pure gain."
        value={formatYears(paybackYears)}
        sub="Time to recover investment"
        positive={paybackYears !== null ? true : false}
      />
      <MetricCard
        label="ROI"
        description="Return on Investment — for every dollar you put in, how many dollars do you get back? 50% means you get $1.50 for every $1 invested."
        value={formatPercent(roi)}
        sub="Return on Investment"
        positive={roi >= 0}
      />
      <MetricCard
        label="Net Value"
        description="The total money your project will produce over its lifetime, plain and simple — all income minus all costs, no financial formulas."
        value={formatCurrency(netValue)}
        sub="Undiscounted total"
        positive={netValue >= 0}
      />
    </div>
  );
}
