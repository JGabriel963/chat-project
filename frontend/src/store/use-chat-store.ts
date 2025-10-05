import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";

type ChatStore = {
  allContacts: Contact[];
  chats: Contact[];
  messages: Messages[];
  activeTab: "chats" | "contacts";
  selectedUser: Contact | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setSelectedUser: (user: Contact | null) => void;

  getAllContacts: () => Promise<void>;
  getChats: () => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void>;
};

export const useChatStore = create<ChatStore>()((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled") || "false"),

  toggleSound() {
    localStorage.setItem(
      "isSoundEnabled",
      JSON.stringify(!get().isSoundEnabled)
    );
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab(tab) {
    set({ activeTab: tab });
  },
  setSelectedUser(user) {
    set({ selectedUser: user });
  },
  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await api.get<GetContactsResponse>("/messages/contacts");
      set({ allContacts: res.data.contacts });
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar contatos!");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getChats: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await api.get<GetChatsResponse>("/messages/chats");

      set({ chats: res.data.chatPartners });
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar contatos!");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessagesByUserId: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await api.get<GetMessagesResponse>(`/messages/${userId}`);
      set({ messages: res.data.messages });
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar mensagens!");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
}));
