import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FlashSaleComponent } from '../../features/flash-sale/flash-sale.component';

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  mainImg: string;
  categoryName?: string;
  rate?: number;
}

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FlashSaleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  // ---- Carousel ----
  products: Product[] = [];
  carouselIndex = 0;
  carouselInterval: any;
  readonly VISIBLE = 4; // cards visible at once

  // ---- FAQ ----
  faqs: FaqItem[] = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3–5 business days. Express shipping (1–2 days) is available at checkout for an additional fee.',
      open: false
    },
    {
      question: 'Can I return or exchange an item?',
      answer: 'Yes! We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging. Exchanges are free on your first order.',
      open: false
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order ships you\'ll receive a tracking link by email. You can also check the "Previous Orders" section in your profile at any time.',
      open: false
    },
    {
      question: 'Do you ship internationally?',
      answer: 'We currently ship to 40+ countries. Shipping costs and delivery times vary by destination and are shown at checkout.',
      open: false
    },
    {
      question: 'Are my payment details secure?',
      answer: 'Absolutely. All payments are processed through Stripe with 256-bit SSL encryption. We never store your full card details.',
      open: false
    }
  ];

  // ---- Features ----
  features = [
    { icon: 'fa-truck-fast',      title: 'Free Shipping',       desc: 'On all orders over $50. Fast, reliable delivery right to your door.' },
    { icon: 'fa-shield-halved',   title: 'Secure Payments',     desc: '256-bit SSL encryption on every transaction. Your data is always safe.' },
    { icon: 'fa-arrow-rotate-left', title: '30-Day Returns',    desc: 'Not happy? Return anything within 30 days for a full, hassle-free refund.' },
    { icon: 'fa-headset',         title: '24/7 Support',        desc: 'Our team is always available. Chat, email, or call — we\'ve got you.' }
  ];

  // ---- Banners ----
  banners = [
    {
      tag: 'New Collection',
      title: 'Spring / Summer 2026',
      subtitle: 'Fresh styles for the new season — bold prints, soft textures, standout pieces.',
      cta: 'Shop Collection',
      color: 'banner-warm',
      icon: 'fa-shirt'
    },
    {
      tag: 'Limited Deal',
      title: 'Up to 50% Off',
      subtitle: 'Flash prices on hundreds of items. Stock is limited — don\'t miss out.',
      cta: 'Grab the Deal',
      color: 'banner-red',
      icon: 'fa-tags'
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Product[]>('http://shopbag.runasp.net/api/Admin/Products').subscribe({
      next: (data) => {
        // Shuffle and take 12 random products for the carousel
        this.products = data
          .sort(() => Math.random() - 0.5)
          .slice(0, 12);
        this.startCarousel();
      },
      error: () => {}
    });
  }

  ngAfterViewInit(): void {
    this.observeSections();
  }

  ngOnDestroy(): void {
    clearInterval(this.carouselInterval);
  }

  // ---- Carousel logic ----
  get maxIndex(): number {
    return Math.max(0, this.products.length - this.VISIBLE);
  }

  startCarousel(): void {
    this.carouselInterval = setInterval(() => this.nextSlide(), 3500);
  }

  nextSlide(): void {
    this.carouselIndex = this.carouselIndex >= this.maxIndex ? 0 : this.carouselIndex + 1;
  }

  prevSlide(): void {
    this.carouselIndex = this.carouselIndex <= 0 ? this.maxIndex : this.carouselIndex - 1;
  }

  goToSlide(index: number): void {
    this.carouselIndex = Math.min(index, this.maxIndex);
  }

  get carouselDots(): number[] {
    return Array.from({ length: this.maxIndex + 1 }, (_, i) => i);
  }

  getDiscountedPrice(price: number, discount: number): number {
    return +(price - price * discount / 100).toFixed(2);
  }

  // ---- FAQ ----
  toggleFaq(index: number): void {
    this.faqs = this.faqs.map((faq, i) => ({
      ...faq,
      open: i === index ? !faq.open : false
    }));
  }

  // ---- Scroll-into-view animations via IntersectionObserver ----
  private observer!: IntersectionObserver;

  observeSections(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            this.observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach(el => this.observer.observe(el));
  }
}