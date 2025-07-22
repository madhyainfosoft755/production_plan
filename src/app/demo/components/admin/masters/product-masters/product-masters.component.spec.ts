import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMastersComponent } from './product-masters.component';

describe('ProductMastersComponent', () => {
  let component: ProductMastersComponent;
  let fixture: ComponentFixture<ProductMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMastersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
