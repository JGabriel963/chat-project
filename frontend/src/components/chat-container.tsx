import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/use-auth-store";
import { useChatStore } from "../store/use-chat-store";
import { ChatHeader } from "./chat-header";
import { NoChatHistoryPlaceholder } from "./no-chat-history-placeholder";
import { MessageInput } from "./message-input";
import { MessagesLoadingSkeleton } from "./message-loading";

export function ChatContainer() {
  const { authUser } = useAuthStore();
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading } =
    useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />

      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser?.id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser?.id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-b-lg h-48 object-cover"
                    />
                  )}

                  {msg.text && <p>{msg.text}</p>}
                  <p>
                    {Intl.DateTimeFormat("pt-BR", {
                      hour: "numeric",
                      minute: "numeric",
                    }).format(new Date(msg.createdAt))}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.name} />
        )}
      </div>

      <MessageInput />
    </>
  );
}
