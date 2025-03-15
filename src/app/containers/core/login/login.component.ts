import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-login',
  imports: [NgOptimizedImage, Card, FloatLabel, InputText, ReactiveFormsModule, Password, Button, NgTemplateOutlet, Message],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class LoginComponent implements OnInit {
  form!: FormGroup;
  minLength = 6;
  maxLengthUsername = 60;
  maxLengthPassword = 100;

  readonly loading = signal(false);

  readonly fb = inject(FormBuilder);
  // readonly store = inject(Store);

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

    // @Todo Implement Select from Auth Error and this.form.setErrors({unauthenticated: true})
  }

  onSubmit(): void {
    this.loading.set(true);
    // @Todo Implement Action Login
  }
}
