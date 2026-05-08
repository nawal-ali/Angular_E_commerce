import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ConfirmEmailComponent } from './features/confirm-email/confirm-email.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
];
