import {Component} from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";

@Component({
  selector: 'app-user-records-modal',
  templateUrl: './user-records-modal.component.html',
  styles: [``]
})
export class UserRecordsModalComponent {
  constructor(public modalRef: MdbModalRef<UserRecordsModalComponent>) {
  }

  public recordIdList?: string;
}
