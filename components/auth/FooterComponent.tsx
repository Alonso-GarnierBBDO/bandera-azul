'use client';

import Image from "next/image";
import MicrosoftLogin from "@/assets/img/microsoft_logo.png";

const FooterComponent = () => {

    const login_microsoft = () => {
        alert("Login Microsoft");
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