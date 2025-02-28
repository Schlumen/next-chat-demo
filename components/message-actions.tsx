"use client";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMessage } from "@/lib/store/messages";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

export function DeleteAlert() {
  const actionMessage = useMessage(state => state.actionMessage);
  const optimisticDeleteMessage = useMessage(
    state => state.optimisticDeleteMessage
  );

  const handleDeleteMessage = async () => {
    if (!actionMessage) return;
    const supabase = supabaseBrowser();

    optimisticDeleteMessage(actionMessage.id);

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", actionMessage.id);

    if (error) {
      toast.error("Failed to delete message");
    } else {
      toast.success("Message deleted successfully");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            message and remove it from our servers:
            <br />
            <br />
            {actionMessage?.text}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function EditAlert() {
  const actionMessage = useMessage(state => state.actionMessage);
  const optimisticUpdateMessage = useMessage(
    state => state.optimisticUpdateMessage
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditMessage = async () => {
    if (!actionMessage) return;
    const supabase = supabaseBrowser();

    const text = inputRef.current?.value.trim();

    if (!text || text === "") {
      document.getElementById("trigger-edit")?.click();
      document.getElementById("trigger-delete")?.click();
      return;
    }

    optimisticUpdateMessage({ ...actionMessage, text, is_edit: true });

    const { error } = await supabase
      .from("messages")
      .update({ text, is_edit: true })
      .eq("id", actionMessage.id);

    if (error) {
      toast.error("Failed to edit message");
    } else {
      toast.success("Message updated successfully");
      document.getElementById("trigger-edit")?.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="trigger-edit" />
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edit message</DialogTitle>
          <DialogDescription>
            Make changes to your message here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <Input defaultValue={actionMessage?.text} ref={inputRef} />
        <DialogFooter>
          <Button type="submit" onClick={handleEditMessage}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
