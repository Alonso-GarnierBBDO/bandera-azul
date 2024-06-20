import { createClient } from "@/utils/supabase/server";
import ResetTemplate from '@/components/verify-user/VerifyUserComponent';
import { redirect } from "next/navigation";


export default async function Index({params, searchParams} : { params: { slug: string }, searchParams?: { [key: string]: string | string[] | undefined }; }) {


  const canInitSupabaseClient = () => {
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  if(!searchParams?.code){
    redirect('/login')
  }

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div>
      {searchParams?.code ? <ResetTemplate/> : ''}
    </div>
  );
}
