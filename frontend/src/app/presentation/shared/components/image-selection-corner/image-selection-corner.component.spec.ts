import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelectionCornerComponent } from './image-selection-corner.component';

describe('ImageSelectionCornerComponent', () => {
  let component: ImageSelectionCornerComponent;
  let fixture: ComponentFixture<ImageSelectionCornerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageSelectionCornerComponent]
    });
    fixture = TestBed.createComponent(ImageSelectionCornerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
