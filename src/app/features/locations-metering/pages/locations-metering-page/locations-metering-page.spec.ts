import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { LocationsPage } from './locations-metering-page';

describe('LocationsPage', () => {
  let component: LocationsPage;
  let fixture: ComponentFixture<LocationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationsPage],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
