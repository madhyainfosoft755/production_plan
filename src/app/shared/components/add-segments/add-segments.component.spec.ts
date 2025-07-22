import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSegmentsComponent } from './add-segments.component';

describe('AddSegmentsComponent', () => {
  let component: AddSegmentsComponent;
  let fixture: ComponentFixture<AddSegmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSegmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
