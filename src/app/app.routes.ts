import { Routes, UrlSegment } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'income',
    loadComponent: () =>
      import('./features/income/income.component').then(
        (m) => m.IncomeComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './features/income/pages/list-income/list-income.component'
          ).then((m) => m.ListIncomeComponent),
      },
      {
        matcher: (url: any) => {
          console.log('url', url);
          if (
            url.length >= 1 &&
            (url[0].path === 'add' ||
              (url[0].path.startsWith('update/') &&
                /^\d+$/.test(url[0].path.slice(7))))
          ) {
            return {
              consumed: url,
              posParams: { id: new UrlSegment(url[0].path.slice(7), {}) },
            };
          }
          return null;
        },
        loadComponent: () =>
          import(
            './features/income/pages/add-income/add-income.component'
          ).then((m) => m.AddIncomeComponent),
      },
    ],
  },
  {
    path: 'expense',
    loadComponent: () =>
      import('./features/expense/expense.component').then(
        (m) => m.ExpenseComponent
      ),
  },
];
