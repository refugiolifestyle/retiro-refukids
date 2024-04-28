import { get, onValue, ref } from "firebase/database";
import { firebaseDatabase } from "../configs/firebase";
import { useEffect, useState } from "react";

export const useComprovantesService = () => {
  const [loading, setLoading] = useState(false)
  const [comprovantes, setComprovantes] = useState([])

  useEffect(() => {
    setLoading(true);

    let query = ref(firebaseDatabase, 'comprovantes')
    return onValue(query, (snapshot) => {
      let novosComprovantes = []

      snapshot.forEach(snap => {
        novosComprovantes.push({
          uuid: snap.key,
          ...snap.val()
        })
      })

      setComprovantes(novosComprovantes)
      setLoading(false);
    })
  }, [])

  const buscarComprovante = async (comprovante) => {
    let comprovanteRef = ref(firebaseDatabase, `comprovantes/${comprovante}`);
    let comprovanteGet = await get(comprovanteRef);

    return {
      uuid: comprovante,
      ...comprovanteGet.val()
    }
  }

  return {
    loading,
    comprovantes,
    buscarComprovante
  }
}