
export interface Summary {
  id?: string;
  netIncome: number;
  remainingCapital: number;
  totalIncome: number;
  totalExpense: number;
  totalPurchases: number;
  totalCapital: number;
}

export interface ParsedSummary {
  item: string;
  total: number;
  class?: string;
}