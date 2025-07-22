import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Seg2Component } from './seg2.component';

describe('Seg2Component', () => {
  let component: Seg2Component;
  let fixture: ComponentFixture<Seg2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Seg2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Seg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
