import { DiscussionRoom, RoomDetails, ChatMessage, RoomParticipant } from '../types/discussion';

// Mock Discussion Rooms
export const mockRooms: DiscussionRoom[] = [
  {
    roomId: 1,
    title: '부천역 소음 문제에 대해 논의해봅시다',
    region: 'BUCHEON',
    participantCount: 7,
    description: '부천역 근처 소음 문제를 함께 논의하고 해결 방안을 모색합니다.',
    accessLevel: 'PUBLIC',
  },
  {
    roomId: 2,
    title: '공원 시설 개선 논의',
    region: 'BUCHEON',
    participantCount: 12,
    description: '지역 공원의 시설 개선에 대한 의견을 나눕니다.',
    accessLevel: 'PUBLIC',
  },
  {
    roomId: 3,
    title: '교통 체증 해결 방안',
    region: 'SEOUL',
    participantCount: 25,
    description: '출퇴근 시간 교통 체증 개선 방안을 논의합니다.',
    accessLevel: 'PUBLIC',
  },
];

// Mock Participants
export const mockParticipants: Record<number, RoomParticipant[]> = {
  1: [
    { userId: 1, nickname: '현재사용자' },
    { userId: 2, nickname: '길동이' },
    { userId: 3, nickname: '철수' },
    { userId: 4, nickname: '영희' },
  ],
  2: [
    { userId: 1, nickname: '현재사용자' },
    { userId: 5, nickname: '민수' },
  ],
  3: [
    { userId: 1, nickname: '현재사용자' },
  ],
};

// Mock Messages
export const mockMessages: Record<number, ChatMessage[]> = {
  1: [
    {
      messageId: 1,
      senderNickname: '길동이',
      content: '안녕하세요! 부천역 소음 문제가 심각한 것 같아요.',
      sentAt: '2025-11-09T10:30:00Z',
      userId: 2,
    },
    {
      messageId: 2,
      senderNickname: '철수',
      content: '저도 같은 생각입니다. 특히 저녁 시간대가 심한 것 같아요.',
      sentAt: '2025-11-09T10:32:00Z',
      userId: 3,
    },
    {
      messageId: 3,
      senderNickname: '영희',
      content: '방음벽 설치를 제안해보는 건 어떨까요?',
      sentAt: '2025-11-09T10:35:00Z',
      userId: 4,
    },
    {
      messageId: 4,
      senderNickname: '현재사용자',
      content: '좋은 의견이네요! 제안서를 작성해볼까요?',
      sentAt: '2025-11-09T10:40:00Z',
      userId: 1,
    },
  ],
  2: [
    {
      messageId: 5,
      senderNickname: '민수',
      content: '공원 벤치가 많이 낡았더라고요.',
      sentAt: '2025-11-09T09:00:00Z',
      userId: 5,
    },
  ],
  3: [],
};

// Mock Room Details
export const getMockRoomDetails = (roomId: number): RoomDetails => {
  return {
    title: mockRooms.find(r => r.roomId === roomId)?.title || '논의방',
    proposal: roomId === 1 ? {
      proposalId: 101,
      status: 'PENDING_CONSENT',
      title: '부천역 방음벽 설치 제안',
    } : undefined,
    messages: mockMessages[roomId] || [],
    participants: mockParticipants[roomId] || [],
  };
};
