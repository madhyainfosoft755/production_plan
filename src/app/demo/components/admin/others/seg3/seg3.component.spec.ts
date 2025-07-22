import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Seg3Component } from './seg3.component';

describe('Seg3Component', () => {
  let component: Seg3Component;
  let fixture: ComponentFixture<Seg3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Seg3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Seg3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
