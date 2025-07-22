import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMainFileComponent } from './update-main-file.component';

describe('UpdateMainFileComponent', () => {
  let component: UpdateMainFileComponent;
  let fixture: ComponentFixture<UpdateMainFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMainFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateMainFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
