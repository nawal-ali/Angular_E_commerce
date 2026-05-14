import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ProductsComponent } from './pages/products/products.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SingleProductComponent } from './pages/single-product/single-product.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';

export const routes: Routes = [
    {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent , title : 'Home'},
      { path: 'product', component: ProductsComponent , title : 'Products'},
      { path: 'contact', component: ContactComponent , title : 'Contact'},
      { path: 'about', component: AboutComponent , title : 'About'},
      { path: 'whishlist', component: WishlistComponent , title : 'Wishlist'},
      { path: 'checkout', component: CheckoutComponent , title : 'Checkout'},
      { path: 'productDetails/:id', component: SingleProductComponent , title : 'Single Product Component'},
      {path:'profile/:id', component:ProfileComponent},
      {path:'cart', component:CartComponent , title : 'Cart'},

      { path: '', redirectTo: 'home', pathMatch: 'full' },
      
    ]
  },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },


  { path: '**', redirectTo: 'home' }
];

 