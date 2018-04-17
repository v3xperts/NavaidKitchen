import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmindriverComponent } from './admindriver.component';

describe('AdmindriverComponent', () => {
  let component: AdmindriverComponent;
  let fixture: ComponentFixture<AdmindriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmindriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmindriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
