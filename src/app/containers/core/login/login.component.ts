import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { Store } from '@ngrx/store';
import { selectAuthError, selectAuthLoading } from '../../../store/auth/auth.selectors';
import { maxLength, maxLengthPassword, minLength } from '../../../utils/constants/user-credentials.const';
import { userLogin } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-login',
  imports: [NgOptimizedImage, Card, FloatLabel, InputText, ReactiveFormsModule, Password, Button, NgTemplateOutlet, Message],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  form!: FormGroup;
  readonly minLength = minLength;
  readonly maxLengthUsername = maxLength;
  readonly maxLengthPassword = maxLengthPassword;

  protected readonly authLoading = this.store.selectSignal(selectAuthLoading);
  protected readonly authError = this.store.selectSignal(selectAuthError);

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
    });

    effect(() => {
      this.form.setErrors({ unauthenticated: !!this.authError() });
    });
  }

  onSubmit(): void {
    this.store.dispatch(userLogin(this.form.getRawValue()));
  }
}
