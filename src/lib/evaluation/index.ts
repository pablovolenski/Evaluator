import type { Project } from '@/types/project';
import type { EvaluationResult } from '@/types/evaluation';
import { buildCashFlowSeries } from './cashflow';
import { calculateNPV } from './npv';
import { calculateIRR } from './irr';
import { calculatePayback } from './payback';
import { calculateROI } from './roi';

export function evaluateProject(project: Project): EvaluationResult {
  const cashFlows = buildCashFlowSeries(project);
  const npv = calculateNPV(cashFlows, project.discountRate);
  const irr = calculateIRR(cashFlows);
  const paybackYears = calculatePayback(cashFlows);
  const roi = calculateROI(cashFlows);

  const netValue = cashFlows[cashFlows.length - 1]?.cumulativeCashFlow ?? 0;

  return {
    cashFlows,
    npv,
    irr,
    paybackYears,
    roi,
    netValue,
    isViable: npv > 0,
  };
}

export { buildCashFlowSeries } from './cashflow';
export { calculateNPV } from './npv';
export { calculateIRR } from './irr';
export { calculatePayback } from './payback';
export { calculateROI } from './roi';
