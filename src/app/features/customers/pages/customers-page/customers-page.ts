import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

type CustomerStatus = 'Aktiv' | 'Inaktiv';

interface Customer {
  id: string;
  displayName: string;           // Name in der Tabelle
  annualConsumptionKwh: number;  // Jahresverbrauch
  tariff: string;
  status: CustomerStatus;

  // Details (rechte Karte)
  fullName: string;
  email: string;
  phone: string;
  address: string;
  customerSince: string; // für den Anfang als String (später Date)
}

@Component({
  selector: 'app-customers-page',
  imports: [NgFor],
  templateUrl: './customers-page.html',
  styleUrl: './customers-page.scss',
})
export class CustomersPage {
  // Mock-Liste (später aus API/DB)
  customers: Customer[] = [
    {
      id: 'K-1002',
      displayName: 'Familie Müller',
      annualConsumptionKwh: 3450,
      tariff: 'Privat Standard',
      status: 'Aktiv',
      fullName: 'Thomas und Anna Müller',
      email: 'thomas.mueller@email.de',
      phone: '+49 221 98765432',
      address: 'Rosenweg 12, 50674 Köln',
      customerSince: '01.07.2020',
    },
    {
      id: 'K-1001',
      displayName: 'Schmidt GmbH',
      annualConsumptionKwh: 45200,
      tariff: 'Gewerbe Plus',
      status: 'Aktiv',
      fullName: 'Schmidt GmbH (Ansprechpartner: Lena Schmidt)',
      email: 'kontakt@schmidt-gmbh.de',
      phone: '+49 221 12345678',
      address: 'Industriestraße 5, 50667 Köln',
      customerSince: '15.03.2018',
    },
    {
      id: 'K-1005',
      displayName: 'Autohaus Becker',
      annualConsumptionKwh: 78900,
      tariff: 'Gewerbe Premium',
      status: 'Inaktiv',
      fullName: 'Autohaus Becker (Ansprechpartner: Paul Becker)',
      email: 'info@autohaus-becker.de',
      phone: '+49 221 55555555',
      address: 'Automeile 3, 51149 Köln',
      customerSince: '10.11.2019',
    },
  ];

  // Ausgewählter Kunde (State)
  selectedCustomer: Customer = this.customers[0];

  // Wird beim Klick auf eine Tabellenzeile gesetzt
  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
  }

  // Kleiner Helper fürs Template: Status → boolean
  isActive(customer: Customer) {
    return customer.status === 'Aktiv';
  }
}