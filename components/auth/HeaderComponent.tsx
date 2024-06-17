import Image from "next/image";
import GarnierLogo from "@/assets/img/garnier_logo.png";
import Link from "next/link";
import NotifyComponent from "../notify/NotifyComponent";


const HeaderComponent = () => {
    return (
        <>
            <NotifyComponent/>
            <header>
                <Link href="/">
                    <Image src={GarnierLogo} width={GarnierLogo.width} height={GarnierLogo.height} alt="Garnier BBDO"/>
                </Link>
            </header>
        </>
    )
}

export default HeaderComponent;