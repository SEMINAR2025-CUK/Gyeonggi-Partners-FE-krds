import { useState, useEffect, useCallback } from 'react';
import { discussionRoomAPI } from '../services/api';
import { webSocketService } from '../services/webSocket';
import { RoomDetails, ChatMessage } from '../types/discussion';
import { MOCK_CONFIG } from '../config/constants';

export const useDiscussionRoom = (roomId: number | null) => {
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load room details
  const loadRoomDetails = useCallback(async () => {
    if (!roomId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await discussionRoomAPI.getRoomDetails(roomId);

      if (response.code === 'SUCCESS') {
        setRoomDetails(response.data);
        setMessages(response.data.messages);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('논의방 정보를 불러오는데 실패했습니다.');
      console.error('Failed to load room details:', err);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  // Connect to WebSocket
  useEffect(() => {
    if (!roomId) return;

    loadRoomDetails();

    // Connect to WebSocket
    webSocketService.connect(roomId, () => {
      console.log('WebSocket connected for room:', roomId);
    });

    // Subscribe to new messages
    const unsubscribe = webSocketService.onMessage((message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    // Cleanup
    return () => {
      unsubscribe();
      webSocketService.disconnect();
    };
  }, [roomId, loadRoomDetails]);

  // Send a message
  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    webSocketService.sendMessage(content, MOCK_CONFIG.CURRENT_USER_NICKNAME);
  }, []);

  // Leave room
  const leaveRoom = useCallback(async () => {
    if (!roomId) return;

    try {
      const response = await discussionRoomAPI.leaveRoom(roomId);

      if (response.code === 'SUCCESS') {
        webSocketService.disconnect();
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError('논의방 나가기에 실패했습니다.');
      console.error('Failed to leave room:', err);
      return false;
    }
  }, [roomId]);

  return {
    roomDetails,
    messages,
    isLoading,
    error,
    sendMessage,
    leaveRoom,
  };
};
