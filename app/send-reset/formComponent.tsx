"use client";

import InputsJson from '@/json/auth/reset.json';
import { InputSignInInterface, FormResponseInterface } from '@/helper/interfaces/interface';
import { FormEvent, useRef, useState, type ComponentProps } from 'react';
import FormComponent from "@/components/public/FormComponents";
import validateFormHelper from "@/helper/form/validate";
import SpinnerLoadingComponent from "@/components/public/SpinnerLoadingComponent";
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import showNotify from "@/helper/notify/show";
import { useRouter } from "next/navigation"
import Link from 'next/link';


type Props = ComponentProps<"button"> & {
  pendingText?: string,
  formAction: (formData: FormData) => Promise<FormResponseInterface>;
};

export function FormComponentLogin({ children, pendingText, formAction, ...props }: Props) {

  const router = useRouter()
  const inputs : InputSignInInterface[] = InputsJson as InputSignInInterface[]
  const inputsRef = useRef<(any | null)[]>([]);
  const [disabledForm, setDisabledForm] = useState(false);
  

  const validateForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(validateFormHelper(inputsRef)){
      setDisabledForm(true);
      const response : FormResponseInterface =  await formAction(new FormData(e.currentTarget)) as FormResponseInterface;
      if(response.status){
        showNotify('successful', response.msg)
      }else{
        showNotify('danger', response.msg)
      }

      setDisabledForm(false);

    }

  }

  return (
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
                disabledForm ? 'Enviando correo' : 'Enviar correo'
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
  );
}
