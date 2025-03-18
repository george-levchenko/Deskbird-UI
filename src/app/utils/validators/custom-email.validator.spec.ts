import { FormControl } from '@angular/forms';
import { customEmailValidator } from './custom-email.validator';

describe('customEmailValidator', () => {
  it('should return null for a valid email', () => {
    const control = new FormControl('test@example.com');
    const result = customEmailValidator(control);
    expect(result).toBeNull();
  });

  it('should return error object for an invalid email', () => {
    const control = new FormControl('invalid-email');
    const result = customEmailValidator(control);
    expect(result).toEqual({ customEmail: true });
  });

  it('should return error object for an invalid email with @', () => {
    const control = new FormControl('invalid@email');
    const result = customEmailValidator(control);
    expect(result).toEqual({ customEmail: true });
  });

  it('should return null for an empty email string', () => {
    const control = new FormControl('');
    const result = customEmailValidator(control);
    expect(result).toBeNull();
  });

  it('should return null for a null email value', () => {
    const control = new FormControl(null);
    const result = customEmailValidator(control);
    expect(result).toBeNull();
  });
});
