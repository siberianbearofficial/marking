import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowComparisonResultComponent } from './show-comparison-result.component';

describe('ComparisonResultComponent', () => {
  let component: ShowComparisonResultComponent;
  let fixture: ComponentFixture<ShowComparisonResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowComparisonResultComponent]
    });
    fixture = TestBed.createComponent(ShowComparisonResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
