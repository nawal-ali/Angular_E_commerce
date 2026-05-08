import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToasterService } from '../../shared/components/toaster/toaster.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="confirm-container">
      <div class="confirm-card">
        <h2>Email Confirmation</h2>
        <p *ngIf="isLoading">Confirming your email, please wait...</p>
        <p *ngIf="!isLoading && success" class="success-text">Your email is confirmed. You may now <a routerLink="/login">sign in</a>.</p>
        <p *ngIf="!isLoading && error" class="error-text">{{ error }}</p>
        <button class="btn btn-outline-primary" routerLink="/login" *ngIf="!isLoading && success">Go to Login</button>
      </div>
    </div>
  `,
  styles: [
    `
      .confirm-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: linear-gradient(135deg, #fff8f6 0%, #f5e6e0 100%);
      }

      .confirm-card {
        width: 100%;
        max-width: 520px;
        padding: 2.5rem;
        border-radius: 1rem;
        background: #ffffff;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.08);
        text-align: center;
      }

      .confirm-card h2 {
        margin-bottom: 1rem;
        color: #db3022;
      }

      .success-text {
        color: #2e7d32;
        margin-bottom: 1.5rem;
      }

      .error-text {
        color: #d32f2f;
        margin-bottom: 1.5rem;
      }
    `
  ]
})
export class ConfirmEmailComponent implements OnInit {
  public isLoading = true;
  public success = false;
  public error = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const id = this.route.snapshot.queryParamMap.get('id');

    if (!token || !id) {
      this.completeWithError('Missing confirmation connection details.');
      return;
    }

    this.authService.ConfirmEmail(token, Number(id)).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = true;
        this.toasterService.show('Email confirmed successfully. You can now log in.', 'success');
      },
      error: (error) => {
        this.completeWithError(error.error?.message || 'The email confirmation link is invalid or expired.');
      }
    });
  }

  private completeWithError(message: string): void {
    this.isLoading = false;
    this.success = false;
    this.error = message;
    this.toasterService.show(message, 'error');
  }
}
