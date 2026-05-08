import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToasterService, ToastMessage } from './toaster.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toasts.length > 0">
      <div class="toast-card" *ngFor="let toast of toasts" [ngClass]="toast.type">
        <div class="toast-body">
          <span class="toast-icon">{{ getIcon(toast.type) }}</span>
          <div class="toast-text">
            <p class="toast-title">{{ toast.type | titlecase }}</p>
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button class="toast-close" type="button" (click)="dismissToast(toast.id)">×</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1200;
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
        max-width: 360px;
      }

      .toast-card {
        border-radius: 14px;
        padding: 0.85rem 1rem;
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.12);
        color: #212121;
        background: #ffffff;
        animation: toastIn 0.25s ease-out;
      }

      .toast-card.success {
        border-left: 4px solid #2e7d32;
      }

      .toast-card.error {
        border-left: 4px solid #d32f2f;
      }

      .toast-card.info {
        border-left: 4px solid #1976d2;
      }

      .toast-body {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .toast-icon {
        margin-top: 3px;
        font-size: 1.2rem;
      }

      .toast-text {
        flex: 1;
      }

      .toast-title {
        margin: 0;
        font-weight: 700;
        font-size: 0.95rem;
      }

      .toast-message {
        margin: 4px 0 0;
        font-size: 0.87rem;
        color: #4a4a4a;
      }

      .toast-close {
        border: none;
        background: transparent;
        color: #4a4a4a;
        font-size: 1.2rem;
        line-height: 1;
        cursor: pointer;
        padding: 0;
      }

      @keyframes toastIn {
        from {
          opacity: 0;
          transform: translateX(12px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `
  ]
})
export class ToasterComponent implements OnInit, OnDestroy {
  public toasts: ToastMessage[] = [];
  private subscription?: Subscription;

  constructor(public toasterService: ToasterService) {}

  ngOnInit(): void {
    this.subscription = this.toasterService.messages$.subscribe((messages) => {
      this.toasts = messages;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getIcon(type: 'success' | 'error' | 'info'): string {
    switch (type) {
      case 'error':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  }

  dismissToast(id: number): void {
    this.toasterService.dismiss(id);
  }
}
