import { useEffect } from "react";
import { useChatStore } from "../store/use-chat-store";
import { UsersLoadingSkeleton } from "./users-loading";
import { useAuthStore } from "../store/use-auth-store";

export function ContactsList() {
  const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } =
    useChatStore();
  const { onlineUser } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            {/* TODO: FIX THIS ONLINE STATUS AND MAKE IT WORK SOCKET */}
            <div
              className={`avatar ${
                onlineUser.includes(contact._id)
                  ? "avatar-online"
                  : "avatar-offline"
              }`}
            >
              <div className="size-12 rounded-full">
                <img
                  src={contact.profilePicture || "/avatar.png"}
                  alt={contact.name}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {contact.name}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
}
