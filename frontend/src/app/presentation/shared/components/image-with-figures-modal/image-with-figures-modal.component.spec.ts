import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWithFiguresModalComponent } from './image-with-figures-modal.component';

describe('ImageWithFiguresModalComponent', () => {
  let component: ImageWithFiguresModalComponent;
  let fixture: ComponentFixture<ImageWithFiguresModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageWithFiguresModalComponent]
    });
    fixture = TestBed.createComponent(ImageWithFiguresModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
