import { useEffect } from "react";
import { useChatStore } from "../store/use-chat-store";
import { UsersLoadingSkeleton } from "./users-loading";
import { NoChatsFound } from "./no-chats-found";
import { useAuthStore } from "../store/use-auth-store";

export function ChatList() {
  const { getChats, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUser } = useAuthStore();

  useEffect(() => {
    getChats();
  }, [getChats]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            {/* TODO: FIX THIS ONLINE STATUS AND MAKE IT WORK SOCKET */}
            <div
              className={`avatar ${
                onlineUser.includes(chat._id)
                  ? "avatar-online"
                  : "avatar-offline"
              }`}
            >
              <div className="size-12 rounded-full">
                <img
                  src={chat.profilePicture || "/avatar.png"}
                  alt={chat.name}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{chat.name}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
