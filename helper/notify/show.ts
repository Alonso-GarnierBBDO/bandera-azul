import { NotifyType } from "../types/types";

const showNotify = (type : NotifyType, message: string) => {
    
    const notify : HTMLElement | null = document.querySelector('.all_notify');
    if(notify){
        if(notify.classList.contains('show')){
            notify.classList.remove('show');   
            setTimeout(() => {
                configNotify(type, message, notify)
                notify.classList.add('show');
            }, 500);
        }else{
            configNotify(type, message, notify)
            notify.classList.add('show');
        }

        notify.onclick = () => {
            notify.classList.remove('show');
        }
    }

}

const configNotify = (type : NotifyType, message: string, tag: HTMLElement) => {

    if(type == 'warning'){
        tag.style.background = "rgb(149, 217, 3)";
    }else if(type == 'danger'){
        tag.style.background = "rgb(246, 43, 43)";
    }else{
        tag.style.background = "rgb(46, 192, 46)";
    }

    const text : HTMLParagraphElement | null = tag.querySelector('p');

    if(text){
        text.textContent = message;
    }

}

export default showNotify;