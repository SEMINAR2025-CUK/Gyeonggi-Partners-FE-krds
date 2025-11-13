import { DiscussionRoom } from '../types/discussion';

interface DiscussionRoomCardProps {
  key: number;
  room: DiscussionRoom;
  onClick: () => void;
}

/**
 * 간단한 논의방 카드 컴포넌트
 * - 다른 개발자가 교체할 수 있도록 최소한의 구조로 유지
 * - room 객체와 onClick 핸들러만 props로 받음
 */
export const DiscussionRoomCard = ({ room, onClick }: DiscussionRoomCardProps) => {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer transition-all hover:shadow-lg hover:border-blue-300"
      onClick={onClick}
    >
      <h3 className="mb-2">{room.title}</h3>
      
      {room.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {room.description}
        </p>
      )}
      
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>👥 {room.participantCount}명</span>
        <span>📍 {room.region}</span>
      </div>
    </div>
  );
};
