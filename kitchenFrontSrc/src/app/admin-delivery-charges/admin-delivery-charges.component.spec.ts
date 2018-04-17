import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeliveryChargesComponent } from './admin-delivery-charges.component';

describe('AdminDeliveryChargesComponent', () => {
  let component: AdminDeliveryChargesComponent;
  let fixture: ComponentFixture<AdminDeliveryChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDeliveryChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeliveryChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
