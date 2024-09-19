export interface NavigationMenu {
  label: string;
  link: string;
}

export interface FilterSettings {
  query: string;
  order: 'asc' | 'desc';
  startDate: Date | null;
  endDate: Date | null;
  currentPage: number; // Added for pagination
  itemsPerPage: number; // Added for pagination
}

export interface DisplayedColumns {
  column: string;
  header: string;
  type?: string;
}

export interface Pagination {
  current: number;
  pageSize: number;
}

export interface TableFilter {
  type: 'search' | 'date-range';
  value: any;
}

export interface TableSettings {
  title: string;
  filter: FilterSettings;
}

export type FinanceSources = 'cash' | 'capital' | 'savings';

export interface DefaultFormEntry{
  id?: string;
  date: Date | string;
  incomeSource?: string;
  description: string;
  amount: number;
  remarks: string;
}