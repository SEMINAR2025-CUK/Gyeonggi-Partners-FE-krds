import { useState, useEffect } from 'react';
import { Button } from '@krds-ui/core';
import { DiscussionRoomCard } from './components/DiscussionRoomCard';
import { GroupChatRoom } from './components/GroupChatRoom';
import { discussionRoomAPI } from './services/api';
import { DiscussionRoom } from './types/discussion';
import { RefreshCw } from 'lucide-react';

export default function Temp() {
  const [rooms, setRooms] = useState<DiscussionRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<DiscussionRoom | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load discussion rooms
  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const response = await discussionRoomAPI.getAllRooms();
      if (response.code === 'SUCCESS') {
        setRooms(response.data.content);
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // Handle card click - open modal
  const handleCardClick = (room: DiscussionRoom) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    loadRooms(); // Refresh room list when returning
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1>논의방 목록</h1>
            <Button
              variant="tertiary"
              onClick={loadRooms}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              새로고침
            </Button>
          </div>
          <p className="text-gray-600">
            관심있는 논의방에 참여하여 지역 문제를 함께 해결해보세요
          </p>
        </div>

        {/* Room Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">논의방을 불러오는 중...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">현재 개설된 논의방이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <DiscussionRoomCard
                key={room.roomId}
                room={room}
                onClick={() => handleCardClick(room)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Group Chat Room (Modal + Chat) */}
      <GroupChatRoom
        selectedRoom={selectedRoom}
        isModalOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
