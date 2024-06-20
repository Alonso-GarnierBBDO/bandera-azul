'use client';

import Image from "next/image";
import MicrosoftLogin from "@/assets/img/microsoft_logo.png";
import { createClient } from "@/utils/supabase/client";

const FooterComponent = () => {

    const login_microsoft = async () => {
        const supabase = createClient();

        const response = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
                scopes: 'email'
            }
        });

        console.log(response)

    }

    return (
        <footer>
            <button type="button" onClick={login_microsoft}>
                Ingresá con
                <Image src={MicrosoftLogin.src} width={MicrosoftLogin.width} height={MicrosoftLogin.height} alt="Microsoft Logo"/>
            </button>
        </footer>
    )
}

export default FooterComponent;