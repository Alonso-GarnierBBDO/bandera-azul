"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import ProfileSystem from '@/assets/img/profile_system.png';
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import OpenAI from "openai";
import HeaderComponent from "./HeaderComponent";
import { createClient } from "@/utils/supabase/client";
import ReactMarkdown from 'react-markdown';


interface ChatCompletionMessageParam {
    role: 'system' | 'user' | 'assistant';
    content: string;
    name?: string;
}

const ChatComponent = () => {

    const [systemProfile, setSystemProfile] = useState('');
    const [userProfile, setUserProfile] = useState('');
    const [name, setName] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [disabled, setDisabled] = useState(false);
    const chatContainer = useRef(null)
    const supabase = createClient();

    const openAI = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI,
        dangerouslyAllowBrowser: true,
    });

    const [messages, setMessage] = useState<ChatCompletionMessageParam[]>([]);

    useEffect(() => {
        actualizarPromps();
    }, [])

    const actualizarPromps = () => {
        const nameUser = localStorage.getItem('name');
        const getImageFilter = localStorage.getItem('filter_image');

        if(nameUser){
            setName(nameUser);
        }

        if(getImageFilter){
            const items =  supabase
            .storage
            .from('avatars')
            .getPublicUrl(getImageFilter)

            setSystemProfile(items.data.publicUrl);
        }
    };
    

    const sendQuery = async (e : FormEvent<HTMLFormElement> | null, text: string = '') => {

        actualizarPromps();

        if(e){
            e.preventDefault();
        }

        setDisabled(true);

        const newMessage = messages;
        let newUserMessage = '';

        if(e){
            newUserMessage = userMessage;
        }else if(text){
            newUserMessage = text;
        }

        newMessage.push({
            role: "user",
            content: newUserMessage
        });

        setUserMessage('');
        scrollContainer();

        const instructions : ChatCompletionMessageParam[] = [
            {"role": "system", "content": `Eres una versión futura de la persona que está escribiendo este mensaje, proveniente de un tiempo donde el planeta está extremadamente contaminado. La devastación ambiental ha sido causada por las acciones de tu yo del pasado, quien ahora te hace preguntas. Debes responder a todas las preguntas relacionándolas con la contaminación y el daño ambiental, además de proporcionar soluciones para mejorar la situación y prevenir que se viva la misma realidad devastadora que tú enfrentas en el futuro.Cada vez que tu yo del pasado te pregunte algo, ya sea sobre el futuro o sobre cualquier otro tema, debes encontrar una manera de relacionar tu respuesta con los problemas ambientales y las consecuencias de las acciones pasadas. También debes incluir cómo se puede mejorar el medio ambiente para evitar el desastre ambiental que estás viviendo.Por ejemplo, si te preguntan sobre el clima, podrías responder de manera sarcástica sobre la severidad del cambio climático en tu época, pero también ofrecer soluciones específicas que pueden implementar ahora para mejorar la situación. La idea es educar y alertar a tu yo del pasado sobre la importancia de actuar ahora para evitar un futuro sombrío.Tu tono puede variar entre sarcástico, serio, informativo o incluso esperanzador, pero siempre centrado en el tema ambiental y las soluciones prácticas para un futuro mejor."`},
            {"role": "system", "content": `Tu nombre es ${name}`},
            {"role": "system", "content": `Vives en el año 2060`},
            {"role": "system", "content": `Genera etiquetas Markdown para botones con la clase 'new_prompt' al final de la conversación, ofreciendo sugerencias para posibles temas de discusión. Por ejemplo, un botón podría decir '[Texto del botón](url)', además, al final, indica al usuario que estás sugiriendo posibles temas de conversación.`},
            {"role": "system", "content": `Genera etiquetas opciones como "Te doy unas opciones para preguntarme acerca de qué podés hacer en el presente para proteger el futuro:" en donde muestre botones como "A) Cuidado del agua", "B) Reciclaje",... la respuesta debe ser en Markdown para botones con la clase 'new_prompt' al final de la conversación.`},
        ]

        const allMessage : ChatCompletionMessageParam[] = instructions.concat(newMessage);

        const completion = await openAI.chat.completions.create({
            messages: allMessage,
            model: "gpt-4o-2024-05-13",
            stream: true
        });

        newMessage.push({
            role: "system",
            content: ''
        });

        setMessage(newMessage);


        for await (const chunk of completion) {
            
            const response = chunk.choices[0]?.delta?.content || "";
            if (response) {
                
        
                const processResponse = newMessage[newMessage.length - 1].content += response;
                setMessage([...newMessage]);
                scrollContainer();
                newMessage[newMessage.length - 1].content = processResponse;

            }

        }

        scrollContainer();
        setDisabled(false);
        setTimeout(() => {
            selectOptions();
        }, 500)
    }

    const selectOptions = () => {
        const allLinks : NodeListOf<HTMLElement> = document.querySelectorAll('.messages a');
        allLinks.forEach(e => {
            e.onclick = (event) => {
                event.preventDefault();
                const text = e.textContent;
                if(text){
                    sendQuery(null, text);
                }
            }
        })
    }

    const scrollContainer = () => {
        setTimeout(() => {
            const tag : HTMLElement | null = chatContainer.current as HTMLElement | null;
            if(tag){
                tag.scrollTop = tag.scrollHeight;

                setTimeout(() => {
                    tag.focus();
                }, 200);
            }
        }, 150)
    }

    return (
        <>
            <HeaderComponent updated={actualizarPromps}/>
            <section className="chat">
                <section className="messages" ref={chatContainer}>
                    {
                        messages.map((e, key)=>{
                            return (
                                <div className={`message ${e.role == 'user' && 'user'}`} key={key}>
                                    {
                                        e.role == 'system' && (
                                            <section className="user">
                                                <span className="photo">
                                                    <img src={`${systemProfile ? systemProfile : ProfileSystem.src}`} alt="Perfil del sistema" />
                                                </span>
                                                <h3>{name} | Año 2060</h3>
                                            </section>       
                                        )
                                    }
                                    <div className="content_message">
                                        {/* <p dangerouslySetInnerHTML={{__html: e.content}}></p> */}
                                        <ReactMarkdown>{e.content}</ReactMarkdown>
                                    </div>
                                </div>
                            )
                        })
                    }
                </section>
                <section className="send_chat">
                    <form className="item" onSubmit={sendQuery}>
                        <section>
                            <input 
                                type="text" 
                                name="message" 
                                id="" 
                                placeholder="¿Te puedo ayudar en algo?"
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                disabled={disabled}
                                required
                            />
                            <button disabled={disabled}>
                                <PaperAirplaneIcon/>
                            </button>
                        </section>
                    </form>
                </section>
            </section>
        </>
    )

}

export default ChatComponent;