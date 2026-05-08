import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { ToasterService } from '../../shared/components/toaster/toaster.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public globalService: GlobalService, private toaster: ToasterService){}


  handleLogout(){
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.globalService.isLoggedIn();
    this.toaster.show('Logged out successfully', 'success');
  }
}
