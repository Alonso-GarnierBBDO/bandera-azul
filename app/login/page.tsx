import { createClient } from "@/utils/supabase/server";
import { FormComponentLogin } from "./formComponent";
import HeaderComponent from "@/components/auth/HeaderComponent";
import FooterComponent from "@/components/auth/FooterComponent";

export default function Login( { searchParams }: { searchParams: { message: string }; } ) {


  const signIn = async (formData: FormData) => {
    "use server";

    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        let message = error.message;
        
        if(message == 'Invalid login credentials'){
          message = 'El usuario no coincide con nuestras credenciales'
        }

        return { status: false, msg: message };
      }

      return { status: true, msg: "Autenticación exitosa" };
    } catch (error) {
      console.error("Error en la autenticación:", error);
      return { status: false, msg: "Error en la autenticación" };
    }
  };

  return (
    <div className="auth sign-in">
      <HeaderComponent/>
      <main className="content-responsive">
        <h1>Iniciar sesión</h1>
        <FormComponentLogin
            formAction={signIn}
            className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
            pendingText="Signing In..."
          >
        </FormComponentLogin>
      </main>
      <FooterComponent/>
    </div>
  );
}
