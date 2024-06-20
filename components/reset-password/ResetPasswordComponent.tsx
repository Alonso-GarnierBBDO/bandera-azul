"use client";

import { createClient } from "@/utils/supabase/client";
import HeaderComponent from "@/components/auth/HeaderComponent";
import FooterComponent from "@/components/auth/FooterComponent";
import InputsJson from '@/json/auth/new-password.json';
import { InputSignInInterface, FormResponseInterface } from '@/helper/interfaces/interface';
import { FormEvent, useEffect, useRef, useState, type ComponentProps } from 'react';
import FormComponent from "@/components/public/FormComponents";
import validateFormHelper from "@/helper/form/validate";
import SpinnerLoadingComponent from "@/components/public/SpinnerLoadingComponent";
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import showNotify from "@/helper/notify/show";
import { useRouter } from "next/navigation"
import Link from 'next/link';


export default function ResetPasswordComponent() {


  const router = useRouter()
  const inputs : InputSignInInterface[] = InputsJson as InputSignInInterface[]
  const inputsRef = useRef<(any | null)[]>([]);
  const [disabledForm, setDisabledForm] = useState(false);

  const supabase = createClient();

  supabase.auth.onAuthStateChange(async (event, session) => {
    if(event == "SIGNED_IN"){
      router.push("/protected")
    }
  })

  const validateForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(validateFormHelper(inputsRef)){
      setDisabledForm(true);

      setDisabledForm(false);

    }

  }

  return (
    <div className="auth sign-in">
      <HeaderComponent/>
      <main className="content-responsive">
        <h1>Ingrese su nueva contraseña</h1>
        <form onSubmit={validateForm}>
          {
              inputs.map( ( e : InputSignInInterface, key: number ) => {
                  return (
                      <FormComponent 
                          ref={(el) => {
                              inputsRef.current[key] = el
                          }}
                          key={key} 
                          name={e.name} 
                          type={e.type} 
                          placeholder={e.placeholder}
                          verify={e.verify}
                          required={e.required}
                          disabled={disabledForm}
                      />
                  )
              })
          }
          <section className='group_buttons'>
            <button type="submit" disabled={disabledForm}>
                {
                    disabledForm ? 'Cambiando contraseña' : 'Cambiar contraseña'
                }
                {
                    disabledForm == true? <SpinnerLoadingComponent/> : <ChevronRightIcon className="icon animation"/>
                }
            </button>
            <Link className='button' href='/login'>
                Iniciar sesión
            </Link>
          </section>
        </form>
      </main>
      <FooterComponent/>
    </div>
  );
}
