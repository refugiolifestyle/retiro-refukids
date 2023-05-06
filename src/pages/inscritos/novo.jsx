
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { NovoModalInscrito } from '../../components/inscritos/modal/adicionar';
import { FinalizarModalInscrito } from '../../components/inscritos/modal/finalizar';
import { Page } from '../../components/page';

const deparaCargo = {
  'SERVO': "Servo",
  'CRIANCA': "Criança",
  'RESPONSAVEL': "Responsável",
}

export default function Index() {
  const [inscritos, setInscritos] = useState([]);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const adicionarInscrito = (data, tipoInscricao) => {
    let newInscritos = [
      { ...data, cargo: deparaCargo[tipoInscricao] },
      ...inscritos
    ]

    setInscritos(newInscritos)
  }

  const actions = <div className="flex self-end gap-4">
    <a
      href="/inscritos"
      className="text-white px-3 py-2 rounded-md text-sm">
      Cancelar
    </a>
    <NovoModalInscrito
      adicionarInscrito={adicionarInscrito}
      criancas={inscritos.filter(i => i.cargo === 'Criança')} />
    <FinalizarModalInscrito
      inscritos={inscritos} />
  </div>

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      rede: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      cargo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      nome: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      sexo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      crianca: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    setGlobalFilterValue('');
  };

  const dataHeader = <div className="flex justify-between">
    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Filtrar por" className='h-10' />
    <button type="button" className='text-indigo-700 border border-indigo-700 px-3 h-10 rounded-md text-sm font-medium' onClick={clearFilter}>
      Limpar filtro
    </button>
  </div>;


  return <Page
    title="Adicione os inscritos que você quer cadastrar"
    actions={actions}>
    <DataTable
      value={inscritos}
      emptyMessage='Nenhuma inscrição realizada'
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