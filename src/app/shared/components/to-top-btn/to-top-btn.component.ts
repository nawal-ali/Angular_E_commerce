import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-to-top-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './to-top-btn.component.html',
  styleUrl: './to-top-btn.component.css'
})
export class ToTopBtnComponent {
  visible = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
