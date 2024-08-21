export interface NavigationMenu{
    label: string;
    link: string;
}


export interface Income{ 
    id?:string,
    date: Date | string;
    incomeSource: string;
    amount: number;
    remarks: string;
}

export interface IncomeSettings{
    title: string
    filter: {
        query: string,
        order: 'asc' | 'desc'
    }
}