import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenDriverComponent } from './kitchen-driver.component';

describe('KitchenDriverComponent', () => {
  let component: KitchenDriverComponent;
  let fixture: ComponentFixture<KitchenDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KitchenDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchenDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
