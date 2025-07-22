import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineModulesComponent } from './machine-modules.component';

describe('MachineModulesComponent', () => {
  let component: MachineModulesComponent;
  let fixture: ComponentFixture<MachineModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineModulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
