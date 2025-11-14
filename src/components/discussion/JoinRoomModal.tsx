// src/components/discussion/JoinRoomModal.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '../ui/dialog';
  import { Button, Body } from '@krds-ui/core';
  import { MapPin, Users, Lock } from 'lucide-react';
  import { DiscussionRoom } from '../../types/discussion';
  import { REGIONS } from '../../config/constants';
  
  interface JoinRoomModalProps {
    room: DiscussionRoom | null;
    isOpen: boolean;
    onClose: () => void;
    onJoin: () => void;
    isJoining?: boolean;
  }

  export const JoinRoomModal = ({ room, isOpen, onClose, onJoin, isJoining = false }: JoinRoomModalProps) => {
    if (!room) return null;
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{room.title}</DialogTitle>
            {room.description && (
              <DialogDescription>{room.description}</DialogDescription>
            )}
          </DialogHeader>
          
          <div className="flex flex-col gap-3 py-4">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-primary" />
              <Body size="m" className="text-gray-70">
                지역: <span className="font-bold">{REGIONS[room.region] || room.region}</span>
              </Body>
            </div>
            
            <div className="flex items-center gap-3">
              <Users size={18} className="text-success" />
              <Body size="m" className="text-gray-70">
                참여자: <span className="font-bold">{room.participantCount}명</span>
              </Body>
            </div>
            
            {room.accessLevel && (
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-gray-60" />
                <Body size="m" className="text-gray-70">
                  공개 여부: <span className="font-bold">{room.accessLevel === 'PUBLIC' ? '공개' : '비공개'}</span>
                </Body>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="secondary" onClick={onClose} size="small" disabled={isJoining}>
              취소
            </Button>
            <Button variant="primary" onClick={onJoin} size="small" disabled={isJoining}>
              {isJoining ? '참여 중...' : '논의방 참여하기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };