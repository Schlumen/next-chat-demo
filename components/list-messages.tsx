"use client";

import { useMessage } from "@/lib/store/messages";
import Message from "./message";

export default function ListMessages() {
  const messages = useMessage(state => state.messages);

  return (
    <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto">
      <div className="flex-1"></div>
      <div className="space-y-5">
        {messages.map((value, index) => (
          <Message key={index} message={value} />
        ))}
      </div>
    </div>
  );
}
