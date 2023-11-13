import {Observable} from "rxjs";
import {User} from "../../entities/user";

export interface UserServiceInterface {
  isUsernameTaken: (username: string) => Observable<boolean>;
  getUsers: () => Observable<User[]>;
  createUser: (username: string, password: string) => Observable<void>;
  updateUser: (user: User) => Observable<void>;
  changeUserPassword: (user: User, currentPassword: string, newPassword: string) => Observable<void>;
  changeUserPasswordByUuid: (uuid: string, currentPassword: string, newPassword: string) => Observable<void>;
  deleteUser: (user: User) => Observable<void>;
  deleteUserByUuid: (uuid: string) => Observable<void>;
}
