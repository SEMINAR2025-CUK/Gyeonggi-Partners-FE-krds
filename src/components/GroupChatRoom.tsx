import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './ui/dialog';
// import { Button } from './ui/button';
import { Button } from '@krds-ui/core';
import { X } from 'lucide-react';
import { useDiscussionRoom } from '../hooks/useDiscussionRoom';
import { DiscussionRoom as DiscussionRoomType, ProposalPayload } from '../types/discussion';
import { discussionRoomAPI } from '../services/api';
import { JoinRoomModal } from './discussion/JoinRoomModal';
import { ChatArea } from './discussion/ChatArea';
import { ProposalPanel } from './discussion/ProposalPanel';
import { ProposalEditor } from './ProposalEditor';

interface GroupChatRoomProps {
  selectedRoom: DiscussionRoomType | null;
  isModalOpen: boolean;
  onClose: () => void;
}

export const GroupChatRoom = ({ selectedRoom, isModalOpen, onClose }: GroupChatRoomProps) => {
  const [isInRoom, setIsInRoom] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const { roomDetails, messages, isLoading, sendMessage, leaveRoom } = useDiscussionRoom(currentRoomId);
  const [inputMessage, setInputMessage] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Handle join room
  const handleJoinRoom = async () => {
    if (!selectedRoom) return;

    try {
      const response = await discussionRoomAPI.joinRoom(selectedRoom.roomId);
      
      if (response.code === 'SUCCESS') {
        setCurrentRoomId(selectedRoom.roomId);
        setIsInRoom(true);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('논의방 참여에 실패했습니다.');
    }
  };

  // Handle send message
  const handleSendMessage = (textContent: string) => {
    if (!textContent.trim()) return;
    
    sendMessage(textContent);
    setInputMessage('');
  };

  // Handle leave room
  const handleLeaveRoom = async () => {
    if (window.confirm('정말 논의방에서 나가시겠습니까?')) {
      const success = await leaveRoom();
      if (success) {
        setIsInRoom(false);
        setCurrentRoomId(null);
        onClose();
      }
    }
  };

  // Handle back button
  const handleBack = () => {
    setIsInRoom(false);
    setCurrentRoomId(null);
    onClose();
  };

  // Handle save proposal
  const handleSaveProposal = async (payload: ProposalPayload) => {
    try {
      const response = await discussionRoomAPI.createProposal(payload);
      
      if (response.code === 'SUCCESS') {
        alert('제안서가 성공적으로 작성되었습니다.');
        setIsEditorOpen(false);
        // TODO: Refresh room details to show new proposal
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Failed to create proposal:', error);
      alert('제안서 작성에 실패했습니다.');
    }
  };

  // Render Join Modal
  if (!isInRoom) {
    return (
      <JoinRoomModal
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={onClose}
        onJoin={handleJoinRoom}
      />
    );
  }

  // Render Chat Room
  if (isInRoom && currentRoomId) {
    // Show editor modal
    if (isEditorOpen) {
      return (
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="max-w-4xl h-[80vh] p-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <DialogTitle>제안서 작성</DialogTitle>
              <Button
                variant="tertiary"
                size="small"
                onClick={() => setIsEditorOpen(false)}
                children={<X size={20} />}
              >
              </Button>
            </div>
            <ProposalEditor
              roomId={currentRoomId}
              onSave={handleSaveProposal}
              onCancel={() => setIsEditorOpen(false)}
            />
          </DialogContent>
        </Dialog>
      );
    }

    // Loading state
    if (isLoading) {
      return (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">논의방을 불러오는 중...</p>
          </div>
        </div>
      );
    }

    // Room not found
    if (!roomDetails) {
      return (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">논의방을 찾을 수 없습니다.</p>
            <Button onClick={handleBack} className="mt-4" children="뒤로 가기">
            </Button>
          </div>
        </div>
      );
    }

    // Main Chat Room Layout
    return (
      <div className="flex h-screen">
        {/* Chat Section - 2/3 width */}
        <ChatArea
          roomDetails={roomDetails}
          messages={messages}
          inputMessage={inputMessage}
          onInputChange={setInputMessage}
          onSendMessage={handleSendMessage}
          onBack={handleBack}
          onLeaveRoom={handleLeaveRoom}
        />

        {/* Proposal Panel - 1/3 width */}
        <div className="hidden lg:block" style={{ flexBasis: '33.333%' }}>
          <ProposalPanel
            proposal={roomDetails.proposal}
            onCreateProposal={() => setIsEditorOpen(true)}
          />
        </div>
      </div>
    );
  }

  return null;
};
