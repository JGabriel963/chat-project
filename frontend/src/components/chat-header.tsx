import { XIcon } from "lucide-react";
import { useChatStore } from "../store/use-chat-store";
import { useEffect } from "react";
import { useAuthStore } from "../store/use-auth-store";

export function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUser } = useAuthStore();
  const isOnline = selectedUser?._id
    ? onlineUser.includes(selectedUser?._id)
    : false;

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
      <div className="flex items-center space-x-3">
        <div
          className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}
        >
          <div className="w-12 rounded-full">
            <img
              src={selectedUser?.profilePicture || "/avatar.png"}
              alt={selectedUser?.name}
            />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium"> {selectedUser?.name} </h3>
          <p className="text-slate-400 text-xs">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}
