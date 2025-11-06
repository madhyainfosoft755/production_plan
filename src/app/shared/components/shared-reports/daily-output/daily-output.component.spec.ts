import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyOutputComponent } from './daily-output.component';

describe('DailyOutputComponent', () => {
  let component: DailyOutputComponent;
  let fixture: ComponentFixture<DailyOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyOutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
