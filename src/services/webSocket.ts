import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_CONFIG, MOCK_CONFIG } from '../config/constants';
import { ChatMessage } from '../types/discussion';

export type MessageHandler = (message: ChatMessage) => void;

// WebSocket Service
export class WebSocketService {
  private client: Client | null = null;
  private mockInterval: NodeJS.Timeout | null = null;
  private messageHandlers: MessageHandler[] = [];
  private roomId: number | null = null;
  private mockMessageCounter = 1000;

  constructor() {
    if (!API_CONFIG.USE_MOCK) {
      this.client = new Client({
        webSocketFactory: () => new SockJS(API_CONFIG.WS_URL),
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });
    }
  }

  // Connect to WebSocket
  connect(roomId: number, onConnect?: () => void): Promise<void> {
    this.roomId = roomId;

    if (API_CONFIG.USE_MOCK) {
      // Mock WebSocket - just simulate connection
      console.log(`[MOCK] Connected to room ${roomId}`);
      this.startMockMessages();
      if (onConnect) onConnect();
      return Promise.resolve();
    }

    // Real WebSocket connection
    return new Promise((resolve, reject) => {
      if (!this.client) {
        reject(new Error('WebSocket client not initialized'));
        return;
      }

      this.client.onConnect = () => {
        console.log('WebSocket connected');
        
        // Subscribe to room messages
        this.client?.subscribe(`/topic/rooms/${roomId}`, (message: IMessage) => {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          this.notifyHandlers(chatMessage);
        });

        if (onConnect) onConnect();
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        reject(new Error('WebSocket 연결 실패'));
      };

      this.client.activate();
    });
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (API_CONFIG.USE_MOCK) {
      console.log('[MOCK] Disconnected from WebSocket');
      this.stopMockMessages();
      return;
    }

    if (this.client) {
      this.client.deactivate();
      console.log('WebSocket disconnected');
    }
  }

  // Send a message
  sendMessage(content: string, senderNickname: string): void {
    if (API_CONFIG.USE_MOCK) {
      // Mock sending - immediately add to messages
      const message: ChatMessage = {
        messageId: this.mockMessageCounter++,
        senderNickname,
        content,
        sentAt: new Date().toISOString(),
        userId: MOCK_CONFIG.CURRENT_USER_ID,
      };
      
      setTimeout(() => {
        this.notifyHandlers(message);
      }, 300);
      
      console.log('[MOCK] Sent message:', content);
      return;
    }

    // Real WebSocket send
    if (this.client && this.roomId) {
      this.client.publish({
        destination: `/app/rooms/${this.roomId}/send`,
        body: JSON.stringify({
          content,
          senderNickname,
        }),
      });
    }
  }

  // Subscribe to messages
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  // Notify all handlers
  private notifyHandlers(message: ChatMessage): void {
    this.messageHandlers.forEach(handler => handler(message));
  }

  // Mock message simulation (for testing without backend)
  private startMockMessages(): void {
    // Simulate receiving a message every 30 seconds
    this.mockInterval = setInterval(() => {
      const mockMessages = [
        '안녕하세요!',
        '좋은 의견이네요.',
        '이 부분은 어떻게 생각하시나요?',
        '제안서 작성이 필요할 것 같습니다.',
      ];

      const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      const randomUser = `사용자${Math.floor(Math.random() * 100)}`;

      const message: ChatMessage = {
        messageId: this.mockMessageCounter++,
        senderNickname: randomUser,
        content: randomMessage,
        sentAt: new Date().toISOString(),
        userId: Math.floor(Math.random() * 1000),
      };

      this.notifyHandlers(message);
    }, 30000);
  }

  private stopMockMessages(): void {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
