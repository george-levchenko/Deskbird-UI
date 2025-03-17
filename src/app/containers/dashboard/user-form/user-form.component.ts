import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { User } from '../../../models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { NgTemplateOutlet } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import { maxLength, minLength, maxLengthPassword } from '../../../utils/constants/user-credentials.const';
import { customEmailValidator } from '../../../utils/validators/custom-email.validator';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FloatLabel, Button, InputText, NgTemplateOutlet, Checkbox, Password],
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;
  readonly minLength = minLength;
  readonly maxLength = maxLength;
  readonly maxLengthPassword = maxLengthPassword;

  readonly selectedUser = input<User | null>();
  readonly submitUser = output<User>();
  readonly closeModal = output<void>();

  get usernameField() {
    return this.form.get('username');
  }

  get passwordField() {
    return this.form.get('password');
  }

  get nameField() {
    return this.form.get('name');
  }

  get emailField() {
    return this.form.get('email');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: [
        this.selectedUser()?.username || '',
        [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)],
      ],
      password: [
        '',
        this.selectedUser()
          ? [Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]
          : [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)], // Required only for creation
      ],
      name: [this.selectedUser()?.name || '', Validators.maxLength(this.maxLength)],
      email: [
        this.selectedUser()?.email || '',
        [Validators.maxLength(this.maxLength), customEmailValidator], // Validators.email accepts wrong values a@b
      ],
      isAdmin: [this.selectedUser()?.isAdmin || false],
    });
  }

  onSubmit(): void {
    // Add id only in case of update
    const payload = { ...this.form.getRawValue(), id: this.selectedUser()?.id };
    // If password didn't change, do not send anything
    if (!this.form.getRawValue().password) {
      delete payload.password;
    }
    this.submitUser.emit(payload);
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
