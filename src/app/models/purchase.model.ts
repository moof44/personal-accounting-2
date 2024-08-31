export interface Purchase {
  id: string;
  description: string;
  amount: number;
  remarks: string;
  date: Date | string;
  // Add other relevant fields
}