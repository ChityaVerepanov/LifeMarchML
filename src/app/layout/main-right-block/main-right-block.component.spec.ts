import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRightBlockComponent } from './main-right-block.component';

describe('MainRightBlockComponent', () => {
  let component: MainRightBlockComponent;
  let fixture: ComponentFixture<MainRightBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainRightBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainRightBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
