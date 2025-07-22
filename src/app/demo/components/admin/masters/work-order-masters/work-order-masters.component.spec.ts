import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderMastersComponent } from './work-order-masters.component';

describe('WorkOrderMastersComponent', () => {
  let component: WorkOrderMastersComponent;
  let fixture: ComponentFixture<WorkOrderMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderMastersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkOrderMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
