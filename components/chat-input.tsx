"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";

export default function ChatInput() {
  const user = useUser(state => state.user);

  const addMessage = useMessage(state => state.addMessage);
  const setOptimisticIds = useMessage(state => state.setOptimisticIds);

  const supabase = supabaseBrowser();

  const handleSendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (trimmedText === "") return;

    const id = uuid();
    const newMessage = {
      id,
      text: trimmedText,
      send_by: user?.id,
      is_edit: false,
      created_at: new Date().toISOString(),
      users: {
        id: user?.id,
        display_name: user?.user_metadata.user_name,
        avatar_url: user?.user_metadata.avatar_url,
        created_at: new Date().toISOString(),
      },
    };

    addMessage(newMessage as Imessage);
    setOptimisticIds(newMessage.id);

    const { error } = await supabase
      .from("messages")
      .insert({ text: trimmedText, id });

    if (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="p-5">
      <Input
        placeholder="Send message"
        onKeyDown={e => {
          if (e.key === "Enter") {
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
