import { FinanceSources } from "@app/models/global.model";

export interface PayLiabilityInputData {
  item: string;
  total: number;
}

export interface PayLiabilityOutputData {
  amount: number;
  payFrom: FinanceSources;
}
