import { get, onValue, ref, set } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { firebaseDatabase } from "../configs/firebase";

export const useRifaService = () => {
  const [loading, setLoading] = useState(false)
  const [rifa, setRifa] = useState([])

  useEffect(() => {
    setLoading(true);
    let query = ref(firebaseDatabase, 'rifas')

    return onValue(query, (snapshot) => {
      const nomes = []

      if (snapshot.exists()) {
        snapshot.forEach(child => {
          let [nome, rede] = child.key.split(' - ')
          let numeros = child.val()

          nomes.push({rede, nome, numeros})
        })
      }

      setRifa(nomes)
      setLoading(false);
    })
  }, []);

  const registrarVenda = useCallback(async (inscrito, numero, comprador) => {
    setLoading(true);

    let rifaPath = `rifas/${inscrito.nome} - ${inscrito.rede}/${numero}`;
    let rifaRef = ref(firebaseDatabase, rifaPath);

    await set(rifaRef, comprador);

    setLoading(false);
  }, []);

  return {
    registrarVenda,
    rifa,
    loading
  }
}