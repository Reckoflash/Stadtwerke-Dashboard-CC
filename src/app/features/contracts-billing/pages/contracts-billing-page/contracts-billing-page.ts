import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

declare const API_BASE_URL: string;

type ContractStatus = 'Aktiv' | 'Gekündigt' | 'Beendet';
type Commodity = 'Strom' | 'Gas' | 'Wasser' | 'Wärme';
type OpStatus = 'Offen' | 'In Klärung' | 'In Raten';
type PaymentStatus = 'Verbucht' | 'Unklar';

interface PartnerRef {
  id: string;
  name: string;
}

interface ProductRef {
  id: string;
  name: string;
  validFrom?: string;
}

interface OpenItem {
  opNo: string;
  amountEur: number;
  overdueSince: string;
  dunningLevel: 'MS0' | 'MS1' | 'MS2' | 'MS3';
  status: OpStatus;
}

interface LastPayment {
  date: string;
  amountEur: number;
  method: 'SEPA' | 'Überweisung';
  status: PaymentStatus;
}

interface Contract {
  id: string;
  status: ContractStatus;
  commodity: Commodity;
  maloId: string;
  startDate: string;
  endDate?: string;

  partner: PartnerRef;
  product: ProductRef;

  // Detail-Felder (werden erst beim Detail-Laden gefüllt)
  termMonths?: number;
  noticeWeeks?: number;
  accountId?: string;

  installmentEurMonthly?: number;
  installmentValidFrom?: string;
  installmentReason?: string;

  openItems?: OpenItem[];
  lastPayment?: LastPayment;
}

/** API Shapes (Backend passt) */
type ApiContractListRow = {
  id: string;
  status: ContractStatus;
  commodity: Commodity;
  maloId: string;
  startDate: string;
  endDate: string | null;
  partner: { id: string; name: string };
  product: { id: string; name: string; validFrom?: string };
};

type ApiContractDetail = {
  id: string;
  status: ContractStatus;
  commodity: Commodity;
  maloId: string;
  startDate: string;
  endDate: string | null;

  termMonths: number;
  noticeWeeks: number;
  accountId: string | null;

  partner: { id: string; name: string };
  product: { id: string; name: string; validFrom?: string };

  installmentEurMonthly: number;
  installmentValidFrom: string;
  installmentReason: string;

  openItems: Array<{
    opNo: string;
    amountEur: number;
    overdueSince: string;
    dunningLevel: 'MS0' | 'MS1' | 'MS2' | 'MS3';
    status: OpStatus;
  }>;

  lastPayment: {
    date: string;
    amountEur: number;
    method: 'SEPA' | 'Überweisung';
    status: PaymentStatus;
  };
};

@Component({
  selector: 'app-contracts-page',
  imports: [NgFor, NgIf],
  templateUrl: './contracts-billing-page.html',
  styleUrl: './contracts-billing-page.scss',
})
export class ContractsPage implements OnInit {
  private readonly base =
    typeof API_BASE_URL !== 'undefined' && API_BASE_URL ? API_BASE_URL : '/api';

  contracts: Contract[] = [];
  selectedContract: Contract | null = null;

  loadingList = false;
  loadingDetail = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadList();
  }

  loadList(): void {
    this.loadingList = true;

    this.http.get<ApiContractListRow[]>(`${this.base}/contracts`).subscribe({
      next: (rows) => {
        this.contracts = (rows || []).map((r) => ({
          id: r.id,
          status: r.status,
          commodity: r.commodity,
          maloId: r.maloId,
          startDate: r.startDate,
          endDate: r.endDate ?? undefined,
          partner: { id: r.partner.id, name: r.partner.name },
          product: { id: r.product.id, name: r.product.name, validFrom: r.product.validFrom },
        }));

        this.loadingList = false;

        if (this.contracts.length) {
          this.selectContract(this.contracts[0]);
        }
      },
      error: () => {
        this.loadingList = false;
      },
    });
  }

  selectContract(c: Contract): void {
    this.selectedContract = c;
    this.loadDetail(c.id);
  }

  private loadDetail(contractId: string): void {
    this.loadingDetail = true;

    this.http
      .get<ApiContractDetail>(`${this.base}/contracts/${encodeURIComponent(contractId)}`)
      .subscribe({
        next: (d) => {
          const detail: Contract = {
            id: d.id,
            status: d.status,
            commodity: d.commodity,
            maloId: d.maloId,
            startDate: d.startDate,
            endDate: d.endDate ?? undefined,

            partner: { id: d.partner.id, name: d.partner.name },
            product: { id: d.product.id, name: d.product.name, validFrom: d.product.validFrom },

            termMonths: d.termMonths,
            noticeWeeks: d.noticeWeeks,
            accountId: d.accountId ?? undefined,

            installmentEurMonthly: d.installmentEurMonthly,
            installmentValidFrom: d.installmentValidFrom,
            installmentReason: d.installmentReason,

            openItems: (d.openItems || []).map((op) => ({
              opNo: op.opNo,
              amountEur: op.amountEur,
              overdueSince: op.overdueSince,
              dunningLevel: op.dunningLevel,
              status: op.status,
            })),

            lastPayment: {
              date: d.lastPayment.date,
              amountEur: d.lastPayment.amountEur,
              method: d.lastPayment.method,
              status: d.lastPayment.status,
            },
          };

          // Detail in Liste “zurückschreiben”, damit UI konsistent bleibt
          const idx = this.contracts.findIndex((x) => x.id === detail.id);
          if (idx >= 0) this.contracts[idx] = { ...this.contracts[idx], ...detail };

          this.selectedContract = idx >= 0 ? this.contracts[idx] : detail;
          this.loadingDetail = false;
        },
        error: () => {
          this.loadingDetail = false;
        },
      });
  }

  eur(n: number | undefined) {
    if (n === null || n === undefined) return '—';
    return Number(n).toFixed(2).replace('.', ',') + ' €';
  }
}
