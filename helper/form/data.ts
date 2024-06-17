
const dataForm = (inputs : any) => {

    const data : any = {}

    inputs.forEach((e : any) => {
        const input : HTMLInputElement | null = document.querySelector(`input[name="${e.name}"]`)
        if(input){
            data[e.name] = input.value;
        }
    });

    return data;

}

const clearInput = (inputs : any, inputsRef: any) => {

    inputs.forEach((e : any) => {
        const input : HTMLInputElement | null = document.querySelector(`input[name="${e.name}"]`)
        if(input){
            input.value = ''
        }
    });

    if(inputsRef && inputsRef.current){
        inputsRef.current.forEach((ref : any) => {
            if(ref){
               ref.clearValidateInput();
            }
        });
    }

    
}

export {
    clearInput
}

export default dataForm;