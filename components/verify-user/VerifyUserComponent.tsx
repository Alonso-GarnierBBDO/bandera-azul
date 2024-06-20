"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import HeaderComponent from "../auth/HeaderComponent";
import FooterComponent from "../auth/FooterComponent";
import ResetPasswordComponent from "../reset-password/ResetPasswordComponent";



export default function VerifyComponentUser() {

  const [type, setType] = useState('');
  const router = useRouter()

  const supabase = createClient();

  supabase.auth.onAuthStateChange(async (event, session) => {
    setType(event);
    console.log(event);
    if(event == "SIGNED_IN"){
      router.push("/protected")
    }
    
  })

  return (
    <div>
      {
        (!type || type == 'SIGNED_IN') && <VerifyUserComponent/>
      }

      {
        type == 'PASSWORD_RECOVERY' && <ResetPasswordComponent  />
      }
    </div>
  );
}


const VerifyUserComponent = () => {

  return (
    <>
      <div className="auth sign-in">
        <HeaderComponent/>
        <main className="content-responsive">
          <h1 style={
            {
              textAlign: 'center'
            }
          }>Verificando usuario...</h1>
        </main>
        <footer></footer>
      </div>
    </>
  )

}