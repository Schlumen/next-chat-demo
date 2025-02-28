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
}

export const useMessage = create<MessageState>()(() => ({
  messages: [],
}));
