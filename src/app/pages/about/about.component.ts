import { Component } from '@angular/core';
import {  OnInit } from '@angular/core';
import * as AOS from 'aos' ; 
@Component({
  selector: 'app-about',
  imports: [],
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
 