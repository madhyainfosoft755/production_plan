import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFinishComponent } from './add-finish.component';

describe('AddFinishComponent', () => {
  let component: AddFinishComponent;
  let fixture: ComponentFixture<AddFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFinishComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
