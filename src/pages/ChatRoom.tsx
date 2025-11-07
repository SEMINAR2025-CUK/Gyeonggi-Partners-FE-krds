import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageModel,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

const message: MessageModel = {
  message: "메시지 내용",
  sentTime: "just now",
  sender: "sender name",
  direction: "incoming", // 또는 "outgoing"
  position: "single" // 또는 "first", "normal", "last"
}

export function BasicChat() {
  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            <Message
              model={message}
            />
          </MessageList>
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}