'use client';

import FooterComponent from "@/components/auth/FooterComponent";
import HeaderComponent from "@/components/auth/HeaderComponent";
import SignUpInputsJSON from  "@/json/auth/sign-up.json";
import { FormSignInInterface, InputSignInInterface } from "@/helper/interfaces/interface";
import FormComponent from "@/components/public/FormComponents";
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { FormEvent, useRef, useState } from "react";
import validateFormHelper from "@/helper/form/validate";
import dataForm, { clearInput } from "@/helper/form/data";
import SpinnerLoadingComponent from "@/components/public/SpinnerLoadingComponent";
import showNotify from '@/helper/notify/show';



const SignUp = () => {

    const inputs : InputSignInInterface[] = SignUpInputsJSON as InputSignInInterface[];
    const inputsRef = useRef<(any | null)[]>([]);
    const [disabledForm, setDisabledForm] = useState(false);
    

    const validateForm = async (e : FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if(validateFormHelper(inputsRef)){
            setDisabledForm(true);
            const data : FormSignInInterface = dataForm(inputs)
            
            const response = await fetch(`api/auth/sign-up`, {
                method: "POST",
                body: JSON.stringify({
                    "email": data.email,
                   "password": data.password,
                    "name": `${data.name} ${data.last_name}`
                })
            })

            if(response.status == 200){
                showNotify('successful', 'Te has registrado con éxito. Por favor, revisa tu correo electrónico para verificar tu cuenta.');
            }else{
                showNotify('danger', 'No se pudo completar tu registro. Por favor, intenta nuevamente más tarde o contacta a soporte si el problema persiste.');
            }

            clearInput(inputs, inputsRef);

            setDisabledForm(false);

        }

    }

    return (
        <div className="auth sign-in">
            <HeaderComponent/>
            <main className="content-responsive">
                <h1>Create una cuenta</h1>
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
                    <button type="submit" disabled={disabledForm}>
                        {
                            disabledForm ? 'Signing up' : 'Sign up'
                        }
                        {
                            disabledForm == true? <SpinnerLoadingComponent/> : <ChevronRightIcon className="icon animation"/>
                        }
                    </button>
                </form>
            </main>
            <FooterComponent/>
        </div>
    )

}

export default SignUp;