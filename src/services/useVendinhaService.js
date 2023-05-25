import { get, onValue, ref, set } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { firebaseDatabase } from "../configs/firebase";

export const useVendinhaService = () => {
  const [loading, setLoading] = useState(false)
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    setLoading(true);
    let query = ref(firebaseDatabase, 'produtos')

    return onValue(query, (snapshot) => {
      setProdutos(snapshot.exists() ? snapshot.val() : [])
      setLoading(false);
    })
  }, []);

  const quitarVenda = useCallback(async (inscrito) => {
    setLoading(true);

    let vendinhaPath = `inscritos/${inscrito.rede}/${inscrito.nome}/vendinha`;
    let vendinhaRef = ref(firebaseDatabase, vendinhaPath);

    let vendinhaGet = await get(vendinhaRef);
    await set(vendinhaRef, [
      ...(vendinhaGet.exists() ? vendinhaGet.val() : []).map(compra => ({
        ...compra,
        pago: true
      }))
    ]);

    setLoading(false);
  }, []);

  const finalizarVenda = useCallback(async (inscrito, compras) => {
    setLoading(true);

    let vendinhaPath = `inscritos/${inscrito.rede}/${inscrito.nome}/vendinha`;
    let vendinhaRef = ref(firebaseDatabase, vendinhaPath);

    let vendinhaGet = await get(vendinhaRef);
    await set(vendinhaRef, [
      ...compras.map(compra => ({
        ...compra,
        data: new Date().toString()
      })),
      ...(vendinhaGet.exists() ? vendinhaGet.val() : [])
    ]);

    setLoading(false);
  }, []);

  return {
    quitarVenda,
    finalizarVenda,
    produtos,
    loading
  }
}