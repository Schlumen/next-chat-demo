import { Imessage, useMessage } from "@/lib/store/messages";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/lib/store/user";

export default function Message({ message }: { message: Imessage }) {
  const user = useUser(state => state.user);

  return (
    <div className="flex gap-2 align-top">
      <div>
        <Image
          src={message.users?.avatar_url}
          alt={message.users?.display_name}
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <p className="font-bold">{message.users?.display_name}</p>
            <p className="text-sm text-zinc-400">
              {new Date(message.created_at).toDateString()}
            </p>
            {message.is_edit && (
              <span className="text-sm text-muted-foreground">(edited)</span>
            )}
          </div>
          {message.users.id === user?.id && <MessageMenu message={message} />}
        </div>
        <p className="text-zinc-300">{message.text}</p>
      </div>
    </div>
  );
}

const MessageMenu = ({ message }: { message: Imessage }) => {
  const setActionMessage = useMessage(state => state.setActionMessage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-edit")?.click();
            setActionMessage(message);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-delete")?.click();
            setActionMessage(message);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
