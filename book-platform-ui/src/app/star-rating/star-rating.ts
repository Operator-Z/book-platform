import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="text-warning me-1" *ngFor="let star of stars">
      <i [class]="star"></i>
    </span>
    <small class="text-muted fw-semibold">{{ rating.toFixed(1) }} / 5.0</small>
  `
})
export class StarRatingComponent implements OnChanges {
  @Input() rating: number = 0;
  stars: string[] = [];

  ngOnChanges() {
    this.updateStars();
  }

  ngOnInit() {
    this.updateStars();
  }

  private updateStars() {
    this.stars = [];
    for (let i = 1; i <= 5; i++) {
      if (this.rating >= i) {
        this.stars.push('bi bi-star-fill');
      } else if (this.rating >= i - 0.5) {
        this.stars.push('bi bi-star-half');
      } else {
        this.stars.push('bi bi-star');
      }
    }
  }
}