'use client';

import type { CashFlow } from '@/types/evaluation';
import { formatCurrency } from '@/lib/utils/format';
import { clsx } from 'clsx';

interface CashFlowTableProps {
  cashFlows: CashFlow[];
}

export function CashFlowTable({ cashFlows }: CashFlowTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {['Year', 'Revenue', 'Expenses', 'Net Cash Flow', 'Cumulative'].map((h) => (
              <th key={h} className="px-4 py-3 text-right first:text-left font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {cashFlows.map((cf) => (
            <tr key={cf.year} className={cf.year === 0 ? 'bg-gray-50/50' : ''}>
              <td className="px-4 py-2.5 font-medium text-gray-700">
                {cf.year === 0 ? 'Year 0 (Initial)' : `Year ${cf.year}`}
              </td>
              <td className="px-4 py-2.5 text-right text-gray-700">{formatCurrency(cf.revenue)}</td>
              <td className="px-4 py-2.5 text-right text-gray-700">{formatCurrency(cf.expenses)}</td>
              <td className={clsx('px-4 py-2.5 text-right font-medium', cf.netCashFlow >= 0 ? 'text-green-700' : 'text-red-600')}>
                {formatCurrency(cf.netCashFlow)}
              </td>
              <td className={clsx('px-4 py-2.5 text-right font-medium', cf.cumulativeCashFlow >= 0 ? 'text-green-700' : 'text-red-600')}>
                {formatCurrency(cf.cumulativeCashFlow)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
