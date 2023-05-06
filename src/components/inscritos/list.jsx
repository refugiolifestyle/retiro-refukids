import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { firebaseDatabase } from '../../configs/firebase';
import { useInscrito } from '../../hooks/useInscrito';
import TableInscritos from './table';

export default function ListInscritos() {
  const {parse} = useInscrito();
  const [inscritos, setInscritos] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let query = ref(firebaseDatabase, 'inscritos')
    return onValue(query, (snapshot) => {
      setInscritos(snapshot.val())
      setLoading(false);
    })
  }, [])

  let inscritosPrepared = []
  if (inscritos) {
    inscritosPrepared = Object.values(inscritos)
      .reduce((am, rede) => {
        return [
          ...Object.values(rede),
          ...am
        ]
      }, [])
      .map(parse)
  }

  return <TableInscritos
    inscritos={inscritosPrepared}
    loading={loading} />
}