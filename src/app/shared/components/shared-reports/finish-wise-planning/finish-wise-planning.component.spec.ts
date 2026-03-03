import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishWisePlanningComponent } from './finish-wise-planning.component';

describe('FinishWisePlanningComponent', () => {
  let component: FinishWisePlanningComponent;
  let fixture: ComponentFixture<FinishWisePlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishWisePlanningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinishWisePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
