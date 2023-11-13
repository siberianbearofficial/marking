import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopLogoLayoutComponent } from './top-logo-layout.component';

describe('TopLogoLayoutComponent', () => {
  let component: TopLogoLayoutComponent;
  let fixture: ComponentFixture<TopLogoLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopLogoLayoutComponent]
    });
    fixture = TestBed.createComponent(TopLogoLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
