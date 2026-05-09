import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-single-product',
  standalone :true,
   imports: [CommonModule, RouterLink],
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.css'
})
export class SingleProductComponent implements OnInit {
 
  product: any; 

  constructor(private route: ActivatedRoute, private http: HttpClient) {}
   
  selectedSize: string = 'M'; 
  selectedColor: string = '#042433';  
  
  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL'];
  colors: string[] = ['#26e0b3', '#2bb6e6', '#042433'];


  selectSize(size: string) {
    this.selectedSize = size;
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getProductDetails(id);
    }
  }

  getProductDetails(id: string) {
    this.http.get<any>(`http://shopbag.runasp.net/api/Admin/Products/${id}`)
      .subscribe({
        next: (data) => {
          this.product = data;
          console.log('Product Details:', this.product);
        },
        error: (err) => console.error('Error fetching product:', err)
      });
  }
}