import {Component} from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";

@Component({
  selector: 'app-delete-account-modal',
  templateUrl: './delete-account-modal.component.html',
  styles: [``]
})
export class DeleteAccountModalComponent {
  constructor(public modalRef: MdbModalRef<DeleteAccountModalComponent>) {
  }
}
