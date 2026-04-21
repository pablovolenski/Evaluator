'use client';

import type { EvaluationResult } from '@/types/evaluation';
import { formatCurrency, formatPercent, formatYears } from '@/lib/utils/format';
import { clsx } from 'clsx';

interface MetricsCardsProps {
  result: EvaluationResult;
}

interface CardProps {
  label: string;
  tooltip: string;
  value: string;
  sub?: string;
  positive?: boolean | null;
}

function MetricCard({ label, tooltip, value, sub, positive }: CardProps) {
  return (
    <div className={clsx(
      'rounded-xl border p-5',
      positive === true && 'border-green-200 bg-green-50',
      positive === false && 'border-red-200 bg-red-50',
      (positive === null || positive === undefined) && 'border-gray-200 bg-white'
    )}>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="relative group">
          <span className="cursor-default select-none text-xs text-gray-400 hover:text-gray-600 transition-colors">ⓘ</span>
          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 shadow-lg">
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      </div>
      <p className={clsx(
        'mt-1 text-2xl font-bold',
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
        tooltip="Sum of all future cash flows discounted to today's value using your discount rate. Positive means the project creates value above your required return."
        value={formatCurrency(npv)}
        sub="Net Present Value"
        positive={npv >= 0}
      />
      <MetricCard
        label="IRR"
        tooltip="The discount rate at which NPV equals zero. Compare it against your cost of capital — if IRR is higher, the project is worth pursuing."
        value={irr !== null ? formatPercent(irr * 100) : 'N/A'}
        sub="Internal Rate of Return"
        positive={irr !== null ? irr > 0 : undefined}
      />
      <MetricCard
        label="Payback"
        tooltip="How many years it takes for cumulative cash flows to fully recover the initial investment. Shorter is better."
        value={formatYears(paybackYears)}
        sub="Time to recover investment"
        positive={paybackYears !== null ? true : false}
      />
      <MetricCard
        label="ROI"
        tooltip="Total net gain divided by total investment, expressed as a percentage. Does not account for the time value of money."
        value={formatPercent(roi)}
        sub="Return on Investment"
        positive={roi >= 0}
      />
      <MetricCard
        label="Net Value"
        tooltip="Total cash generated over the project lifetime with no discounting — simply all inflows minus all outflows. Shows raw profitability before adjusting for the time value of money."
        value={formatCurrency(netValue)}
        sub="Undiscounted total"
        positive={netValue >= 0}
      />
    </div>
  );
}
