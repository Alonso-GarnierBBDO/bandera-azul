import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ChatComponent from "@/components/protected/ChatComponent";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="body">
      <div className="profile_content">

      </div>
      <div className="content">
        <ChatComponent/>
      </div>
    </div>
  );
}
