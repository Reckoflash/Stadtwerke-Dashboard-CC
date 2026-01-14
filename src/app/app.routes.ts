import { Routes } from '@angular/router';
import { AppShell } from './layout/app-shell/app-shell';

import { CustomersPage } from './features/customers/pages/customers-page/customers-page';
import { ProductsPage } from './features/products/pages/products-page/products-page';
import { UtilitiesPage } from './features/utilities/pages/utilities-page/utilities-page';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'customers' },
      { path: 'customers', component: CustomersPage },
      { path: 'products', component: ProductsPage },
      { path: 'utilities', component: UtilitiesPage },
    ],
  },
  { path: '**', redirectTo: 'customers' },
];
