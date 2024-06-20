'use client'

import { createClient } from "@/utils/supabase/client";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import NotifyComponent from "../notify/NotifyComponent";
import showNotify from "@/helper/notify/show";
import Image from "next/image";
import Profile from '@/assets/img/profile.webp';
import SpinnerLoadingComponent from "../public/SpinnerLoadingComponent";
import { useRouter } from "next/navigation"
import OpenAI from "openai";

const HeaderComponent = ({ updated } : { updated: () => void }) => {

  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setID] = useState('');
  const [image, setImage] = useState('');
  const [nameValid, setNameValid] = useState(false);
  const [disabledForm, setDisabledForm] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const openAI = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI,
    dangerouslyAllowBrowser: true,
});

  const showProfile = () => {
    if(show){
      if(nameValid){
        setShow(false)
      }
    }else{
      setShow(true);
    }
  }

  useEffect(() => {
    
    async function user(){
      const { data, error } = await supabase.auth.getUser()

      if(error){
        showNotify('danger', 'No se puede obtener los datos')
      }

      window.onkeydown = (e) =>{
        if(e.key == 'Escape'){
          setShow(false);
        }
      }
      
      if(data){

        const email = data.user?.email;
        const name = data.user?.user_metadata.full_name;
        const photo = data.user?.user_metadata.photo;
        const filter = data.user?.user_metadata.filter;
        const id = data.user?.id;

        if(email){
          setEmail(email)
        }

        if(name){
          setName(name);
          localStorage.setItem('name', name)
          setNameValid(true);
        }else{
          setShow(true);
        }

        if(filter){
          localStorage.setItem('filter_image', filter)
        }else{
          const getFilter = localStorage.getItem('filter_image');
          if(!getFilter){
            createFilter();
          }
        }

        if(id){
          setID(id);
        }

        if(photo){
          photoPath(photo)
        }
      }
    }

    user();
  }, [])

  const photoPath = (path: string) => {
    const items =  supabase
      .storage
      .from('avatars')
      .getPublicUrl(path)

    setImage(items.data.publicUrl)
  }
  

  const updateData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabledForm(true);

    const { data, error }  = await supabase.auth.updateUser({
      data: {
        full_name: name
      },
    })

    if(error){
      showNotify('danger', error.message)
    }

    if(data){
    await createFilter()
     setDisabledForm(false);
     localStorage.setItem('name', name)
     handleUpdate();
     showNotify('successful', 'Se actualizo el perfil')
     setNameValid(true);
    }
  }

  const handleUpdate = () => {
    updated();
  };

  const createFilter = async () => {



    const response = await openAI.images.generate({
      model: 'dall-e-2',
      prompt: `Genera la imagen de una persona anciana animada en 3D cuyo nombre es ${name}. Según el nombre proporcionado, determina si es un hombre o una mujer y ajusta la imagen en consecuencia.`,
      n: 1,
      size: '256x256',
      response_format: 'b64_json'
    });

    const image_url = response.data[0].b64_json;
    const newName = name.replace(' ', '_');
    const date = new Date()
    const nameFile = `${newName}_${id}_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}_${date.getSeconds()}_${date.getMilliseconds()}.png`;

    if(image_url){

      const file_filter = await base64ToFile(image_url, 'image.jpg', 'image/jpeg');

      const { data, error }  = await supabase.storage.from('avatars').upload(
        `filters/${nameFile}`, 
        file_filter, 
        {
          cacheControl: '3600',
          upsert: false
        }
      )

      let filter_path = data?.path;

      if(filter_path){

        await supabase.auth.updateUser({
          data: {
            filter: filter_path
          },
        })

        localStorage.setItem('filter_image', filter_path);

        handleUpdate();
        
      }

    }

  }

  async function base64ToFile(base64String: string, fileName: string, mimeType: string) {
    // Decodificar la cadena base64 a un ArrayBuffer
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
  
    // Crear un Blob a partir del ArrayBuffer
    const blob = new Blob([bytes], { type: mimeType });
  
    // Crear un archivo a partir del Blob
    const file = new File([blob], fileName, { type: mimeType });
    
    return file;
  }

  const uploadPhoto = async (e: ChangeEvent<HTMLInputElement>) => {

    setDisabledForm(true);

    

    let filter_path = '';
    const newName = name.replace(' ', '_');
    const date = new Date()
    const nameFile = `${newName}_${id}_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}_${date.getSeconds()}_${date.getMilliseconds()}.png`;


    const item : FileList | null = e.target.files;
    if(item?.length){

      const file = item[0];

      const { data, error } = await supabase.storage.from('avatars').upload(
        `photos/${nameFile}`, 
        file, 
        {
          cacheControl: '3600',
          upsert: false
        }
      )


      if(error){
        showNotify('danger', error.message)
      }

      if(data){

        await updatePhoto(data.path, filter_path)
        handleUpdate();
      }

    }

    setDisabledForm(false)
  }

  const updatePhoto = async (url: string, filter_path: string) => {

    photoPath(url);

    const { data, error }  = await supabase.auth.updateUser({
      data: {
        photo: url,
      },
    })

    if(error){
      showNotify('danger', error.message)
    }

    if(data){
     setDisabledForm(false);
     showNotify('successful', 'Se actualizo el perfil')
     handleUpdate();
    }
  }

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login')
  }

  return (
    <>
      <header>
        <h1>¡Hola { name }!</h1>
        <button onClick={showProfile} className="profile">
        {
          image ?  <img src={image} alt={`Foto de perfil de ${name}`} width={100} height={100}/> : <Image src={Profile.src} alt={`Foto de perfil de ${name}`} width={100} height={100}/>
        }
        </button>
      </header>

      {
        show && (
          <section className="profile-modal" onClick={showProfile}>
            <NotifyComponent/>
            <section className="content-modal" onClick={ e => e.stopPropagation()}>
              {
                nameValid && (
                  <button className="close_button" onClick={showProfile}>
                    <XMarkIcon width={100}/>
                  </button>
                )
              }
              <form action="profile_photo" onSubmit={updateData}>
                <label className="photo">
                  <span>
                    {
                     image ?  <img src={image} alt={`Foto de perfil de ${name}`} width={100} height={100}/> : <Image src={Profile.src} alt={`Foto de perfil de ${name}`} width={100} height={100}/>
                    }

                    {
                      disabledForm && <div className="loading"> <SpinnerLoadingComponent/> </div>
                    }

                  </span>
                  <input type="file" onChange={uploadPhoto} name="profile_photo" id="profile_photo" />
                </label>

                <div>
                  <label htmlFor="" className="transparent">
                    <input 
                      type="text" 
                      name="" 
                      id="" 
                      placeholder=" " 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={disabledForm}
                    />
                    <span className="placeholder">Nombre completo</span>
                  </label>
                </div>

                <div>
                  <label htmlFor="" className="transparent">
                    <input 
                      type="text" 
                      name="" 
                      id="" 
                      placeholder=" " 
                      disabled
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="placeholder">Correo electrónico</span>
                  </label>
                </div>
                <section className='group_buttons'>
                  <button type="submit" className="items_update" disabled={disabledForm}>
                      {
                          disabledForm ? 'Actualizando...' : 'Actualizar'
                      }
                  </button>
                  <button type="button" onClick={signOut}>Cerrar sesión</button>
                </section>
              </form>
            </section>
          </section>
        )
      }

    </>
  )

}

export default HeaderComponent;