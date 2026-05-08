import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ProductsComponent } from './pages/products/products.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent , title : 'Home'},
      { path: 'product', component: ProductsComponent , title : 'Products'},
      { path: 'contact', component: ContactComponent , title : 'Contact'},
      { path: 'about', component: AboutComponent , title : 'About'},


      { path: '', redirectTo: 'home', pathMatch: 'full' },

      
    ]
  },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path:'profile/:id', component:ProfileComponent},


  { path: '**', redirectTo: 'home' }
];

