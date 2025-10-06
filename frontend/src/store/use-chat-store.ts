import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./use-auth-store";

export type MessagePaylod = {
  text?: string;
  image?: string;
};

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
  sendMessage: (data: MessagePaylod) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
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
  sendMessage: async (data: MessagePaylod) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Messages = {
      _id: tempId,
      senderId: authUser?.id || "",
      receiverId: selectedUser?._id || "",
      image: data.image || "",
      text: data.text || "",
      createdAt: new Date().toISOString(),
    };

    set({ messages: [...messages, optimisticMessage] });
    try {
      const res = await api.post<SendMessageResponse>(
        `/messages/send/${selectedUser?._id}`,
        data
      );
      set({ messages: messages.concat(res.data.newMessage) });
    } catch (error) {
      console.log(error);
      set({ messages: messages });
      toast.error("Erro ao enviar mensagem!");
    }
  },
  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.on("newMessage", (message: Messages) => {
      const isMessageSentFromSelectedUser =
        message.senderId === selectedUser._id;

      if (!isMessageSentFromSelectedUser) return;

      const currentMessage = get().messages;
      set({ messages: [...currentMessage, message] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log(e));
      }
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (socket) socket.off("newMessage");
  },
}));
