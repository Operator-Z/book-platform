import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';
import { ChatService } from '../services/chat';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-clubs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-clubs.html'
})
export class BookClubsComponent implements OnInit, OnDestroy {
  clubs: any[] = [];
  newClubName: string = '';
  newClubDescription: string = '';
  feedbackMessage: string = '';
  loading: boolean = true;

  // Active Club Discussion State
  activeClub: any = null;
  username: string = 'Reader_' + Math.floor(100 + Math.random() * 900);
  discussionPost: string = '';
  clubPosts: { [clubId: number]: any[] } = {};
  private msgSub?: Subscription;

  constructor(
    private apiService: ApiService,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadClubs();
    this.msgSub = this.chatService.messageSubject.subscribe((msg: any) => {
      if (this.activeClub && msg.roomId === 10000 + this.activeClub.id) {
        if (!this.clubPosts[this.activeClub.id]) {
          this.clubPosts[this.activeClub.id] = [];
        }
        this.clubPosts[this.activeClub.id].push(msg);
        this.cdr.detectChanges();
      }
    });
  }

  loadClubs() {
    this.loading = true;
    this.apiService.getBookClubs().subscribe({
      next: (data: any[]) => {
        this.clubs = data || [];
        this.loading = false;
        if (this.clubs.length > 0 && !this.activeClub) {
          this.selectClub(this.clubs[0]);
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createClub() {
    if (!this.newClubName.trim() || !this.newClubDescription.trim()) return;

    this.apiService.createBookClub(this.newClubName.trim(), this.newClubDescription.trim()).subscribe({
      next: () => {
        this.feedbackMessage = `BookClub "${this.newClubName}" created!`;
        this.newClubName = '';
        this.newClubDescription = '';
        this.loadClubs();
        setTimeout(() => {
          this.feedbackMessage = '';
          this.cdr.detectChanges();
        }, 3500);
      }
    });
  }

  joinClub(club: any) {
    this.apiService.joinBookClub(club.id).subscribe({
      next: () => {
        this.feedbackMessage = `You joined "${club.name}"!`;
        this.loadClubs();
        setTimeout(() => {
          this.feedbackMessage = '';
          this.cdr.detectChanges();
        }, 3500);
      }
    });
  }

  selectClub(club: any) {
    this.activeClub = club;
    if (!this.clubPosts[club.id]) {
      this.clubPosts[club.id] = [];
    }
    // Uses channel offset 10000 + club.id for live club discussion
    this.chatService.connect(10000 + club.id);
    this.cdr.detectChanges();
  }

  postToClub() {
    if (!this.activeClub || !this.discussionPost.trim()) return;
    const channelId = 10000 + this.activeClub.id;
    this.chatService.sendMessage(channelId, {
      sender: this.username,
      content: this.discussionPost.trim(),
      roomId: channelId
    });
    this.discussionPost = '';
  }

  ngOnDestroy() {
    this.msgSub?.unsubscribe();
    this.chatService.disconnect();
  }
}