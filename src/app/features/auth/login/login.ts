import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { getErrorMessage } from '../../../core/utils/api-error';

type LoginFormModel = {
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  email: FormControl<string>;
  password: FormControl<string>;
  loginForm: FormGroup<LoginFormModel>;

  isValidForm = signal<boolean | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(
    private formBuilder: FormBuilder,
    private auth: Auth,
    private router: Router,
  ) {
    this.email = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    });

    this.password = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(16)],
    });

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  async login(): Promise<void> {
    this.isValidForm.set(false);
    this.errorMessage.set(null);

    if (this.loginForm.invalid) {
      return;
    }

    this.isValidForm.set(true);

    try {
      await this.auth.login(this.loginForm.getRawValue());
      this.router.navigateByUrl('/dashboard');
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    }
  }
}
