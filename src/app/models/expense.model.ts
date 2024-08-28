
export interface Expense {
  id?: string;
  date: Date | string;
  description: string;
  amount: number;
  remarks: string;
}