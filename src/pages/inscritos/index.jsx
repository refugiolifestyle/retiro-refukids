import { onValue, ref } from 'firebase/database';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect, useState } from 'react';
import { Page } from '../../components/page';
import { firebaseDatabase } from '../../configs/firebase';

export default function Index() {
  const [inscritos, setInscritos] = useState({})

  useEffect(() => {
    let query = ref(firebaseDatabase, 'inscritos')

    return onValue(query, (snapshot) => {
      setInscritos(snapshot.val())
    })
  }, [])

  let inscritosPrepared = Object.values(inscritos)
    .reduce((am, rede) => {
      return [
        ...Object.values(rede),
        ...am
      ]
    }, [])

  inscritosPrepared.sort(function (a, b) {
    let numeroRedeA = a.rede.replace('Rede ', '')
    let numeroRedeB = b.rede.replace('Rede ', '')

    return Number.parseInt(numeroRedeA) > Number.parseInt(numeroRedeB)  ? 1 : -1
  })

  return <Page
    title="Inscritos"
    actions={<a
      href='/inscritos/novo'
      className="bg-white text-black px-3 py-2 rounded-md text-sm font-medium">
      Novas inscrições
    </a>}
  >
    <DataTable value={inscritosPrepared || []} emptyMessage='Nenhuma inscrição realizada' paginator rows={15}>
      <Column field="rede" header="Rede"></Column>
      <Column field="cargo" header="Cargo"></Column>
      <Column field="nome" header="Nome"></Column>
      <Column field="sexo" header="Sexo"></Column>
      <Column field="telefone" header="Telefone"></Column>
      <Column field="crianca" header="Responsável de"></Column>
    </DataTable>
  </Page>
}