import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'income',
        loadComponent: () => import('./features/income/income.component').then(m => m.IncomeComponent),
    },
    {
        path: 'expense',
        loadComponent: () => import('./features/expense/expense.component').then(m => m.ExpenseComponent),
    },
];
