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
        order: 'asc' | 'desc',
        startDate: Date | null;
        endDate: Date | null;
        currentPage: number; // Added for pagination
        itemsPerPage: number; // Added for pagination
    }
}