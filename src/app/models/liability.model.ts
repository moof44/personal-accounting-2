import { DefaultFormEntry } from "./global.model";

export interface Liability extends DefaultFormEntry{
    paymentHistory: PaymentHistory[],
}

export interface PaymentHistory{
    date: Date | string,
    amount: number;
    payFrom: string, 
}