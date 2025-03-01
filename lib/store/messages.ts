import { create } from "zustand";

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
  messages: Imessage[];
  actionMessage: Imessage | undefined;
  optimisticIds: string[];
  addMessage: (message: Imessage) => void;
  setActionMessage: (message: Imessage) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: Imessage) => void;
  setOptimisticIds: (id: string) => void;
}

export const useMessage = create<MessageState>()(set => ({
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
}));
