import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeImageSelectionComponent } from './change-image-selection.component';

describe('ChangeImageSelectionComponent', () => {
  let component: ChangeImageSelectionComponent;
  let fixture: ComponentFixture<ChangeImageSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeImageSelectionComponent]
    });
    fixture = TestBed.createComponent(ChangeImageSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
