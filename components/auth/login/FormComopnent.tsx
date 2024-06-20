'use client';
import FormComponent from '@/components/public/FormComponents';
import { InputSignInInterface } from '@/helper/interfaces/interface';
import InputsJson from '@/json/auth/sign-in.json';
import { useRef, useState } from 'react';

const AllInputsComponent = () => {

    const inputs : InputSignInInterface[] = InputsJson as InputSignInInterface[]
    const inputsRef = useRef<(any | null)[]>([]);
    const [disabledForm, setDisabledForm] = useState(false);

    return (
        <>
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
        </>
    )

}

export default AllInputsComponent;