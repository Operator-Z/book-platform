import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.html'
})
export class BookListComponent implements OnInit {
  bookLists: any[] = [];
  catalogBooks: any[] = [];
  newListName: string = '';
  selectedBookByList: { [listId: number]: number } = {};
  loading: boolean = true;
  feedbackMessage: string = '';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.apiService.getBookLists().subscribe({
      next: (lists: any[]) => {
        this.bookLists = lists || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading booklists', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.apiService.getBooks().subscribe({
      next: (books: any[]) => {
        this.catalogBooks = books || [];
        this.cdr.detectChanges();
      }
    });
  }

  createList(presetName?: string) {
    const nameToCreate = presetName ? presetName : this.newListName.trim();
    if (!nameToCreate) return;

    this.apiService.createBookList(nameToCreate).subscribe({
      next: () => {
        this.feedbackMessage = `Booklist "${nameToCreate}" created!`;
        this.newListName = '';
        this.loadData();
        setTimeout(() => {
          this.feedbackMessage = '';
          this.cdr.detectChanges();
        }, 3500);
      }
    });
  }

  addBookToBooklist(list: any) {
    const bookId = this.selectedBookByList[list.id];
    if (!bookId) return;

    this.apiService.addBookToList(list.id, Number(bookId)).subscribe({
      next: () => {
        this.feedbackMessage = `Added book to "${list.name}"!`;
        this.loadData();
        setTimeout(() => {
          this.feedbackMessage = '';
          this.cdr.detectChanges();
        }, 3500);
      }
    });
  }

  upvote(list: any) {
    this.apiService.upvoteList(list.id).subscribe({
      next: () => {
        list.upvotes = (list.upvotes || 0) + 1;
        this.cdr.detectChanges();
      }
    });
  }

  downvote(list: any) {
    this.apiService.downvoteList(list.id).subscribe({
      next: () => {
        list.downvotes = (list.downvotes || 0) + 1;
        this.cdr.detectChanges();
      }
    });
  }
}