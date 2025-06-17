import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGraphModalComponent } from './product-graph-modal.component';

describe('ProductGraphModalComponent', () => {
  let component: ProductGraphModalComponent;
  let fixture: ComponentFixture<ProductGraphModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductGraphModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductGraphModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
