"use client";

import { Imessage, useMessage } from "@/lib/store/messages";
import Message from "./message";
import { DeleteAlert, EditAlert } from "./message-actions";
import { useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";

export default function ListMessages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { messages, addMessage, optimisticIds } = useMessage(state => state);
  const supabase = supabaseBrowser();

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async payload => {
          if (optimisticIds.includes(payload.new.id)) return;
          const { error, data } = await supabase
            .from("users")
            .select("*")
            .eq("id", payload.new.send_by)
            .single();

          if (error) {
            toast.error("Error getting user");
            return;
          } else {
            const newMessage = {
              ...payload.new,
              users: data,
            };

            addMessage(newMessage as Imessage);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [addMessage, supabase, messages, optimisticIds]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer && messages.length > 0) {
      if (hasLoaded) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      } else {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        setHasLoaded(true);
      }
    }
  }, [messages, hasLoaded]);

  return (
    <div
      className="flex-1 flex flex-col p-5 h-full overflow-y-auto"
      ref={scrollRef}
    >
      <div className="flex-1"></div>
      <div className="space-y-5">
        {messages.map((value, index) => (
          <Message key={index} message={value} />
        ))}
      </div>
      <DeleteAlert />
      <EditAlert />
    </div>
  );
}
