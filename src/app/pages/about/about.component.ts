import { Component } from '@angular/core';
import {  OnInit } from '@angular/core';
import * as AOS from 'aos' ;
import { RouterLink } from "@angular/router"; 
@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {

  ngOnInit() {
    AOS.init({
      duration: 1000,
      once: true,      
      offset: 100    
    });
  }
}
 