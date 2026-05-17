import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from './shared/components/toaster/toaster.component';
import { ToTopBtnComponent } from './shared/components/to-top-btn/to-top-btn.component';
import { GlobalService } from './core/services/global.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterComponent, ToTopBtnComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private globalService: GlobalService){}
  title = 'e-commerce';
  // token= localStorage.getItem('authToken');
  // if(token){
  //   this.globalService.isLoggedIn();
  // }
}
