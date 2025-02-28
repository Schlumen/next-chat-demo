import ChatHeader from "@/components/chat-header";
import InitUser from "@/lib/store/init-user";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md">
          <ChatHeader user={data.user} />
        </div>
      </div>
      <InitUser user={data.user} />
    </>
  );
}
