import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLeftBlockComponent } from './main-left-block.component';

describe('MainLeftBlockComponent', () => {
  let component: MainLeftBlockComponent;
  let fixture: ComponentFixture<MainLeftBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLeftBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLeftBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
