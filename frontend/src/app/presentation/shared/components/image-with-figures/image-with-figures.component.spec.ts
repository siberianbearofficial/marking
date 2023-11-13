import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWithFiguresComponent } from './image-with-figures.component';

describe('ImageWithFiguresComponent', () => {
  let component: ImageWithFiguresComponent;
  let fixture: ComponentFixture<ImageWithFiguresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageWithFiguresComponent]
    });
    fixture = TestBed.createComponent(ImageWithFiguresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
