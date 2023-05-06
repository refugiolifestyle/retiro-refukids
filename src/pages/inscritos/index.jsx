import { onValue, ref } from 'firebase/database';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect, useState } from 'react';
import { Page } from '../../components/page';
import { firebaseDatabase } from '../../configs/firebase';

export default function Index() {
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

    inscritosPrepared.sort(function (a, b) {
      let numeroRedeA = a.rede.replace('Rede ', '')
      let numeroRedeB = b.rede.replace('Rede ', '')

      return Number.parseInt(numeroRedeA) > Number.parseInt(numeroRedeB) ? 1 : -1
    })
  }

  return <Page
    title="Inscritos"
    actions={<a
      href='/inscritos/novo'
      className="bg-white text-black px-3 py-2 rounded-md text-sm font-medium">
      Novas inscrições
    </a>}
  >
    <DataTable
      value={inscritosPrepared}
      emptyMessage='Nenhuma inscrição realizada'
      loading={loading}
      paginator
      rows={15}
      sortMode="multiple"
      removableSort
      dataKey="nome"
      filters={{
        rede: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]  },
        cargo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]  },
        nome: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]  },
        sexo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]  },
        telefone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]  },
        crianca: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]  }
      }}>
      <Column
        field="rede"
        filterField="rede"
        filter
        filterApply={props => <button className='bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterApplyCallback}>Filtrar</button>}
        filterClear={props => <button className='bg-white border border-indigo-600 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterClearCallback}>Limpar</button>}
        showFilterMenuOptions={false}
        filterPlaceholder='Filtrar por Rede'
        header="Rede"
        sortable></Column>
      <Column
        field="cargo"
        filterField="cargo"
        filter
        filterApply={props => <button className='bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterApplyCallback}>Filtrar</button>}
        filterClear={props => <button className='bg-white border border-indigo-600 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterClearCallback}>Limpar</button>}
        showFilterMenuOptions={false}
        filterPlaceholder='Filtrar por Cargo'
        header="Cargo"
        sortable></Column>
      <Column
        field="nome"
        filterField="nome"
        filter
        filterApply={props => <button className='bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterApplyCallback}>Filtrar</button>}
        filterClear={props => <button className='bg-white border border-indigo-600 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterClearCallback}>Limpar</button>}
        showFilterMenuOptions={false}
        filterPlaceholder='Filtrar por Nome'
        header="Nome"
        sortable></Column>
      <Column
        field="sexo"
        filterField="sexo"
        filter
        filterApply={props => <button className='bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterApplyCallback}>Filtrar</button>}
        filterClear={props => <button className='bg-white border border-indigo-600 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterClearCallback}>Limpar</button>}
        showFilterMenuOptions={false}
        filterPlaceholder='Filtrar por Sexo'
        header="Sexo"
        sortable></Column>
      <Column
        field="telefone"
        filterField="telefone"
        filter
        filterApply={props => <button className='bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterApplyCallback}>Filtrar</button>}
        filterClear={props => <button className='bg-white border border-indigo-600 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterClearCallback}>Limpar</button>}
        showFilterMenuOptions={false}
        filterPlaceholder='Filtrar por Telefone'
        header="Telefone"></Column>
      <Column
        field="crianca"
        filterField="crianca"
        filter
        filterApply={props => <button className='bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterApplyCallback}>Filtrar</button>}
        filterClear={props => <button className='bg-white border border-indigo-600 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterClearCallback}>Limpar</button>}
        showFilterMenuOptions={false}
        filterPlaceholder='Filtrar por Responsável de'
        header="Responsável de"></Column>
    </DataTable>
  </Page>
}