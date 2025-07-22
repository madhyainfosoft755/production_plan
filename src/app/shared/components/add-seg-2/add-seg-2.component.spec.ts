import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeg2Component } from './add-seg-2.component';

describe('AddSeg2Component', () => {
  let component: AddSeg2Component;
  let fixture: ComponentFixture<AddSeg2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSeg2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSeg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
