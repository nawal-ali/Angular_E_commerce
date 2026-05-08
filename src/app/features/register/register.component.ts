import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToasterService } from '../../shared/components/toaster/toaster.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  apiError = '';
  registrationSuccess = false;
  showResend = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toaster: ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{4,10}$')]]
    });
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.apiError = 'Passwords do not match.';
      this.toaster.show(this.apiError, 'error');
      return;
    }

    this.isLoading = true;
    this.apiError = '';

    const payload = {
      name: this.registerForm.value.name,
      userName: this.registerForm.value.userName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword,
      street: this.registerForm.value.street,
      city: this.registerForm.value.city,
      state: this.registerForm.value.state,
      zipCode: this.registerForm.value.zipCode
    };

    this.authService.register(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.registrationSuccess = true;
        this.showResend = true;

        this.toaster.show(response.msg, 'success');

        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }

        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        setTimeout(() => this.router.navigate(['/']), 3000);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.apiError = error.error?.message || 'Registration failed. Please try again.';
        this.toaster.show(this.apiError, 'error');
      }
    });
  }

  resendConfirmation(): void {
    const email = this.registerForm.get('email')?.value;

    if (!email) {
      this.toaster.show('Enter your email to resend confirmation.', 'info');
      return;
    }

    this.authService.ResendEmailConfirmation(email).subscribe({
      next: () => {
        this.toaster.show('Confirmation email resent. Check your inbox.', 'success');
      },
      error: (error: any) => {
        const message = error.error?.message || 'Unable to resend confirmation email.';
        this.toaster.show(message, 'error');
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
