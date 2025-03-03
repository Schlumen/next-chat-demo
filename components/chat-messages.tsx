import { Suspense } from "react";
import ListMessages from "./list-messages";
import { supabaseServer } from "@/lib/supabase/server";
import InitMessages from "@/lib/store/init-messages";
import { LIMIT_MESSAGES } from "@/lib/constants";

export default async function ChatMessages() {
  const supabase = await supabaseServer();

  const { data } = await supabase
    .from("messages")
    .select("*,users(*)")
    .range(0, LIMIT_MESSAGES)
    .order("created_at", { ascending: false });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListMessages />
      <InitMessages messages={data?.reverse() || []} />
    </Suspense>
  );
}
