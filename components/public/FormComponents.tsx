'use client';

import { InputSignInInterface } from "@/helper/interfaces/interface";
import { FormEvent, forwardRef, useImperativeHandle, useState } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { InputType } from "@/helper/types/types";

const FormComponent = forwardRef(({ name, type, placeholder, verify, required, disabled } : InputSignInInterface, ref) => {

    const [newType, setNewType] = useState<InputType>(type);
    const [errorText, setErrorText] = useState<string>('');
    const [passwordValidate, setPasswordValidate] = useState<string>('')
    const [saveValue, setSaveValue] = useState<string>('')
    const [showPasswordValidation, setShowPasswordValidation] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        validateInput,
        clearValidateInput
    }));

    const clearValidateInput = () => {
        setShowPasswordValidation(false);
    }

    const validateInput = (e : FormEvent<HTMLInputElement> | string) : boolean => {

        let value = '';

        if(typeof e == 'object'){
            const tag : HTMLInputElement = e.target as HTMLInputElement;
            value = tag.value;
        }else{
            value = saveValue;
        }

        if(value){
            setShowPasswordValidation(true);
        }else{
            setShowPasswordValidation(false);
        }

        setSaveValue(value);
        
        

        /**
         * Validamos si el data es requerido
         */
        if(!value && required){
            setErrorText(`El campo "${placeholder}" es requerido`)
            setPasswordValidate('');
            return false;
        }else{
            if(verify){

                if(type == 'email'){
                    if(!validateEmail(value)){
                        setErrorText(`El ${placeholder} no es valido`)
                        return false;
                    }
                }else if(name == 'repeat_password'){
                    const inputPassword : HTMLInputElement | null = document.querySelector('form input[name="password"]');

                    if(inputPassword){
                        if(value !== inputPassword.value){
                            setErrorText(`La contraseña no coincide`)
                            return false;
                        }
                    }

                }else if(type == 'password'){
                    setErrorText('');
                    const password = statePassword(value);
                    setPasswordValidate(password);
                    if(password !== 'strong'){
                        return false;
                    }
                }

            }
            setErrorText('')
        }

        return true;
    }

    const statePassword = (value: string) : string => {

        const strongPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
        const mediumPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])((?=.*[0-9])|(?=.*[^A-Za-z0-9]))(?=.{6,})');

        if (strongPattern.test(value)) {
            return "strong";
        } else if (mediumPattern.test(value)) {
            return "medium";
        } else {
            return "weak";
        }
    }

    const validateEmail = (email : string) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    };

    const showPassword = () => {
        if(newType == 'password'){
            setNewType('text');
        }else{
            setNewType('password');
        }
    }

    return (
        <div>
            <label htmlFor={name}>
                <input 
                    type={newType} 
                    name={name}
                    id={name} 
                    placeholder=" "
                    onInput={validateInput}
                    disabled={disabled}
                />
                <span className="placeholder">{ placeholder }</span>
                {
                    type == 'password' && (
                        <button type="button" className="show" onClick={showPassword}> 
                            {
                                newType == 'password' ? <EyeIcon className="icon static"/>  : <EyeSlashIcon className="icon static"/>
                            }
                        </button>
                    )
                }
            </label>

            {
                errorText && <span className="error">{errorText}</span>
            }

            {
                (name == 'password' && verify && passwordValidate && !disabled && showPasswordValidation) && (
                    <div className="password_state">
                        <span className="indicator">
                            <hr className={`percentage ${passwordValidate}`} style={{
                                width: `${ passwordValidate == 'weak' ? 25 : passwordValidate == 'medium' ? 50 : passwordValidate == 'strong' ? 100 : 0 }%`
                            }}/>
                        </span>
                        <p className={passwordValidate}>
                            {
                                passwordValidate == 'weak' ? 'Débil' : passwordValidate == 'medium' ? 'Regular' : passwordValidate == 'strong' ? 'Fuerte' : ''
                            }
                        </p>
                    </div>
                )
            }

        </div>
    );
});

FormComponent.displayName = "FormComponent";

export default FormComponent;
