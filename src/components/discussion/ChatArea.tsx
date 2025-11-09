/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useEffect, Fragment } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@krds-ui/core';
import { ArrowLeft, Users } from 'lucide-react';
import { RoomDetails, ChatMessage } from '../../types/discussion';
import { MOCK_CONFIG } from '../../config/constants';

interface ChatAreaProps {
  roomDetails: RoomDetails;
  messages: ChatMessage[];
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  onBack: () => void;
  onLeaveRoom: () => void;
}

export const ChatArea = ({
  roomDetails,
  messages,
  inputMessage,
  onInputChange,
  onSendMessage,
  onBack,
  onLeaveRoom,
}: ChatAreaProps) => {
  const messageListRef = useRef<any>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollToBottom();
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col" style={{ flexBasis: '66.666%' }}>
      {/* Custom Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="tertiary"
            onClick={onBack}
            className="p-2"
            size='medium'
            children={<ArrowLeft size={16} />}
          >
          </Button>
          <div>
            <h2 className="text-lg font-semibold">{roomDetails.title}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={14} />
              <span>{roomDetails.participants.length}명 참여중</span>
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={onLeaveRoom}
          size='medium'
          children="나가기"
        >
        </Button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-gray-100">
        <MainContainer>
          <ChatContainer>
            <MessageList ref={messageListRef}>
              {messages.map((msg) => {
                const isCurrentUser = msg.userId === MOCK_CONFIG.CURRENT_USER_ID;
                const messageTime = new Date(msg.sentAt).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <Fragment key={msg.messageId}>
                    <Message
                      model={{
                        message: msg.content,
                        sender: msg.senderNickname,
                        direction: isCurrentUser ? 'outgoing' : 'incoming',
                        position: 'single',
                      }}
                    >
                      {!isCurrentUser && (
                        <Avatar
                          name={msg.senderNickname}
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderNickname)}&background=random`}
                        />
                      )}
                      <Message.Footer sentTime={messageTime} />
                    </Message>
                  </Fragment>
                );
              })}
            </MessageList>
            
            <MessageInput
              placeholder="메시지를 입력하세요..."
              value={inputMessage}
              onChange={onInputChange}
              onSend={onSendMessage}
              attachButton={false}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};