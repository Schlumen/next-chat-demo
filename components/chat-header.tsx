"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "./ui/button";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function ChatHeader({ user }: { user: User | null }) {
  const router = useRouter();

  const handleLoginWithGithub = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="h-20">
      <div className="p-5 border-b flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-xl font-bold">Daily Chat</h1>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-zinc-400">2 online</p>
          </div>
        </div>
        {user ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button onClick={handleLoginWithGithub}>Login</Button>
        )}
      </div>
    </div>
  );
}
