/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_CONFIG, MOCK_CONFIG } from '../config/constants';
import {
  DiscussionRoom,
  RoomDetails,
  ApiResponse,
  PaginatedResponse,
  Proposal,
  ProposalPayload
} from '../types/discussion';
import { mockRooms, getMockRoomDetails } from './mockData';

// Simulated delay for mock API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get auth headers with JWT token
const getAuthHeaders = (): HeadersInit => {
  const token = sessionStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API Service
export class DiscussionRoomAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  // Get all discussion rooms
  async getAllRooms(
    page: number = 0, 
    size: number = 10, 
    region?: string
  ): Promise<ApiResponse<PaginatedResponse<DiscussionRoom>>> {
    if (API_CONFIG.USE_MOCK) {
      await delay(MOCK_CONFIG.MESSAGE_DELAY);
      
      let filteredRooms = [...mockRooms];
      if (region) {
        filteredRooms = filteredRooms.filter(r => r.region === region);
      }

      return {
        code: 'SUCCESS',
        message: '논의방 조회에 성공했습니다',
        data: {
          content: filteredRooms,
          totalPages: 1,
          totalElements: filteredRooms.length,
        },
      };
    }

    // Real API call
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(region && { region }),
    });

    const token = sessionStorage.getItem('accessToken');
    const response = await fetch(`${this.baseUrl}/api/discussion-rooms/retrieveTotal?${params}`, {
      credentials: 'include',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.json();
  }

  // Get user's participating rooms
  async getMyRooms(
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PaginatedResponse<DiscussionRoom>>> {
    if (API_CONFIG.USE_MOCK) {
      await delay(MOCK_CONFIG.MESSAGE_DELAY);
      
      // Return first 2 rooms as user's rooms
      return {
        code: 'SUCCESS',
        message: '참여중인 논의방 조회에 성공했습니다',
        data: {
          content: mockRooms.slice(0, 2),
          totalPages: 1,
          totalElements: 2,
        },
      };
    }

    // Real API call
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const token = sessionStorage.getItem('accessToken');
    const response = await fetch(`${this.baseUrl}/api/discussion-rooms/retrieveMyJoined?${params}`, {
      credentials: 'include',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.json();
  }

  // Create a new room
  async createRoom(data: {
    title: string;
    description: string;
    region: string;
    accessLevel: string;
  }): Promise<ApiResponse<DiscussionRoom>> {
    if (API_CONFIG.USE_MOCK) {
      await delay(MOCK_CONFIG.MESSAGE_DELAY);
      
      const newRoom: DiscussionRoom = {
        roomId: mockRooms.length + 1,
        title: data.title,
        region: data.region,
        participantCount: 1,
        description: data.description,
        accessLevel: data.accessLevel as 'PUBLIC' | 'PRIVATE',
      };

      return {
        code: 'SUCCESS',
        message: '논의방이 성공적으로 생성되었습니다',
        data: newRoom,
      };
    }

    // Real API call
    const response = await fetch(`${this.baseUrl}/api/discussion-rooms/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Join a room (first time)
  async joinRoom(roomId: number): Promise<ApiResponse<{ members: any[] }>> {
    if (API_CONFIG.USE_MOCK) {
      await delay(MOCK_CONFIG.MESSAGE_DELAY);
      
      return {
        code: 'SUCCESS',
        message: '논의방 참여에 성공했습니다.',
        data: {
          members: [
            { userId: 55, nickname: '대표작성자' },
            { userId: 72, nickname: '길동이' },
            { userId: 105, nickname: MOCK_CONFIG.CURRENT_USER_NICKNAME },
          ],
        },
      };
    }

    // Real API call
    const token = sessionStorage.getItem('accessToken');
    const response = await fetch(`${this.baseUrl}/api/discussion-rooms/${roomId}/join`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.json();
  }

  // Get room details
  async getRoomDetails(roomId: number): Promise<ApiResponse<RoomDetails>> {
    if (API_CONFIG.USE_MOCK) {
      await delay(MOCK_CONFIG.MESSAGE_DELAY);
      
      return {
        code: 'SUCCESS',
        message: '요청에 성공했습니다.',
        data: getMockRoomDetails(roomId),
      };
    }

    // Real API call
    const token = sessionStorage.getItem('accessToken');
    const response = await fetch(`${this.baseUrl}/api/discussion-rooms/${roomId}`, {
      credentials: 'include',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.json();
  }

  // Leave a room
  async leaveRoom(roomId: number): Promise<ApiResponse<void>> {
    if (API_CONFIG.USE_MOCK) {
      await delay(MOCK_CONFIG.MESSAGE_DELAY);
      
      return {
        code: 'SUCCESS',
        message: '논의방에서 나갔습니다.',
        data: undefined as any,
      };
    }

    // Real API call
    const token = sessionStorage.getItem('accessToken');
    const response = await fetch(`${this.baseUrl}/api/discussion-rooms/${roomId}/leave`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.json();
  }

  // Create a proposal
  async createProposal(payload: ProposalPayload): Promise<ApiResponse<Proposal>> {
    if (API_CONFIG.USE_MOCK) {
      await delay(MOCK_CONFIG.MESSAGE_DELAY);
      
      const newProposal: Proposal = {
        proposalId: Math.floor(Math.random() * 10000),
        title: payload.title,
        content: payload.content,
        status: 'PENDING_CONSENT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        code: 'SUCCESS',
        message: '제안서가 성공적으로 작성되었습니다.',
        data: newProposal,
      };
    }

    // Real API call
    const response = await fetch(`${this.baseUrl}/api/proposals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  // Update a proposal
  async updateProposal(proposalId: number, payload: Partial<ProposalPayload>): Promise<ApiResponse<Proposal>> {
    if (API_CONFIG.USE_MOCK) {
      await delay(MOCK_CONFIG.MESSAGE_DELAY);
      
      return {
        code: 'SUCCESS',
        message: '제안서가 수정되었습니다.',
        data: {
          proposalId,
          title: payload.title || '수정된 제안서',
          content: payload.content || '',
          status: 'PENDING_CONSENT',
          updatedAt: new Date().toISOString(),
        },
      };
    }

    // Real API call
    const response = await fetch(`${this.baseUrl}/api/proposals/${proposalId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  // Get proposal details
  async getProposal(proposalId: number): Promise<ApiResponse<Proposal>> {
    if (API_CONFIG.USE_MOCK) {
      await delay(MOCK_CONFIG.MESSAGE_DELAY);
      
      return {
        code: 'SUCCESS',
        message: '제안서 조회에 성공했습니다.',
        data: {
          proposalId,
          title: '샘플 제안서',
          content: '<p>제안서 내용입니다.</p>',
          status: 'PENDING_CONSENT',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    // Real API call
    const token = sessionStorage.getItem('accessToken');
    const response = await fetch(`${this.baseUrl}/api/proposals/${proposalId}`, {
      credentials: 'include',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.json();
  }
}

// Export singleton instance
export const discussionRoomAPI = new DiscussionRoomAPI();
