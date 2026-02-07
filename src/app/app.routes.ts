import { Routes } from '@angular/router';
import { AppShell } from './layout/app-shell/app-shell';

import { CustomersPage } from './features/customers/pages/customers-page/customers-page';
import { ProductsPage } from './features/products/pages/products-page/products-page';
import { UtilitiesPage } from './features/utilities/pages/utilities-page/utilities-page';

import { LocationsPage } from './features/locations-metering/pages/locations-metering-page/locations-metering-page';
import { ContractsPage } from './features/contracts-billing/pages/contracts-billing-page/contracts-billing-page';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      // Default: Start auf "Geschäftspartner"
      { path: '', pathMatch: 'full', redirectTo: 'business-partners' },

      { path: 'business-partners', component: CustomersPage },
      { path: 'locations-metering', component: LocationsPage },
      { path: 'contracts-billing', component: ContractsPage },
      { path: 'products-tariffs', component: ProductsPage },
      { path: 'service-finance', component: UtilitiesPage },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'business-partners' },
];
