import { AbstractControl, ValidationErrors } from '@angular/forms';

export function customEmailValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return email && !emailRegex.test(email) ? { customEmail: true } : null;
}
