import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private stompClient: Client | null = null;
  private currentSubscription: StompSubscription | null = null;
  public messageSubject = new Subject<any>();
  public connectedSubject = new Subject<boolean>();

  connect(roomId: number) {
    this.disconnect();

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('https://book-platform-backend-qzo3.onrender.com/ws'),
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      this.connectedSubject.next(true);
      this.currentSubscription = this.stompClient!.subscribe(
        `/topic/room/${roomId}`,
        (message: any) => {
          if (message.body) {
            this.messageSubject.next(JSON.parse(message.body));
          }
        }
      );
    };

    this.stompClient.onWebSocketClose = () => {
      this.connectedSubject.next(false);
    };

    this.stompClient.activate();
  }

  sendMessage(roomId: number, chatMessage: { sender: string; content: string; roomId: number }) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(chatMessage)
      });
    }
  }

  disconnect() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }
}
