import { create } from "zustand";
import { LIMIT_MESSAGES } from "../constants";

export type Imessage = {
  created_at: string;
  id: string;
  is_edit: boolean;
  send_by: string;
  text: string;
  users: {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
  };
};

interface MessageState {
  hasMore: boolean;
  page: number;
  messages: Imessage[];
  actionMessage: Imessage | undefined;
  optimisticIds: string[];
  addMessage: (message: Imessage) => void;
  setActionMessage: (message: Imessage) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: Imessage) => void;
  setOptimisticIds: (id: string) => void;
  setMessages: (messages: Imessage[]) => void;
}

export const useMessage = create<MessageState>()(set => ({
  hasMore: true,
  page: 1,
  messages: [],
  optimisticIds: [],
  actionMessage: undefined,
  setOptimisticIds: id =>
    set(state => ({ optimisticIds: [...state.optimisticIds, id] })),
  addMessage: message =>
    set(state => ({
      messages: [...state.messages, message],
    })),
  setActionMessage: message => set({ actionMessage: message }),
  optimisticDeleteMessage: messageId =>
    set(state => ({
      messages: state.messages.filter(message => message.id !== messageId),
    })),
  optimisticUpdateMessage: newMessage =>
    set(state => ({
      messages: state.messages.map(message =>
        message.id === newMessage.id ? { ...message, ...newMessage } : message
      ),
    })),
  setMessages: messages =>
    set(state => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= LIMIT_MESSAGES,
    })),
}));
