import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecordsModalComponent } from './user-records-modal.component';

describe('UserRecordsModalComponent', () => {
  let component: UserRecordsModalComponent;
  let fixture: ComponentFixture<UserRecordsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRecordsModalComponent]
    });
    fixture = TestBed.createComponent(UserRecordsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
