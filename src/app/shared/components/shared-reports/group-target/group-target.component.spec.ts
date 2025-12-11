import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTargetComponent } from './group-target.component';

describe('GroupTargetComponent', () => {
  let component: GroupTargetComponent;
  let fixture: ComponentFixture<GroupTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupTargetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
