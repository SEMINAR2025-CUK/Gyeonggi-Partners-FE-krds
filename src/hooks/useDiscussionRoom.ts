import { useState, useEffect, useCallback, useRef } from 'react';
import { discussionRoomAPI } from '../services/api';
import { webSocketService } from '../services/webSocket';
import { RoomDetails, ChatMessage } from '../types/discussion';
// import { MOCK_CONFIG } from '../config/constants';

export const useDiscussionRoom = (roomId: number | null) => {
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const isInitialLoad = useRef(true);

  // Load room details
  const loadRoomDetails = useCallback(async () => {
    if (!roomId) {
      setRoomDetails(null);
      setMessages([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await discussionRoomAPI.getRoomDetails(roomId);

      if (response.code === 'SUCCESS') {
        setMessages(response.data.messages);
        isInitialLoad.current = false; // 초기 로드시에만 API에서 받은 메시지 사용
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
    if (!roomId) {
      setIsWebSocketConnected(false);
      isInitialLoad.current = true;
      return;
    }

    // 1. 먼저 방 정보와 초기 메시지 로드
    loadRoomDetails();

    // 2. WebSocket 연결
    webSocketService.connect(roomId, () => {
      console.log('WebSocket connected for room:', roomId);
      setIsWebSocketConnected(true);
    });

    // 3. 실시간 메시지 구독 (새 메시지만 추가)
    const unsubscribe = webSocketService.onMessage((message: ChatMessage) => {
      // console.log('New message received:', message);
      setMessages(prev => [...prev, message]);
    });

    // Cleanup
    return () => {
      unsubscribe();
      webSocketService.disconnect();
      setIsWebSocketConnected(false);
      setRoomDetails(null);
      setMessages([]);
      isInitialLoad.current = true;
    };
  }, [roomId, loadRoomDetails]);

  // Send a message - 실제 사용자 닉네임 사용
  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !roomDetails) return;

    // roomDetails에서 현재 사용자의 닉네임 찾기
    // 또는 sessionStorage에서 사용자 정보 가져오기
    const userInfo = sessionStorage.getItem('userInfo');
    const nickname = userInfo ? JSON.parse(userInfo).nickname : '익명';

    webSocketService.sendMessage(content, nickname);
  }, [roomDetails]);

  // Leave room
  const leaveRoom = useCallback(async () => {
    if (!roomId) return false;

    try {
      const response = await discussionRoomAPI.leaveRoom(roomId);

      if (response.code === 'SUCCESS') {
        webSocketService.disconnect();
        setIsWebSocketConnected(false);
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
    isWebSocketConnected,
    sendMessage,
    leaveRoom,
  };
};