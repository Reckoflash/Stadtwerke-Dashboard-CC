import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { take } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

import { Customer } from '../../../../data/models';
import { CustomersService } from '../../../../data/customers.service';

@Component({
  selector: 'app-customers-page',
  imports: [NgFor, NgIf],
  templateUrl: './customers-page.html',
  styleUrl: './customers-page.scss',
})
export class CustomersPage {
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;

  loadError: string | null = null;

  constructor(
    private customersService: CustomersService,
    private cdr: ChangeDetectorRef,
  ) {
    this.customersService
      .getCustomers()
      .pipe(take(1))
      .subscribe({
        next: (customers) => {
          console.log('Customers loaded:', customers);
          this.customers = customers;
          this.selectedCustomer = customers[0] ?? null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load customers:', err);
          this.loadError = 'Kundendaten konnten nicht geladen werden (siehe Konsole).';
        },
      });
  }

  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.cdr.detectChanges();
  }

  isActive(customer: Customer) {
    return customer.status === 'Aktiv';
  }
}
