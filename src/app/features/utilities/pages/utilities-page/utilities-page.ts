import { Component, ChangeDetectorRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { take } from 'rxjs';

import { CaseItem, Kpi } from '../../../../data/models';
import { UtilitiesService } from '../../../../data/utilities.service';

@Component({
  selector: 'app-utilities-page',
  imports: [NgFor, NgIf],
  templateUrl: './utilities-page.html',
  styleUrl: './utilities-page.scss',
})
export class UtilitiesPage {
  kpis: Kpi[] = [];
  cases: CaseItem[] = [];
  selectedCase: CaseItem | null = null;
  loadError: string | null = null;

  constructor(
    private utilitiesService: UtilitiesService,
    private cdr: ChangeDetectorRef,
  ) {
    // KPIs laden
    this.utilitiesService
      .getKpis()
      .pipe(take(1))
      .subscribe({
        next: (kpis) => {
          this.kpis = kpis;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load KPIs:', err);
          this.loadError = 'Stadtwerkdaten konnten nicht geladen werden (KPIs).';
          this.cdr.detectChanges();
        },
      });

    // Cases laden
    this.utilitiesService
      .getCases()
      .pipe(take(1))
      .subscribe({
        next: (cases) => {
          this.cases = cases;
          this.selectedCase = cases[0] ?? null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load cases:', err);
          this.loadError = 'Stadtwerkdaten konnten nicht geladen werden (Cases).';
          this.cdr.detectChanges();
        },
      });
  }

  selectCase(c: CaseItem) {
    this.selectedCase = c;
    this.cdr.detectChanges();
    console.log('clicked case', c.id);
  }

  isOpen(c: CaseItem) {
    return c.status === 'Offen';
  }
}
