import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineMastersComponent } from './machine-masters.component';

describe('MachineMastersComponent', () => {
  let component: MachineMastersComponent;
  let fixture: ComponentFixture<MachineMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineMastersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
