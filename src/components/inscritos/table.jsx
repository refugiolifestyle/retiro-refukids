import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { MultiSelect } from 'primereact/multiselect';
import { useState } from 'react';

const dataColumns = [
  { field: 'rede', header: 'Rede', sortable: true },
  { field: 'cargo', header: 'Cargo', sortable: true },
  { field: 'nome', header: 'Nome', sortable: true },
  { field: 'sexo', header: 'Sexo', sortable: true },
  { field: 'idade', header: 'Idade', sortable: true },
  { field: 'nascimento', header: 'Dt. Nascimento', sortable: true },
  { field: 'telefone', header: 'Telefone', sortable: false },
  { field: 'observacao', header: 'Observação', sortable: false },
  { field: 'criancas', header: 'Responsável por', sortable: false },
];

export default function TableInscritos({ inscritos, loading, actions }) {
  let initColumnsVisible = dataColumns
    .filter(c => !["telefone", "nascimento", "observacao"].includes(c.field));

  const [visibleColumns, setVisibleColumns] = useState(initColumnsVisible);

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = dataColumns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field));

    setVisibleColumns(orderedSelectedColumns);
  };

  return <DataTable
    value={inscritos}
    emptyMessage='Nenhuma inscrição realizada'
    loading={loading}
    header={<div className="flex justify-end items-center">
      <MultiSelect
        value={visibleColumns}
        options={dataColumns}
        optionLabel="header"
        placeholder="Colunas visíveis"
        className="w-full max-w-xs"
        onChange={onColumnToggle}
        maxSelectedLabels={3}
        display="chip" />
    </div>}
    paginator
    rows={15}
    sortMode="multiple"
    removableSort
    dataKey="nome"
    filters={{
      rede: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      cargo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      nome: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      sexo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      telefone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      crianca: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
    }}>
    {
      visibleColumns.map(col => <Column
        key={col.field}
        field={col.field}
        filterField={col.field}
        filter
        filterApply={props => <button className='bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterApplyCallback}>Filtrar</button>}
        filterClear={props => <button className='bg-white border border-indigo-600 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium' onClick={props.filterClearCallback}>Limpar</button>}
        showFilterMenuOptions={false}
        filterPlaceholder={`Filtrar por ${col.header}`}
        header={col.header}
        sortable={col.sortable} />)
    }
    {
      actions
        ? <Column
          header="#"
          body={actions} />
        : null
    }
  </DataTable>
}