
export interface Income {
  id?: string;
  date: Date | string;
  incomeSource?: string;
  description?: string;
  amount: number;
  remarks: string;
}
