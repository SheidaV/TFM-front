import { formatDate } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Users } from '../../../core/services/users';
import { getErrorMessage } from '../../../core/utils/api-error';

type RegisterFormModel = {
  name: FormControl<string>;
  surname: FormControl<string>;
  alias: FormControl<string>;
  birth_date: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  name: FormControl<string>;
  surname: FormControl<string>;
  alias: FormControl<string>;
  birth_date: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  registerForm: FormGroup<RegisterFormModel>;

  isValidForm = signal<boolean | null>(null);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(
    private formBuilder: FormBuilder,
    private users: Users,
    private router: Router,
  ) {
    this.name = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    });

    this.surname = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    });

    this.alias = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    });

    this.birth_date = new FormControl(formatDate(new Date(), 'yyy-MM-dd', 'en'), {
      nonNullable: true,
      validators: [Validators.required],
    });

    this.email = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    });

    this.password = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(16)],
    });

    this.registerForm = this.formBuilder.group({
      name: this.name,
      surname: this.surname,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password,
    });
  }

  async register(): Promise<void> {
    this.isValidForm.set(false);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.registerForm.invalid) {
      return;
    }

    this.isValidForm.set(true);

    try {
      await this.users.register(this.registerForm.getRawValue());
      this.successMessage.set('Cuenta creada correctamente. Redirigiendo al inicio de sesión...');
      this.registerForm.reset();
      await new Promise((resolve) => setTimeout(resolve, 1500));
      this.router.navigateByUrl('/login');
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    }
  }
}
