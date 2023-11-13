import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from "../../../../core/domain/entities/user";
import {MdbModalService} from "mdb-angular-ui-kit/modal";
import {UserRecordsModalComponent} from "../user-records-modal/user-records-modal.component";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styles: [``]
})
export class UsersListComponent {

  public disabled: boolean = true;

  public _users?: User[];
  @Input() set users(users: User[] | undefined) {
    this._users = users;
    this.disabled = false;
  }

  get users(): User[] | undefined {
    return this._users;
  }

  @Input() disabledUsersUuids?: string[];
  @Output() userDeletionEvent: EventEmitter<User> = new EventEmitter<User>();
  @Output() userChangeEvent: EventEmitter<User> = new EventEmitter<User>();

  constructor(private modalService: MdbModalService) {
  }

  public isDisabled(uuid: string): boolean {
    if (this.disabled)
      return true;
    if (this.disabledUsersUuids)
      return this.disabledUsersUuids.includes(uuid);
    return false;
  }

  public onIsAdminClick(user: User): void {
    if (!this.isDisabled(user.uuid)) {
      this.disabled = true;
      const changedUser: User = {
        isAdmin: !user.isAdmin,
        recordsIdList: user.recordsIdList,
        username: user.username,
        uuid: user.uuid
      };
      this.userChangeEvent.emit(changedUser);
    }
  }

  public onShowRecordsClick(user: User): void {
    const config = {
      data: {
        recordIdList: user.recordsIdList
      }
    };
    this.modalService.open(UserRecordsModalComponent, config);
  }

  public onDeleteClick(user: User): void {
    if (!this.isDisabled(user.uuid)) {
      this.userDeletionEvent.emit(user);
    }
  }

  public getIsAdminText(user: User): string {
    return user.isAdmin ? 'Администратор' : 'Пользователь';
  }

  public getIsAdminClass(user: User): string {
    if (user.isAdmin)
      return 'btn-outline-danger text-dark';
    return 'btn-outline-warning text-dark';
  }
}
