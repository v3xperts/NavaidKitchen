import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenReportComponent } from './kitchen-report.component';

describe('KitchenReportComponent', () => {
  let component: KitchenReportComponent;
  let fixture: ComponentFixture<KitchenReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KitchenReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchenReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
