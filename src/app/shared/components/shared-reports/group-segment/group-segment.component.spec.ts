import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSegmentComponent } from './group-segment.component';

describe('GroupSegmentComponent', () => {
  let component: GroupSegmentComponent;
  let fixture: ComponentFixture<GroupSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupSegmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
