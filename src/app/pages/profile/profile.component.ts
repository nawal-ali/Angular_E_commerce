import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { ToasterService } from '../../shared/components/toaster/toaster.service';

declare const bootstrap: any;

type ProfileTab = 'personal' | 'address' | 'orders' | 'password';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId = '';
  isLoading = true;
  isSaving = false;
  selectedTab: ProfileTab = 'personal';

  // Flat model — mirrors the API object exactly
  user = {
    name: '',
    email: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  previousOrders: { id: number; orderId: string; date: string; total: string; status: string; transactionType: string; transactionStatus: string; items: any[] }[] = [];
  isLoadingOrders = false;
  ordersLoaded = false;
  selectedOrder: typeof this.previousOrders[0] | null = null;
  isLoadingItems = false;

  @ViewChild('orderModal') orderModalRef!: ElementRef;
  private modalInstance: any;

  menuItems: { key: ProfileTab; label: string; icon: string }[] = [
    { key: 'personal', label: 'Personal Info',   icon: 'fa-user'         },
    { key: 'address',  label: 'Address Info',    icon: 'fa-location-dot' },
    { key: 'orders',   label: 'Previous Orders', icon: 'fa-box-open'     },
    { key: 'password', label: 'Change Password', icon: 'fa-key'          }
  ];

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.userId) {
      this.toaster.show('Profile ID not found.', 'error');
      this.isLoading = false;
      return;
    }

    this.profileService.getProfile(this.userId).subscribe({
      next: (profile: any) => {
        this.user = {
          name:        profile.name        || '',
          email:       profile.email       || profile.userName || '',
          phoneNumber: profile.phoneNumber || profile.phone    || '',
          street:      profile.street      || '',
          city:        profile.city        || '',
          state:       profile.state       || '',
          zipCode:     profile.zipCode     || profile.zip      || ''
        };
        this.isLoading = false;
      },
      error: () => {
        this.toaster.show('Could not load profile data.', 'error');
        this.isLoading = false;
      }
    });
  }

  selectTab(tab: ProfileTab): void {
    this.selectedTab = tab;
    if (tab === 'orders') this.loadOrders();
  }

  loadOrders(): void {
    if (this.ordersLoaded) return;
    this.isLoadingOrders = true;
    this.profileService.getOrders().subscribe({
      next: (res) => {
        this.previousOrders = (res.orders || []).map(o => ({
          id: o.id,
          orderId: `#${o.id}`,
          date: o.orderDate,
          total: `$${(o.totalPrice as number).toFixed(2)}`,
          status: o.orderStatus,
          transactionType: o.transactionType,
          transactionStatus: o.transactionStatus,
          items: o.items || []
        }));
        this.ordersLoaded = true;
        this.isLoadingOrders = false;
      },
      error: () => {
        this.toaster.show('Could not load orders.', 'error');
        this.isLoadingOrders = false;
      }
    });
  }

  openOrderModal(order: typeof this.previousOrders[0]): void {
    this.selectedOrder = { ...order, items: [] };
    this.isLoadingItems = true;

    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(this.orderModalRef.nativeElement);
    }
    this.modalInstance.show();

    this.profileService.getOrderById(order.id).subscribe({
      next: (res: any) => {
        if (this.selectedOrder) {
          this.selectedOrder.items = res.items || res.orderItems || [];
        }
        this.isLoadingItems = false;
      },
      error: () => {
        this.toaster.show('Could not load order items.', 'error');
        this.isLoadingItems = false;
      }
    });
  }

  // One method — always sends the full flat object the API expects
  saveProfile(): void {
    if (!this.userId) {
      this.toaster.show('Unable to update profile — missing ID.', 'error');
      return;
    }
    if (!this.user.name.trim()) {
      this.toaster.show('Name is required.', 'error');
      return;
    }
    if (!this.user.email.trim()) {
      this.toaster.show('Email is required.', 'error');
      return;
    }

    this.isSaving = true;

    const payload = {
      name:        this.user.name.trim(),
      email:       this.user.email.trim(),
      phoneNumber: this.user.phoneNumber.trim(),
      street:      this.user.street.trim(),
      city:        this.user.city.trim(),
      state:       this.user.state.trim(),
      zipCode:     this.user.zipCode.trim()
    };

    this.profileService.updateProfile(payload, this.userId).subscribe({
      next: () => {
        this.toaster.show('Profile updated successfully.', 'success');
        this.isSaving = false;
      },
      error: () => {
        this.toaster.show('Update failed. Please try again.', 'error');
        this.isSaving = false;
      }
    });
  }

  changePassword(): void {
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword) {
      this.toaster.show('Please fill in all password fields.', 'error');
      return;
    }
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toaster.show('Passwords do not match.', 'error');
      return;
    }
    if (this.passwordData.newPassword.length < 8) {
      this.toaster.show('New password must be at least 8 characters.', 'error');
      return;
    }
    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.toaster.show('Password changed successfully.', 'success');
  }

  // Generates initials for the avatar circle (e.g. "Ahmed Sami" → "AS")
  getInitials(): string {
    const parts = this.user.name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts[0]?.length) return parts[0][0].toUpperCase();
    return '?';
  }
}