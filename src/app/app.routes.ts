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
              (url[0].path.startsWith('update') &&
                url[1]?.path)) // Check if there's any text after 'update/'
          ) {
            const posParams = url[1]?.path? { id: new UrlSegment(url[1].path, {}) }: { id: new UrlSegment('', {}) };
            return {
              consumed: url,
              posParams,
            };
          }
          return null;
        },
        loadComponent: () =>
          import(
            './features/income/pages/add-update-income/add-update-income.component'
          ).then((m) => m.AddUpdateIncomeComponent),
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
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then(
        (m) => m.AboutComponent
      ),
  },
];
