import {Component} from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";

@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styles: [``]
})
export class DeleteUserModalComponent {
  constructor(public modalRef: MdbModalRef<DeleteUserModalComponent>) {
  }
}
