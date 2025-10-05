import { ActiveTabSwitch } from "../components/active-tab-switch";
import { ChatContainer } from "../components/chat-container";
import { ChatList } from "../components/chats-list";
import { ContactsList } from "../components/contacts-list";
import { NoConversationPlaceholder } from "../components/no-conversation-placeholder";
import { ProfileHeader } from "../components/profile-header";
import { useChatStore } from "../store/use-chat-store";

export function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <div className="w-full h-full bg-gray-900 flex flex-row rounded-md overflow-hidden">
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatList /> : <ContactsList />}
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </div>
    </div>
  );
}
