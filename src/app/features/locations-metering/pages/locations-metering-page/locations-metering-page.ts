import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

declare const API_BASE_URL: string;

type Commodity = 'Strom' | 'Gas' | 'Wasser' | 'Wärme';
type MaloStatus = 'Aktiv' | 'Stillgelegt';

type ReadingType = 'Ablesung' | 'Kunde' | 'Schätzung' | '—';
type MeasurementType = 'SLP' | 'RLM' | null;

interface PartnerRef {
  id: string;
  name: string;
}

interface ProductRef {
  id: string;
  name: string;
}

interface ContractRef {
  id: string;
  product: ProductRef;
  startDate: string;
}

interface MeterInfo {
  meloId: string;
  measurementType: MeasurementType;

  meterNumber: string;
  meterType: string | null;
  installDate: string | null;
  register: string | null;

  readingDate: string;
  readingValue: string;
  readingType: ReadingType;
}

interface MarketLocation {
  id: string;
  address: string;
  commodity: Commodity;
  status: MaloStatus;

  usageType: string;
  usage: string; // Alias
  gridArea: string;

  partner: PartnerRef;
  activeContract: ContractRef | null;
  meter: MeterInfo;
}

/** API shapes (Backend) */
type ApiMaloListRow = {
  id: string;
  address: string;
  commodity: Commodity;
  status: MaloStatus;
  usageType: string;
  gridArea: string;
  partner: { id: string; name: string };
  activeContract: null | { id: string; product: string; startDate: string };
};

type ApiMaloDetail = ApiMaloListRow & {
  meter: {
    meloId: string;
    measurementType: MeasurementType;

    meterNumber: string;
    meterType: string | null;
    installDate: string | null;
    register: string | null;

    readingDate: string;
    readingValue: string;
    readingType: ReadingType;
  };
};

@Component({
  selector: 'app-locations-page',
  imports: [NgFor, NgIf],
  templateUrl: './locations-metering-page.html',
  styleUrl: './locations-metering-page.scss',
})
export class LocationsPage implements OnInit {
  private readonly base =
    typeof API_BASE_URL !== 'undefined' && API_BASE_URL ? API_BASE_URL : '/api';

  malos: MarketLocation[] = [];
  selectedMalo: MarketLocation | null = null;

  loadingList = false;
  loadingDetail = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadList();
  }

  private parseProduct(productStr: string): ProductRef {
    const s = String(productStr || '').trim();
    if (!s) return { id: '—', name: '—' };

    // "P-2001 · Privat Standard Strom"
    if (s.includes('·')) {
      const [id, ...rest] = s.split('·');
      return { id: id.trim() || '—', name: rest.join('·').trim() || '—' };
    }

    // fallback: "P-2001 Privat Standard Strom"
    const parts = s.split(/\s+/);
    const id = parts.shift() || '—';
    const name = parts.join(' ').trim() || '—';
    return { id, name };
  }

  private emptyMeter(): MeterInfo {
    return {
      meloId: '—',
      measurementType: null,

      meterNumber: '—',
      meterType: null,
      installDate: null,
      register: null,

      readingDate: '—',
      readingValue: '—',
      readingType: '—',
    };
  }

  private mapListRow(r: ApiMaloListRow): MarketLocation {
    return {
      id: r.id,
      address: r.address,
      commodity: r.commodity,
      status: r.status,

      usageType: r.usageType,
      usage: r.usageType,
      gridArea: r.gridArea,

      partner: { id: r.partner.id, name: r.partner.name },

      activeContract: r.activeContract
        ? {
            id: r.activeContract.id,
            product: this.parseProduct(r.activeContract.product),
            startDate: r.activeContract.startDate,
          }
        : null,

      meter: this.emptyMeter(),
    };
  }

  private mapDetail(d: ApiMaloDetail): MarketLocation {
    return {
      id: d.id,
      address: d.address,
      commodity: d.commodity,
      status: d.status,

      usageType: d.usageType,
      usage: d.usageType,
      gridArea: d.gridArea,

      partner: { id: d.partner.id, name: d.partner.name },

      activeContract: d.activeContract
        ? {
            id: d.activeContract.id,
            product: this.parseProduct(d.activeContract.product),
            startDate: d.activeContract.startDate,
          }
        : null,

      meter: {
        meloId: d.meter?.meloId || '—',
        measurementType: d.meter?.measurementType ?? null,

        meterNumber: d.meter?.meterNumber || '—',
        meterType: d.meter?.meterType ?? null,
        installDate: d.meter?.installDate ?? null,
        register: d.meter?.register ?? null,

        readingDate: d.meter?.readingDate || '—',
        readingValue: d.meter?.readingValue || '—',
        readingType: d.meter?.readingType || '—',
      },
    };
  }

  loadList(): void {
    this.loadingList = true;

    this.http.get<ApiMaloListRow[]>(`${this.base}/market-locations`).subscribe({
      next: (rows) => {
        this.malos = (rows || []).map((r) => this.mapListRow(r));
        this.loadingList = false;

        if (this.malos.length) {
          this.selectMalo(this.malos[0]);
        }
      },
      error: () => {
        this.loadingList = false;
      },
    });
  }

  selectMalo(m: MarketLocation): void {
    this.selectedMalo = m;
    this.loadDetail(m.id);
  }

  private loadDetail(maloId: string): void {
    this.loadingDetail = true;

    this.http
      .get<ApiMaloDetail>(`${this.base}/market-locations/${encodeURIComponent(maloId)}`)
      .subscribe({
        next: (d) => {
          const detail = this.mapDetail(d);

          const idx = this.malos.findIndex((x) => x.id === detail.id);
          if (idx >= 0) this.malos[idx] = { ...this.malos[idx], ...detail };

          this.selectedMalo = idx >= 0 ? this.malos[idx] : detail;
          this.loadingDetail = false;
        },
        error: () => {
          this.loadingDetail = false;
        },
      });
  }
}
