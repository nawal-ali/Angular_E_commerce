import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { ToasterService } from '../../shared/components/toaster/toaster.service';

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
<<<<<<< HEAD

  selectedTab: ProfileTab = 'personal';

  user = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
=======
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
>>>>>>> 908029f71f57c24858f14ed02f2eeb35a088aa2f
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  previousOrders = [
    { orderId: '#2301', date: '2026-04-18', total: '$135.00', status: 'Delivered' },
<<<<<<< HEAD
    { orderId: '#2287', date: '2026-03-29', total: '$59.50', status: 'Shipped' },
    { orderId: '#2274', date: '2026-03-12', total: '$219.99', status: 'Delivered' }
  ];

  menuItems: { key: ProfileTab; label: string; icon: string }[] = [
    { key: 'personal', label: 'Personal Info', icon: 'fa-user' },
    { key: 'address', label: 'Address Info', icon: 'fa-location-dot' },
    { key: 'orders', label: 'Previous Orders', icon: 'fa-box-open' },
    { key: 'password', label: 'Change Password', icon: 'fa-key' }
=======
    { orderId: '#2287', date: '2026-03-29', total: '$59.50',  status: 'Shipped'   },
    { orderId: '#2274', date: '2026-03-12', total: '$219.99', status: 'Pending'   }
  ];

  menuItems: { key: ProfileTab; label: string; icon: string }[] = [
    { key: 'personal', label: 'Personal Info',   icon: 'fa-user'         },
    { key: 'address',  label: 'Address Info',    icon: 'fa-location-dot' },
    { key: 'orders',   label: 'Previous Orders', icon: 'fa-box-open'     },
    { key: 'password', label: 'Change Password', icon: 'fa-key'          }
>>>>>>> 908029f71f57c24858f14ed02f2eeb35a088aa2f
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
<<<<<<< HEAD
          firstName: profile.firstName || profile.name || '',
          lastName: profile.lastName || '',
          email: profile.email || profile.userName || '',
          phone: profile.phoneNumber || profile.phone || '',
          address: {
            street: profile.address?.street || profile.street || '',
            city: profile.address?.city || profile.city || '',
            state: profile.address?.state || profile.state || '',
            zip: profile.address?.zip || profile.zip || '',
            country: profile.address?.country || profile.country || ''
          }
=======
          name:        profile.name        || '',
          email:       profile.email       || profile.userName || '',
          phoneNumber: profile.phoneNumber || profile.phone    || '',
          street:      profile.street      || '',
          city:        profile.city        || '',
          state:       profile.state       || '',
          zipCode:     profile.zipCode     || profile.zip      || ''
>>>>>>> 908029f71f57c24858f14ed02f2eeb35a088aa2f
        };
        this.isLoading = false;
      },
      error: () => {
        this.toaster.show('Could not load profile data.', 'error');
        this.isLoading = false;
      }
    });
  }

<<<<<<< HEAD
  selectTab(tab: 'personal' | 'address' | 'orders' | 'password'): void {
    this.selectedTab = tab;
  }

  saveProfile(): void {
    if (!this.userId) {
      this.toaster.show('Unable to update profile - missing ID.', 'error');
=======
  selectTab(tab: ProfileTab): void {
    this.selectedTab = tab;
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
>>>>>>> 908029f71f57c24858f14ed02f2eeb35a088aa2f
      return;
    }

    this.isSaving = true;
<<<<<<< HEAD
    const payload = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phoneNumber: this.user.phone,
      address: {
        street: this.user.address.street,
        city: this.user.address.city,
        state: this.user.address.state,
        zip: this.user.address.zip,
        country: this.user.address.country
      }
=======

    const payload = {
      name:        this.user.name.trim(),
      email:       this.user.email.trim(),
      phoneNumber: this.user.phoneNumber.trim(),
      street:      this.user.street.trim(),
      city:        this.user.city.trim(),
      state:       this.user.state.trim(),
      zipCode:     this.user.zipCode.trim()
>>>>>>> 908029f71f57c24858f14ed02f2eeb35a088aa2f
    };

    this.profileService.updateProfile(payload, this.userId).subscribe({
      next: () => {
        this.toaster.show('Profile updated successfully.', 'success');
        this.isSaving = false;
      },
      error: () => {
<<<<<<< HEAD
        this.toaster.show('Profile update failed. Please try again.', 'error');
=======
        this.toaster.show('Update failed. Please try again.', 'error');
>>>>>>> 908029f71f57c24858f14ed02f2eeb35a088aa2f
        this.isSaving = false;
      }
    });
  }

  changePassword(): void {
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword) {
<<<<<<< HEAD
      this.toaster.show('Please fill in both password fields.', 'error');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toaster.show('New password and confirm password do not match.', 'error');
      return;
    }

    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.toaster.show('Password changed successfully.', 'success');
  }
}
=======
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
>>>>>>> 908029f71f57c24858f14ed02f2eeb35a088aa2f
