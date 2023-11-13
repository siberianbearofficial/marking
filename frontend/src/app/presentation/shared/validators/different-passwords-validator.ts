import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const DifferentPasswordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const currentPassword = control.get('currentPassword');
  const newPassword = control.get('newPassword');

  return currentPassword && newPassword && currentPassword.value === newPassword.value ? {differentPasswords: true} : null;
};
