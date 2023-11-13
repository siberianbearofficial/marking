import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsListComponent } from './records-list.component';

describe('RecordsListComponent', () => {
  let component: RecordsListComponent;
  let fixture: ComponentFixture<RecordsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordsListComponent]
    });
    fixture = TestBed.createComponent(RecordsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
