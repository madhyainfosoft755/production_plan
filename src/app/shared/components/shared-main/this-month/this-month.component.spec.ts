import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThisMonthComponent } from './this-month.component';

describe('ThisMonthComponent', () => {
  let component: ThisMonthComponent;
  let fixture: ComponentFixture<ThisMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThisMonthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThisMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
