import { createClient } from "@/utils/supabase/server";
import { FormComponentLogin } from "./formComponent";
import HeaderComponent from "@/components/auth/HeaderComponent";
import FooterComponent from "@/components/auth/FooterComponent";

export default function Login( { searchParams }: { searchParams: { message: string }; } ) {


  const reset = async (formData: FormData) => {
    "use server";

    try {
      const email = formData.get("email") as string;
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { status: false, msg: error.message };
      }

      return { status: true, msg: "El correo electrónico para restablecer la contraseña se envió con éxito" };
    } catch (error) {
      console.error("Error en la autenticación:", error);
      return { status: false, msg: "El correo para restablecer la contraseña no se pudo enviar." };
    }
  };

  return (
    <div className="auth sign-in">
      <HeaderComponent/>
      <main className="content-responsive">
        <h1>Enviar correo de reseteo</h1>
        <FormComponentLogin
            formAction={reset}
            className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
            pendingText="Signing In..."
          >
            Sign In
        </FormComponentLogin>
      </main>
      <FooterComponent/>
    </div>
  );
}
