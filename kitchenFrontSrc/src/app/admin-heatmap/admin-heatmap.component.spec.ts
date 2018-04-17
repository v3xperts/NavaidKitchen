import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHeatmapComponent } from './admin-heatmap.component';

describe('AdminHeatmapComponent', () => {
  let component: AdminHeatmapComponent;
  let fixture: ComponentFixture<AdminHeatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminHeatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
