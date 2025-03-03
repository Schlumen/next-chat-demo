"use client";

import { Imessage, useMessage } from "@/lib/store/messages";
import Message from "./message";
import { DeleteAlert, EditAlert } from "./message-actions";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";
import LoadMoreMessages from "./load-more-messages";

export default function ListMessages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);
  const {
    messages,
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessage(state => state);
  const supabase = supabaseBrowser();

  const scrollContainer = scrollRef.current;

  const scrollDown = useCallback(() => {
    if (!scrollContainer) return;
    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
    setNotification(0);
  }, [scrollContainer]);

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

            if (!scrollContainer) return;
            const isScroll =
              scrollContainer.scrollTop <
              scrollContainer.scrollHeight - scrollContainer.clientHeight - 150;
            if (isScroll) {
              setNotification(prev => prev + 1);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        payload => {
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        payload => {
          optimisticUpdateMessage(payload.new as Imessage);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [
    addMessage,
    supabase,
    messages,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
    scrollContainer,
  ]);

  useEffect(() => {
    if (scrollContainer && messages.length > 0 && !userScrolled) {
      if (hasLoaded) {
        scrollDown();
      } else {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        setHasLoaded(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, hasLoaded, scrollContainer]);

  const handleOnScroll = () => {
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 150;
      setUserScrolled(isScroll);

      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotification(0);
      }
    }
  };

  return (
    <div
      className="flex-1 flex flex-col p-5 h-full overflow-y-auto gap-y-5"
      ref={scrollRef}
      onScroll={handleOnScroll}
    >
      <div className="flex-1">
        <LoadMoreMessages />
      </div>
      <div className="space-y-5">
        {messages.map((value, index) => (
          <Message key={index} message={value} />
        ))}
      </div>
      {userScrolled && (
        <div className="absolute bottom-20 left-0 right-0">
          {notification ? (
            <div
              className="w-fit bg-primary py-1 px-2 rounded-md cursor-pointer hover:scale-110 transition-all mx-auto"
              onClick={scrollDown}
            >
              <p>{`${notification} new message${
                notification > 1 ? "s" : ""
              }`}</p>
            </div>
          ) : (
            <div
              className="w-10 h-10 bg-primary rounded-full mx-auto flex items-center justify-center border cursor-pointer hover:scale-110 transition-all"
              onClick={scrollDown}
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}
      <DeleteAlert />
      <EditAlert />
    </div>
  );
}
