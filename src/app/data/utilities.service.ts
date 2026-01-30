import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CaseItem, Kpi } from './models';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  private readonly apiBaseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getKpis(): Observable<Kpi[]> {
    return this.http.get<Kpi[]>(`${this.apiBaseUrl}/kpis`);
  }

  getCases(): Observable<CaseItem[]> {
    return this.http.get<CaseItem[]>(`${this.apiBaseUrl}/cases`);
  }

  getCaseById(id: string): Observable<CaseItem> {
    return this.http.get<CaseItem>(`${this.apiBaseUrl}/cases/${id}`);
  }
}
