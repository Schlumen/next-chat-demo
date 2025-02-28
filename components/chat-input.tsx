"use client";

import React from "react";
import { Input } from "./ui/input";

export default function ChatInput() {
  const handleSendMessage = (text: string) => {
    console.log(text);
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
