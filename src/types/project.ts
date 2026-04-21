export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  fileUrl?: string;
  fileName?: string;
}

export interface DemandItem {
  id: string;
  description: string;
  unitsPerYear: number;
  pricePerUnit: number;
  fileUrl?: string;
  fileName?: string;
}

export interface LiquidationItem {
  id: string;
  description: string;
  amount: number;
  fileUrl?: string;
  fileName?: string;
}

export interface Project {
  id: string;
  uid: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  evaluationPeriodYears: number;
  discountRate: number;
  initialInvestment: ExpenseItem[];
  recurringExpenses: ExpenseItem[];
  demandItems: DemandItem[];
  liquidationItems: LiquidationItem[];
}

export type ProjectFormData = Omit<Project, 'id' | 'uid' | 'createdAt' | 'updatedAt'>;
