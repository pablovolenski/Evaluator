'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CashFlow } from '@/types/evaluation';
import { formatCurrency } from '@/lib/utils/format';

interface CashFlowChartProps {
  cashFlows: CashFlow[];
}

export function CashFlowChart({ cashFlows }: CashFlowChartProps) {
  const data = cashFlows.map((cf) => ({
    year: cf.year === 0 ? 'Yr 0\n(Initial)' : `Yr ${cf.year}`,
    Revenue: cf.revenue,
    Expenses: cf.expenses,
    Cumulative: cf.cumulativeCashFlow,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis
            yAxisId="bar"
            tickFormatter={(v) => formatCurrency(v)}
            tick={{ fontSize: 11 }}
            width={90}
          />
          <YAxis
            yAxisId="line"
            orientation="right"
            tickFormatter={(v) => formatCurrency(v)}
            tick={{ fontSize: 11 }}
            width={90}
          />
          <Tooltip
            formatter={(value, name) =>
              typeof value === 'number' ? [formatCurrency(value), name] : [String(value), name]
            }
          />
          <Legend />
          <Bar yAxisId="bar" dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="bar" dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Line
            yAxisId="line"
            type="monotone"
            dataKey="Cumulative"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
