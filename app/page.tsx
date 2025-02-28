import ChatHeader from "@/components/chat-header";
import ChatInput from "@/components/chat-input";
import InitUser from "@/lib/store/init-user";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col">
          <ChatHeader user={data.user} />
          <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto">
            <div className="flex-1"></div>
            <div className="space-y-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex gap-2">
                  <div className="h-10 w-10 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <h1 className="font-bold">Schlumen</h1>
                      <h1 className="text-sm text-zinc-400">
                        {new Date().toDateString()}
                      </h1>
                    </div>
                    <p className="text-zinc-300">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Natus error similique quas deleniti veniam enim ab,
                      minima, dicta impedit itaque repellat debitis quis odio
                      rem praesentium omnis officiis molestias. Corporis!{" "}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ChatInput />
        </div>
      </div>
      <InitUser user={data.user} />
    </>
  );
}
