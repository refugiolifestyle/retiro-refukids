import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { firebaseDatabase } from "../configs/firebase";

export const useConfigService = () => {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let query = ref(firebaseDatabase, 'configuracoes')
    
    return onValue(query, (snapshot) => {
      setConfig(snapshot.val())
      setLoading(false);
    })
  }, [])

  return {
    ...config,
    loading
  }
}