import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from '../star-rating/star-rating';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  books: any[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  statusMessage: string = '';
  errorMessage: string = '';

  // Review & 0.5 Rating Modal State
  selectedBook: any = null;
  bookReviews: any[] = [];
  newRating: number = 4.5;
  newReviewContent: string = '';
  reviewFeedback: string = '';
  ratingOptions: number[] = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.loading = true;
    this.errorMessage = '';
    this.apiService.getBooks().subscribe({
      next: (data: any[]) => {
        this.books = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to load catalog:', err);
        this.loading = false;
        this.errorMessage = 'Could not connect to Spring Boot at http://localhost:8080/api/books.';
        this.cdr.detectChanges();
      }
    });
  }

  get filteredBooks() {
    if (!this.searchQuery.trim()) return this.books;
    const q = this.searchQuery.toLowerCase();
    return this.books.filter(
      b => b.name?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q)
    );
  }

  addToShelf(book: any, status: string) {
    this.apiService.addToBookshelf(book.id, status).subscribe({
      next: () => {
        this.statusMessage = `"${book.name}" added to your Bookshelf as ${status}!`;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.statusMessage = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err: any) => {
        this.statusMessage = err.error || 'Book is already on your bookshelf!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.statusMessage = '';
          this.cdr.detectChanges();
        }, 4000);
      }
    });
  }

  openReviewsModal(book: any) {
    this.selectedBook = book;
    this.bookReviews = [];
    this.newRating = 4.5;
    this.newReviewContent = '';
    this.reviewFeedback = '';
    this.loadReviewsForBook(book);
  }

  closeReviewsModal() {
    this.selectedBook = null;
    this.cdr.detectChanges();
  }

  loadReviewsForBook(book: any) {
    this.apiService.getBookReviews(book.id).subscribe({
      next: (reviews: any[]) => {
        this.bookReviews = reviews || [];
        if (this.bookReviews.length > 0) {
          const sum = this.bookReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
          book.averageRating = Math.round((sum / this.bookReviews.length) * 2) / 2;
        } else {
          book.averageRating = 0;
        }
        this.cdr.detectChanges();
      }
    });
  }

  submitReview() {
    if (!this.selectedBook || !this.newReviewContent.trim()) return;

    this.apiService.addReview(this.selectedBook.id, this.newRating, this.newReviewContent).subscribe({
      next: () => {
        this.reviewFeedback = 'Review & 0.5-increment rating posted!';
        this.newReviewContent = '';
        this.loadReviewsForBook(this.selectedBook);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.reviewFeedback = err.error || 'Failed to submit review.';
        this.cdr.detectChanges();
      }
    });
  }
}