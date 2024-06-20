import { InputSizeType, InputType } from "../types/types"

export interface InputSignInInterface {
    type: InputType,
    placeholder: string,
    name: string,
    size?: InputSizeType,
    required?: boolean,
    verify?: boolean
    disabled?: boolean
}

export interface FormSignInInterface {
    email: string, 
    last_name: string, 
    name: string, 
    password: string, 
    repeat_password: string
}

export interface FormResponseInterface {
    status: boolean,
    msg: string;
}