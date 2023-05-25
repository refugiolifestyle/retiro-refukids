import { ref as refDatabase, set } from 'firebase/database';
import { getDownloadURL, ref as refStorage, uploadString } from 'firebase/storage';
import { useEffect } from 'react';
import { Page } from '../components/page';
import { firebaseDatabase, firebaseStorage } from '../configs/firebase';

export default function Relatorio() {
  useEffect(() => {
    async function runner() {
      let i = await fetch('http://localhost:3000/asd.json');
      let r = await i.json()
      for(let inscrito of Array.from(r)) {
        try {
          if (inscrito.comprovante.arquivo && inscrito.comprovante.arquivo.startsWith("data:")) {
            let res = await fetch(inscrito.comprovante.arquivo)
            let file = await res.blob()
            let [mime, ext] = file.type.split("/")
  
            if (["pdf", "jpg", "jpeg", "png"].includes(ext)) {
              let rede = inscrito.rede
              let nome = inscrito.nome
              let referencia = inscrito.comprovante.referencia
  
              let pathStorage = refStorage(firebaseStorage, `${referencia}.${ext}`)
              let uploaderStorage = await uploadString(pathStorage, inscrito.comprovante.arquivo, "data_url");
              let urlStorage = await getDownloadURL(uploaderStorage.ref)
  
              console.log(`inscritos/${rede}/${nome}/comprovante/arquivo`)
              let pathDatabase = refDatabase(firebaseDatabase, `inscritos/${rede}/${nome}/comprovante/arquivo`)
              await set(pathDatabase, urlStorage)
  
              let comprovantePathDatabase = refDatabase(firebaseDatabase, `${referencia}/arquivo`)
              await set(comprovantePathDatabase, urlStorage)
            } else {
              console.error("file extension invalid")
              console.warn(inscrito)
            }
          } else {
            console.error("money payment")
            console.warn(inscrito)
          }
        } catch (e) {
          console.error("error on upload file")
          console.warn(inscrito)
        }
      }
    } 

    runner();
  }, [])

  return <Page title="Relatórios">
    <div className='flex flex-col justify-center items-center gap-4'>
      <p className='text-4xl text-black font-semibold'>Relatórios</p>
    </div>
  </Page>
}