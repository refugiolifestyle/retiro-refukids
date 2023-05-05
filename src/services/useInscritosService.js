import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { firebaseDatabase } from "../configs/firebase"

export const useInscritosService = () => {
  const [inscritos, setInscritos] = useState(null)

  useEffect(() => {
    let query = ref(firebaseDatabase, 'inscritos')
    
    return onValue(query, (snapshot) => {
      setInscritos(snapshot.val())
    })
  }, [])

  return inscritos
}