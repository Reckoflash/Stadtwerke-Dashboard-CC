import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilitiesPage } from './utilities-page';

describe('UtilitiesPage', () => {
  let component: UtilitiesPage;
  let fixture: ComponentFixture<UtilitiesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilitiesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilitiesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
