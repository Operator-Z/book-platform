import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { BookshelfComponent } from './bookshelf/bookshelf';
import { BookListComponent } from './book-list/book-list';
import { BookClubsComponent } from './book-clubs/book-clubs';
import { BuddyRoomsComponent } from './buddy-rooms/buddy-rooms';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'bookshelf', component: BookshelfComponent },
  { path: 'book-lists', component: BookListComponent },
  { path: 'book-clubs', component: BookClubsComponent },
  { path: 'buddy-rooms', component: BuddyRoomsComponent }
];