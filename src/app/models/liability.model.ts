import { _FilterPagination, DefaultFormEntry, Pagination, TableSettings } from "./global.model";

export interface Liability extends DefaultFormEntry{
    paymentHistory: PaymentHistory[],
}

export interface PaymentHistory{
    date: Date | string,
    amount: number,
    payFrom: string, 
    foreignId: string,
}