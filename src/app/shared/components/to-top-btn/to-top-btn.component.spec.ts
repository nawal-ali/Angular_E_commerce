import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToTopBtnComponent } from './to-top-btn.component';

describe('ToTopBtnComponent', () => {
  let component: ToTopBtnComponent;
  let fixture: ComponentFixture<ToTopBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToTopBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToTopBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
