import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentKeyConfigComponent } from './payment-key-config.component';

describe('PaymentKeyConfigComponent', () => {
  let component: PaymentKeyConfigComponent;
  let fixture: ComponentFixture<PaymentKeyConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentKeyConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentKeyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
