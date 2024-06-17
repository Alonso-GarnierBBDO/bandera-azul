const validateFormHelper = (inputsRef: any) : boolean => {

    let send = true;

    if(inputsRef && inputsRef.current){
        inputsRef.current.forEach((ref : any) => {
            if(ref){
                let getRequired = ref.validateInput('');
                if(!getRequired){
                    send = getRequired;
                }
            }
        });
    }

    return send;

}

export default validateFormHelper;