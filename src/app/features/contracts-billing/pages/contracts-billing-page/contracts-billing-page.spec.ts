import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsBillingPage } from './contracts-billing-page';

describe('ContractsBillingPage', () => {
  let component: ContractsBillingPage;
  let fixture: ComponentFixture<ContractsBillingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractsBillingPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsBillingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
