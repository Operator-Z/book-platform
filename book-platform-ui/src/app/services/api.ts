import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://book-platform-backend-qzo3.onrender.com/api';
  public currentUserId = 1;

  constructor(private http: HttpClient) {}

  // Catalog
  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/books`);
  }

  // Bookshelf
  getBookshelf(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bookshelf/${this.currentUserId}`);
  }

  addToBookshelf(bookId: number, status: string = 'TO_BE_READ'): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/bookshelf/${this.currentUserId}/add/${bookId}?status=${status}`,
      {},
      { responseType: 'text' }
    );
  }

  updateBookshelfStatus(bookId: number, newStatus: string): Observable<string> {
    return this.http.put(
      `${this.baseUrl}/bookshelf/${this.currentUserId}/update/${bookId}?newStatus=${newStatus}`,
      {},
      { responseType: 'text' }
    );
  }

  // Reviews & 0.5 Ratings
  getBookAverageRating(bookId: number): Observable<string> {
    return this.http.get(`${this.baseUrl}/reviews/book/${bookId}/average`, { responseType: 'text' });
  }

  getBookReviews(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reviews/book/${bookId}`);
  }

  addReview(bookId: number, rating: number, content: string): Observable<string> {
    const params = `?userId=${this.currentUserId}&bookId=${bookId}&rating=${rating}&content=${encodeURIComponent(content)}`;
    return this.http.post(`${this.baseUrl}/reviews/add${params}`, {}, { responseType: 'text' });
  }

  // Booklists
  getBookLists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/booklists`);
  }

  createBookList(name: string): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/booklists/create?userId=${this.currentUserId}&name=${encodeURIComponent(name)}`,
      {},
      { responseType: 'text' }
    );
  }

  addBookToList(listId: number, bookId: number): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/booklists/${listId}/addBook/${bookId}`,
      {},
      { responseType: 'text' }
    );
  }

  upvoteList(listId: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/booklists/${listId}/upvote`, {}, { responseType: 'text' });
  }

  downvoteList(listId: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/booklists/${listId}/downvote`, {}, { responseType: 'text' });
  }

  // BookClubs & Buddy Read Rooms
  getBookClubs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/community/clubs`);
  }

  createBookClub(name: string, description: string): Observable<string> {
    const params = `?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`;
    return this.http.post(`${this.baseUrl}/community/club/create${params}`, {}, { responseType: 'text' });
  }

  joinBookClub(clubId: number): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/community/club/${clubId}/join/${this.currentUserId}`,
      {},
      { responseType: 'text' }
    );
  }

  getBuddyRooms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/community/buddyrooms`);
  }

  createBuddyRoom(name: string, bookId: number): Observable<string> {
    const params = `?name=${encodeURIComponent(name)}&bookId=${bookId}`;
    return this.http.post(`${this.baseUrl}/community/buddyroom/create${params}`, {}, { responseType: 'text' });
  }
}