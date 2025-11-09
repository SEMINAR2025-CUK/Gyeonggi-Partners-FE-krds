// Discussion Room Types
export interface DiscussionRoom {
  roomId: number;
  title: string;
  region: string;
  participantCount: number;
  description?: string;
  accessLevel?: 'PUBLIC' | 'PRIVATE';
}

export interface RoomParticipant {
  userId: number;
  nickname: string;
}

export interface ChatMessage {
  messageId: number;
  senderNickname: string;
  content: string;
  sentAt: string;
  userId?: number;
}

export interface Proposal {
  proposalId: number;
  status: 'PENDING_CONSENT' | 'APPROVED' | 'REJECTED';
  title?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Proposal creation/update payload
export interface ProposalPayload {
  title: string;
  content: string;
  roomId: number;
}

export interface RoomDetails {
  title: string;
  proposal?: Proposal;
  messages: ChatMessage[];
  participants: RoomParticipant[];
}

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}