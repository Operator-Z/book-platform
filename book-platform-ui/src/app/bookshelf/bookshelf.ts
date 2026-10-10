import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-bookshelf',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookshelf.html'
})
export class BookshelfComponent implements OnInit {
  shelfItems: any[] = [];
  selectedFilter: string = 'ALL';
  loading: boolean = true;
  statusMessage: string = '';

  statuses = [
    { value: 'TO_BE_READ', label: 'To-Be Read', badge: 'bg-info text-dark' },
    { value: 'READ', label: 'Read', badge: 'bg-success' },
    { value: 'WANT_TO_REREAD', label: 'Want to Re-Read', badge: 'bg-warning text-dark' },
    { value: 'DNF', label: 'DNF (Did Not Finish)', badge: 'bg-danger' }
  ];

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBookshelf();
  }

  loadBookshelf() {
    this.loading = true;
    this.apiService.getBookshelf().subscribe({
      next: (data: any[]) => {
        this.shelfItems = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading bookshelf', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredItems() {
    if (this.selectedFilter === 'ALL') return this.shelfItems;
    return this.shelfItems.filter(item => item.status === this.selectedFilter);
  }

  updateStatus(item: any, newStatus: string) {
    this.apiService.updateBookshelfStatus(item.book.id, newStatus).subscribe({
      next: () => {
        item.status = newStatus;
        this.statusMessage = `Updated "${item.book.name}" status to ${this.getStatusLabel(newStatus)}!`;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.statusMessage = '';
          this.cdr.detectChanges();
        }, 3500);
      },
      error: (err: any) => {
        console.error('Failed to update status', err);
      }
    });
  }

  getStatusLabel(statusValue: string): string {
    const found = this.statuses.find(s => s.value === statusValue);
    return found ? found.label : statusValue;
  }

  getStatusBadge(statusValue: string): string {
    const found = this.statuses.find(s => s.value === statusValue);
    return found ? found.badge : 'bg-secondary';
  }

  getCount(statusValue: string): number {
    if (statusValue === 'ALL') return this.shelfItems.length;
    return this.shelfItems.filter(i => i.status === statusValue).length;
  }
}