export interface NavigationMenu{
    label: string;
    link: string;
}


export interface Income{ 
    date: Date | string;
    incomeSource: string;
    amount: number;
    remarks: string;
}

export interface IncomeSettings{
    title: string
}