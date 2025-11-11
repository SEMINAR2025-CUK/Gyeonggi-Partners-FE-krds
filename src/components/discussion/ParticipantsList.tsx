import { RoomParticipant } from '../../types/discussion';
import { Users } from 'lucide-react';

interface ParticipantsListProps {
  participants: RoomParticipant[];
}

export const ParticipantsList = ({ participants }: ParticipantsListProps) => {
  return (
    <div className="bg-white border-r border-gray-200 p-4 overflow-y-auto h-full">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
        <Users size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">
          참여자 ({participants.length})
        </h3>
      </div>

      <div className="space-y-2">
        {participants.map((participant) => (
          <div
            key={participant.userId}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(participant.nickname)}&background=random&size=32`}
                alt={participant.nickname}
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {participant.nickname}
              </p>
              <p className="text-xs text-gray-500">
                ID: {participant.userId}
              </p>
            </div>
          </div>
        ))}
      </div>

      {participants.length === 0 && (
        <div className="text-center text-gray-500 text-sm mt-8">
          참여자가 없습니다
        </div>
      )}
    </div>
  );
};
