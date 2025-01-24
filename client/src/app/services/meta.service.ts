import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Product } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  updateProductMeta(product: Product): void {
    // Sayfa başlığını güncelle
    this.title.setTitle(`${product.name} - E-Ticaret`);

    // Meta etiketlerini güncelle
    const description = product.description.substring(0, 160);
    const image = product.mainImage;
    const url = window.location.href;

    // Open Graph meta etiketleri
    this.meta.updateTag({ property: 'og:title', content: product.name });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'product' });
    this.meta.updateTag({ property: 'og:price:amount', content: product.price.toString() });
    this.meta.updateTag({ property: 'og:price:currency', content: 'TRY' });

    // Twitter meta etiketleri
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: product.name });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }

  resetMeta(): void {
    // Varsayılan meta etiketlerine geri dön
    this.title.setTitle('E-Ticaret - Online Alışveriş');
    
    const defaultDescription = 'En kaliteli ürünler, en uygun fiyatlarla';
    const defaultImage = '/assets/images/logo.png';
    const defaultUrl = window.location.origin;

    this.meta.updateTag({ property: 'og:title', content: 'E-Ticaret - Online Alışveriş' });
    this.meta.updateTag({ property: 'og:description', content: defaultDescription });
    this.meta.updateTag({ property: 'og:image', content: defaultImage });
    this.meta.updateTag({ property: 'og:url', content: defaultUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'E-Ticaret - Online Alışveriş' });
    this.meta.updateTag({ name: 'twitter:description', content: defaultDescription });
    this.meta.updateTag({ name: 'twitter:image', content: defaultImage });
  }
} 