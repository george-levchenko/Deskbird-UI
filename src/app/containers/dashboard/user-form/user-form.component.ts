import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output } from '@angular/core';
import { User } from '../../../models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { NgTemplateOutlet } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import { maxLengthPassword, maxLengthUsername, minLength } from '../../../utils/constants/user-credentials.const';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FloatLabel, Password, Button, InputText, NgTemplateOutlet, Checkbox],
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;
  readonly minLength = minLength;
  readonly maxLengthUsername = maxLengthUsername;
  readonly maxLengthPassword = maxLengthPassword;

  readonly selectedUser = input<User | null>();
  readonly submitUser = output<User>();
  readonly closeModal = output<void>();

  readonly selectedUserEffect = effect(() => {
    this.form.patchValue({
      username: this.selectedUser()?.username || '',
      password: this.selectedUser()?.password || '',
      isAdmin: this.selectedUser()?.isAdmin || false,
    });
    this.form.markAsPristine();
  });

  get usernameField() {
    return this.form.get('username');
  }

  get passwordField() {
    return this.form.get('password');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLengthUsername)]],
      password: ['', [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLengthPassword)]],
      isAdmin: [false],
    });
  }

  onSubmit(): void {
    this.submitUser.emit(this.form.getRawValue());
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
