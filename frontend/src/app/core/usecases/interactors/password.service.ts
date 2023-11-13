import {Injectable} from '@angular/core';
import {hashSync} from "bcryptjs";

const SALT: string = '$2a$10$jalp2zyo1TY3hV8MXE57b.';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  public hash(password: string): string {
    return hashSync(password, SALT);
  }
}
