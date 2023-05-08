import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { firebaseDatabase } from "../configs/firebase";
import { useInscrito } from "../hooks/useInscrito";

export const useInscritosService = () => {
  const {parse} = useInscrito();
  const [inscritosSaved, setInscritosSaved] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let query = ref(firebaseDatabase, 'inscritos')
    
    return onValue(query, (snapshot) => {
      setInscritosSaved(snapshot.val())
      setLoading(false);
    })
  }, [])

  let inscritos = [];
  if (inscritosSaved) {
    inscritos = Object.values(inscritosSaved)
      .reduce((am, rede) => {
        return [
          ...Object.values(rede),
          ...am
        ]
      }, [])
      .map(parse)
  }

  return {
    inscritos,
    loading
  }
}