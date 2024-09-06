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
          if (
            url.length >= 1 &&
            (url[0].path === 'add' ||
              (url[0].path.startsWith('update') && url[1]?.path)) // Check if there's any text after 'update/'
          ) {
            const posParams = url[1]?.path
              ? { id: new UrlSegment(url[1].path, {}) }
              : { id: new UrlSegment('', {}) };
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
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './features/expense/pages/list-expense/list-expense.component'
          ).then((m) => m.ListExpenseComponent),
      },
      {
        matcher: (url: any) => {
          if (
            url.length >= 1 &&
            (url[0].path === 'add' ||
              (url[0].path.startsWith('update') && url[1]?.path)) // Check if there's any text after 'update/'
          ) {
            const posParams = url[1]?.path
              ? { id: new UrlSegment(url[1].path, {}) }
              : { id: new UrlSegment('', {}) };
            return {
              consumed: url,
              posParams,
            };
          }
          return null;
        },
        loadComponent: () =>
          import(
            './features/expense/pages/add-update-expense/add-update-expense.component'
          ).then((m) => m.AddUpdateExpenseComponent),
      },
    ],
  },
  {
    path: 'capital',
    loadComponent: () =>
      import('./features/capital/capital.component').then(
        (m) => m.CapitalComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './features/capital/pages/list-capital/list-capital.component'
          ).then((m) => m.ListCapitalComponent),
      },
      {
        matcher: (url: any) => {
          if (
            url.length >= 1 &&
            (url[0].path === 'add' ||
              (url[0].path.startsWith('update') && url[1]?.path)) 
          ) {
            const posParams = url[1]?.path
              ? { id: new UrlSegment(url[1].path, {}) }
              : { id: new UrlSegment('', {}) };
            return {
              consumed: url,
              posParams,
            };
          }
          return null;
        },
        loadComponent: () =>
          import(
            './features/capital/pages/add-update-capital/add-update-capital.component'
          ).then((m) => m.AddUpdateCapitalComponent),
      },
    ],
  },
  {
    path: 'purchase', // New route for Purchase
    loadComponent: () =>
      import('./features/purchase/purchase.component').then(
        (m) => m.PurchaseComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './features/purchase/pages/list-purchase/list-purchase.component'
          ).then((m) => m.ListPurchaseComponent),
      },
      {
        matcher: (url: any) => {
          if (
            url.length >= 1 &&
            (url[0].path === 'add' ||
              (url[0].path.startsWith('update') && url[1]?.path))
          ) {
            const posParams = url[1]?.path
              ? { id: new UrlSegment(url[1].path, {}) }
              : { id: new UrlSegment('', {}) };
            return {
              consumed: url,
              posParams,
            };
          }
          return null;
        },
        loadComponent: () =>
          import(
            './features/purchase/pages/add-update-purchase/add-update-purchase.component'
          ).then((m) => m.AddUpdatePurchaseComponent),
      },
    ],
  },
  {
    path: 'liability', // New route for Liability
    loadComponent: () =>
      import('./features/liability/liability.component').then(
        (m) => m.LiabilityComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './features/liability/pages/list-liability/list-liability.component'
          ).then((m) => m.ListLiabilityComponent),
      },
      {
        matcher: (url: any) => {
          if (
            url.length >= 1 &&
            (url[0].path === 'add' ||
              (url[0].path.startsWith('update') && url[1]?.path))
          ) {
            const posParams = url[1]?.path
              ? { id: new UrlSegment(url[1].path, {}) }
              : { id: new UrlSegment('', {}) };
            return {
              consumed: url,
              posParams,
            };
          }
          return null;
        },
        loadComponent: () =>
          import(
            './features/liability/pages/add-update-liability/add-update-liability.component'
          ).then((m) => m.AddUpdateLiabilityComponent),
      },
    ],
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path:'page-not-found',
    loadComponent: () =>
      import('./features/page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent),
  },
  { 
    path: '**',
    redirectTo: 'page-not-found',
    pathMatch: 'full'
  },
];
