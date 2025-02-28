import { Suspense } from "react";
import ListMessages from "./list-messages";
import { supabaseServer } from "@/lib/supabase/server";
import InitMessages from "@/lib/store/init-messages";

export default async function ChatMessages() {
  const supabase = await supabaseServer();

  const { data } = await supabase.from("messages").select("*,users(*)");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListMessages />
      <InitMessages messages={data || []} />
    </Suspense>
  );
}
