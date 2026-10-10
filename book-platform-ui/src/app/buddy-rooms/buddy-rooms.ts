import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';
import { ChatService } from '../services/chat';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buddy-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buddy-rooms.html'
})
export class BuddyRoomsComponent implements OnInit, OnDestroy {
  buddyRooms: any[] = [];
  catalogBooks: any[] = [];
  newRoomName: string = '';
  selectedBookId?: number;
  feedbackMessage: string = '';

  // Active Room & Live WebSocket Chat State
  activeRoom: any = { id: 1, name: 'General Buddy Read Room #1', book: { name: 'Featured Catalog Book', author: 'Open Library' } };
  sender: string = 'Reader_' + Math.floor(100 + Math.random() * 900);
  readingProgress: number = 25;
  messageContent: string = '';
  messagesByRoom: { [roomId: number]: any[] } = { 1: [] };
  isConnected: boolean = false;

  private msgSub?: Subscription;
  private connSub?: Subscription;

  constructor(
    private apiService: ApiService,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRoomsAndBooks();

    this.connSub = this.chatService.connectedSubject.subscribe((status: boolean) => {
      this.isConnected = status;
      this.cdr.detectChanges();
    });

    this.msgSub = this.chatService.messageSubject.subscribe((msg: any) => {
      const rId = msg.roomId || this.activeRoom.id;
      if (!this.messagesByRoom[rId]) {
        this.messagesByRoom[rId] = [];
      }
      this.messagesByRoom[rId].push(msg);
      this.cdr.detectChanges();
    });

    // Connect to default Room #1 immediately
    this.chatService.connect(this.activeRoom.id);
  }

  loadRoomsAndBooks() {
    this.apiService.getBuddyRooms().subscribe({
      next: (rooms: any[]) => {
        this.buddyRooms = rooms || [];
        if (this.buddyRooms.length > 0) {
          this.selectRoom(this.buddyRooms[0]);
        }
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

  createRoom() {
    if (!this.newRoomName.trim() || !this.selectedBookId) return;

    this.apiService.createBuddyRoom(this.newRoomName.trim(), Number(this.selectedBookId)).subscribe({
      next: () => {
        this.feedbackMessage = `Buddy Read Room "${this.newRoomName}" created!`;
        this.newRoomName = '';
        this.loadRoomsAndBooks();
        setTimeout(() => {
          this.feedbackMessage = '';
          this.cdr.detectChanges();
        }, 3500);
      }
    });
  }

  selectRoom(room: any) {
    this.activeRoom = room;
    if (!this.messagesByRoom[room.id]) {
      this.messagesByRoom[room.id] = [];
    }
    this.chatService.connect(room.id);
    this.cdr.detectChanges();
  }

  get currentMessages(): any[] {
    return this.messagesByRoom[this.activeRoom.id] || [];
  }

  sendMessage() {
    if (!this.messageContent.trim()) return;

    const chatMessage = {
      sender: `${this.sender} (${this.readingProgress}% read)`,
      content: this.messageContent.trim(),
      roomId: this.activeRoom.id
    };

    this.chatService.sendMessage(this.activeRoom.id, chatMessage);
    this.messageContent = '';
  }

  shareProgressUpdate() {
    const progressMessage = {
      sender: this.sender,
      content: `📊 Progress Update: I am now ${this.readingProgress}% through "${this.activeRoom.book?.name || 'the book'}"!`,
      roomId: this.activeRoom.id
    };
    this.chatService.sendMessage(this.activeRoom.id, progressMessage);
  }

  ngOnDestroy() {
    this.msgSub?.unsubscribe();
    this.connSub?.unsubscribe();
    this.chatService.disconnect();
  }
}