import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

interface Kpi {
  label: string;
  value: string; // wir lassen es als String (z.B. "1,92 Mio. €"), später kann das number werden
  meta: string;
}

type CaseStatus = 'Offen' | 'In Klärung';

interface CaseItem {
  id: string;
  customerRef: string; // z.B. "K-1005 Autohaus Becker"
  amountEur: number;
  overdueDays: number;
  status: CaseStatus;

  nextStep: string;
}

@Component({
  selector: 'app-utilities-page',
  imports: [NgFor],
  templateUrl: './utilities-page.html',
  styleUrl: './utilities-page.scss',
})

export class UtilitiesPage {
  kpis: Kpi[] = [
    { label: 'Aktive Kunden', value: '12.480', meta: 'Stand: aktuell' },
    { label: 'Neukunden (30 Tage)', value: '186', meta: '+4,2% ggü. Vormonat' },
    { label: 'Kündigungen (30 Tage)', value: '94', meta: 'Churn: 0,75%' },
    { label: 'Offene Forderungen', value: '184.230 €', meta: 'Überfällig gesamt' },
    { label: 'Monatsumsatz (Schätzung)', value: '1,92 Mio. €', meta: 'Abrechnung noch offen' },
    { label: 'Ø Verbrauch pro Kunde', value: '3.120 kWh', meta: 'Strom (Privat)' },
  ];

  cases: CaseItem[] = [
    {
      id: 'F-90012',
      customerRef: 'K-1005 Autohaus Becker',
      amountEur: 1842.5,
      overdueDays: 14,
      status: 'Offen',
      nextStep: 'Kundenkontakt zur Klärung / Zahlungsziel bestätigen',
    },
    {
      id: 'F-90018',
      customerRef: 'K-1001 Schmidt GmbH',
      amountEur: 6420.1,
      overdueDays: 7,
      status: 'In Klärung',
      nextStep: 'Rechnungsprüfung / Klärung mit Fachabteilung',
    },
    {
      id: 'F-90021',
      customerRef: 'K-1002 Familie Müller',
      amountEur: 128.9,
      overdueDays: 3,
      status: 'Offen',
      nextStep: 'Zahlungseingang prüfen, ggf. Erinnerung senden',
    },
  ];

  selectedCase: CaseItem = this.cases[0];

  selectCase(c: CaseItem) {
    this.selectedCase = c;
  }

  isOpen(c: CaseItem) {
    return c.status === 'Offen';
  }
}

