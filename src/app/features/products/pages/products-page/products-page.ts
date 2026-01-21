import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

type ProductStatus = 'Aktiv' | 'Auslaufend';
type Commodity = 'Strom' | 'Gas';
type TargetGroup = 'Privat' | 'Gewerbe';

interface Product {
  id: string;
  name: string;
  commodity: Commodity;
  targetGroup: TargetGroup;
  basePriceMonthlyEur: number;
  workPriceCtPerKwh: number;
  status: ProductStatus;

  contractTermMonths: number;
  noticePeriodWeeks: number;
  isGreen: boolean;
  validFrom: string;
}

@Component({
  selector: 'app-products-page',
  imports: [NgFor],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})

export class ProductsPage {
  products: Product[] = [
    {
      id: 'P-2001',
      name: 'Privat Standard Strom',
      commodity: 'Strom',
      targetGroup: 'Privat',
      basePriceMonthlyEur: 12.9,
      workPriceCtPerKwh: 33.4,
      status: 'Aktiv',
      contractTermMonths: 12,
      noticePeriodWeeks: 4,
      isGreen: false,
      validFrom: '01.01.2026',
    },
    {
      id: 'P-2002',
      name: 'Privat Öko Strom',
      commodity: 'Strom',
      targetGroup: 'Privat',
      basePriceMonthlyEur: 14.9,
      workPriceCtPerKwh: 34.9,
      status: 'Aktiv',
      contractTermMonths: 12,
      noticePeriodWeeks: 4,
      isGreen: true,
      validFrom: '01.01.2026',
    },
    {
      id: 'P-2101',
      name: 'Gewerbe Plus Strom',
      commodity: 'Strom',
      targetGroup: 'Gewerbe',
      basePriceMonthlyEur: 29.0,
      workPriceCtPerKwh: 28.9,
      status: 'Aktiv',
      contractTermMonths: 24,
      noticePeriodWeeks: 6,
      isGreen: false,
      validFrom: '01.01.2026',
    },
    {
      id: 'P-3001',
      name: 'Privat Standard Gas',
      commodity: 'Gas',
      targetGroup: 'Privat',
      basePriceMonthlyEur: 13.5,
      workPriceCtPerKwh: 11.2,
      status: 'Auslaufend',
      contractTermMonths: 12,
      noticePeriodWeeks: 4,
      isGreen: false,
      validFrom: '01.11.2025',
    },
  ];

  selectedProduct: Product = this.products[0];

  selectProduct(p: Product) {
    this.selectedProduct = p;
  }

  isActive(p: Product) {
    return p.status === 'Aktiv';
  }
}
