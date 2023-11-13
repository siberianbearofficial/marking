import {Injectable} from '@angular/core';
import {UserApiService} from "../../api/user-api.service";
import {map, Observable} from "rxjs";
import {CreateUserRequestModel} from "../../models/create-user-request-model";
import {ChangeUserPasswordRequestModel} from "../../models/change-user-password-request-model";
import {User} from "../../../core/domain/entities/user";
import {UserModel} from "../../models/user-model";

@Injectable({
  providedIn: 'root'
})
export class UserAdapterService {

  constructor(private userApi: UserApiService) {
  }

  public isUsernameTaken(username: string): Observable<boolean> {
    return this.userApi.getUsersByUsername(username).pipe(
      map((userModel: Object | string | boolean): boolean => {
        if (typeof userModel == 'string')
          return JSON.parse(userModel).length > 0;
        return (userModel as User[]).length > 0;
      })
    );
  }

  public getUsers(): Observable<User[]> {
    return this.userApi.getUsers()
      .pipe(
        map((userModels: Object | string): User[] => {
          let users: User[] = [];
          let userModelsParsed: UserModel[];
          if (typeof userModels == 'string') {
            userModelsParsed = JSON.parse(userModels) as UserModel[];
          } else {
            userModelsParsed = userModels as UserModel[];
          }
          userModelsParsed.forEach((userModel: UserModel): void => {
            const user: User = {
              uuid: userModel.uuid,
              username: userModel.username,
              isAdmin: userModel.is_admin,
              recordsIdList: userModel.records_id_list
            };
            users.push(user);
          });
          return users;
        })
      );
  }

  public createUser(username: string, password: string): Observable<void> {
    const createUserRequestModel: CreateUserRequestModel = {
      'username': username,
      'password': password
    };
    return this.userApi.postUser(createUserRequestModel)
      .pipe(map(() => void 0));
  }

  public updateUser(uuid: string, user: User): Observable<void> {
    const userModel: UserModel = {
      uuid: user.uuid,
      username: user.username,
      is_admin: user.isAdmin,
      records_id_list: user.recordsIdList
    };
    return this.userApi.putUser(uuid, userModel)
      .pipe(map(() => void 0));
  }

  public changeUserPassword(uuid: string, currentPassword: string, newPassword: string): Observable<void> {
    const changeUserPasswordRequestModel: ChangeUserPasswordRequestModel = {
      'current_password': currentPassword,
      'new_password': newPassword
    };
    return this.userApi.changeUserPassword(uuid, changeUserPasswordRequestModel)
      .pipe(map(() => void 0));
  }

  public deleteUser(uuid: string): Observable<void> {
    return this.userApi.deleteUser(uuid)
      .pipe(map(() => void 0));
  }
}
