export interface CashFlow {
  year: number;
  revenue: number;
  expenses: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
}

export interface EvaluationResult {
  cashFlows: CashFlow[];
  npv: number;
  irr: number | null;
  paybackYears: number | null;
  roi: number;
  isViable: boolean;
}
