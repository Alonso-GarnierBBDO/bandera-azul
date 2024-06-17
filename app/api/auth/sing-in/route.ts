import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){

    const data = await req.json();

    if(!data.email || !data.password){
        return NextResponse.json({
            msg: "The email, password and name is required",
        }, { status: 400 });
    }

    const origin = headers().get("origin");
    const email = data.email;
    const password = data.password;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect("/login?message=Could not authenticate user");
    }
  
    return redirect("/protected");

    // return NextResponse.json({
    //     msg: "User created"
    // }, { status: 200 });

}