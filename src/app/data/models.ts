// src/app/data/models.ts

export type CustomerStatus = 'Aktiv' | 'Inaktiv';

export interface Customer {
  id: string;
  displayName: string;
  annualConsumptionKwh: number;
  tariff: string;
  status: CustomerStatus;

  fullName: string;
  email: string;
  phone: string;
  address: string;
  customerSince: string;
}

export type ProductStatus = 'Aktiv' | 'Auslaufend';
export type Commodity = 'Strom' | 'Gas';
export type TargetGroup = 'Privat' | 'Gewerbe';

export interface Product {
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

export interface Kpi {
  label: string;
  value: string;
  meta: string;
}

export type CaseStatus = 'Offen' | 'In Klärung';

export interface CaseItem {
  id: string;
  customerRef: string;
  amountEur: number;
  overdueDays: number;
  status: CaseStatus;
  nextStep: string;
}
