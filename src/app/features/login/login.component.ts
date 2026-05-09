import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToasterService } from '../../shared/components/toaster/toaster.service';
import { GlobalService } from '../../core/services/global.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  apiError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toaster: ToasterService,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the login form with validation
   */
  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  /**
   * Check if a field is invalid and touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Handle form submission and login
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.apiError = '';

    const credentials = {
      emailOrUserName: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
      rememberMe: this.loginForm.get('rememberMe')?.value
    };

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        // Store the token in local storage
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }

        // Store user info if available
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        // Store remember me preference
        if (this.loginForm.get('rememberMe')?.value) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', credentials.emailOrUserName);
        }

        // Show success and redirect
        this.toaster.show('Login successful!', 'success');
        console.log('Login successful:', response);
        this.globalService.isLoggedIn();
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        this.isLoading = false;

        // Handle different error scenarios
        if (error.status === 401) {
          this.apiError = 'Invalid email or password';
        } else if (error.status === 400) {
          this.apiError = error.error?.message || 'Invalid credentials';
        } else if (error.status === 0) {
          this.apiError = 'Unable to reach the server. Please check your connection.';
        } else {
          this.apiError = error.error?.message || 'Login failed. Please try again.';
        }

        this.toaster.show(this.apiError, 'error');
        console.error('Login error:', error);
      }
    });
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
