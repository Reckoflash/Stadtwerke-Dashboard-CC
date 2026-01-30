import { Component, ChangeDetectorRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { take } from 'rxjs';

import { Product } from '../../../../data/models';
import { ProductsService } from '../../../../data/products.service';

@Component({
  selector: 'app-products-page',
  imports: [NgFor, NgIf],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  loadError: string | null = null;

  constructor(
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef,
  ) {
    this.productsService
      .getProducts()
      .pipe(take(1))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.selectedProduct = products[0] ?? null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load products:', err);
          this.loadError = 'Produktdaten konnten nicht geladen werden (siehe Konsole).';
          this.cdr.detectChanges();
        },
      });
  }

  selectProduct(p: Product) {
    this.selectedProduct = p;
    this.cdr.detectChanges();
    console.log('clicked product', p.id);
  }

  isActive(p: Product) {
    return p.status === 'Aktiv';
  }
}
