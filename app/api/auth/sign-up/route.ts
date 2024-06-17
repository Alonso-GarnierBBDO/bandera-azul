import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){

    const data = await req.json();

    if(!data.email || !data.password || !data.name){
        return NextResponse.json({
            msg: "The email, password and name is required",
        }, { status: 400 });
    }

    const origin = headers().get("origin");
    const email = data.email;
    const password = data.password;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        console.log(error);
        return NextResponse.json({
            msg: "Error created the user"
        }, { status: 400 });
    }

    return NextResponse.json({
        msg: "User created"
    }, { status: 200 });

}