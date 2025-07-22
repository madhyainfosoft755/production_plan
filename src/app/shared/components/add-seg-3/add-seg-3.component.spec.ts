import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeg3Component } from './add-seg-3.component';

describe('AddSeg3Component', () => {
  let component: AddSeg3Component;
  let fixture: ComponentFixture<AddSeg3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSeg3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSeg3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
