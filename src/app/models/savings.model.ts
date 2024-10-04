import { DefaultFormEntry } from "./global.model";

export interface Savings extends DefaultFormEntry{
    foreignId: string;
}

export enum SavingsSource {
    'Income' = 'income',
    'Capital' = 'capital',
    'Others' = 'others',
} 