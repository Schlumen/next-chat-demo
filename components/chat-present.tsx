"use client";

import { useUser } from "@/lib/store/user";
import { supabaseBrowser } from "@/lib/supabase/browser";
import React, { useEffect, useState } from "react";

export default function ChatPresent() {
  const user = useUser(state => state.user);
  const supabase = supabaseBrowser();
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const channel = supabase.channel("room1");
    channel
      .on("presence", { event: "sync" }, () => {
        const userIds = [];
        for (const id in channel.presenceState()) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          userIds.push(channel.presenceState()[id][0].user_id);
        }

        setOnlineUsers([...new Set(userIds)].filter(id => !!id).length);
      })
      .subscribe(async status => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          });
        }
      });
  }, [user, supabase]);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse"></div>
        <p className="text-sm text-zinc-400">Offline, please log in</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
      <p className="text-sm text-zinc-400">{onlineUsers} online</p>
    </div>
  );
}
