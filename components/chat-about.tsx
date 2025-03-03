export default function ChatAbout() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-5">
        <p className="text-3xl font-bold">Welcome to Daily Chat</p>
        <p className="w-96">
          This is a chat application powered by Supabase realtime DB. Login to
          send messages.
        </p>
      </div>
    </div>
  );
}
