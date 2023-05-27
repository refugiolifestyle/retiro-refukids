import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { useEffect, useState } from 'react';
import { useMultipleSort } from '../../hooks/useMultipleSort';
import { useRedesService } from '../../services/useRedesService';

const dataColumns = [
  'Rede',
  'Cargo',
  'Nome',
  'Sexo',
  'Idade',
  'Dt. Nascimento',
  'Telefone',
  'Observação',
  'Responsável por',
  'Equipe'
];

export default function TableInscritos({ inscritos, loading, columnsExtras, columnsDefault }) {
  const redes = useRedesService();
  const multipleSort = useMultipleSort();
  const [visibleColumns, setVisibleColumns] = useState(columnsDefault ? columnsDefault : ["Rede", "Cargo", "Nome", "Sexo", "Idade", "Responsável por"]);
  const [countRealRows, setCountRealRows] = useState(0);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    rede: { value: null, matchMode: FilterMatchMode.IN },
    cargo: { value: null, matchMode: FilterMatchMode.IN },
    nome: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    sexo: { value: null, matchMode: FilterMatchMode.IN },
    telefone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    nascimento: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    idade: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    observacao: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    criancas: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    equipe: { value: null, matchMode: FilterMatchMode.IN },
  });

  useEffect(() => {
    setCountRealRows(inscritos.length)
  }, [inscritos])
  
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  let inscritosSorted = multipleSort(
    inscritos
      .map(inscrito => ({
        ...inscrito,
        _defaultSort: `${inscrito.criancas || inscrito.nome} ${inscrito.cargo}`
      })),
    { '_defaultSort': 'asc' }
  );

  return <DataTable
    value={inscritosSorted}
    onValueChange={data => setCountRealRows(data?.length || 0)}
    emptyMessage='Nenhuma inscrição realizada'
    loading={loading}
    header={<div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText type='search' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pesquisar por..." />
        </span>
      </div>
      <span>Total de registros: {countRealRows} {countRealRows === 1 ? "inscrito" : "inscritos"}</span>
      <MultiSelect
        value={visibleColumns}
        options={dataColumns}
        placeholder="Colunas visíveis"
        className="w-full max-w-xs"
        onChange={event => setVisibleColumns(event.value)}
        maxSelectedLabels={3}
        display="chip" />
    </div>}
    paginator
    rows={15}
    rowsPerPageOptions={[5, 15, 30, 50, 100]}
    multiSortMeta={[{ field: 'rede', order: 1 }]}
    sortOrder={1}
    sortMode="multiple"
    removableSort
    dataKey="nome"
    filters={filters}>
    {visibleColumns.includes('Rede')
      ? <Column
        key="rede"
        field="rede"
        filter
        filterField="rede"
        filterElement={options => <MultiSelect filter value={options.value} options={redes} onChange={(e) => options.filterCallback(e.value)} placeholder="Filtrar por Rede" className="p-column-filter" />}
        showFilterMatchModes={false}
        header="Rede"
        sortable />
      : null}
    {visibleColumns.includes('Cargo')
      ? <Column
        key="cargo"
        field="cargo"
        filter
        filterField="cargo"
        filterElement={options => <MultiSelect filter value={options.value} options={['Servo', 'Criança', 'Responsável']} onChange={(e) => options.filterCallback(e.value)} placeholder="Filtrar por Cargo" className="p-column-filter" />}
        showFilterMatchModes={false}
        header="Cargo"
        sortable />
      : null}
    {visibleColumns.includes('Nome')
      ? <Column
        key="nome"
        field="nome"
        filterField="nome"
        filter
        filterPlaceholder="Filtrar por Nome"
        header="Nome"
        sortable />
      : null}
    {visibleColumns.includes('Sexo')
      ? <Column
        key="sexo"
        field="sexo"
        filter
        filterField="sexo"
        filterElement={options => <MultiSelect filter value={options.value} options={['Masculino', 'Feminino']} onChange={(e) => options.filterCallback(e.value)} placeholder="Filtrar por Sexo" className="p-column-filter" />}
        showFilterMatchModes={false}
        header="Sexo"
        sortable />
      : null}
    {visibleColumns.includes('Idade')
      ? <Column
        key="idade"
        field="idade"
        filterField="idade"
        filter
        filterPlaceholder="Filtrar por Idade"
        dataType="numeric"
        header="Idade"
        sortable />
      : null}
    {visibleColumns.includes('Dt. Nascimento')
      ? <Column
        key="nascimento"
        field="nascimento"
        filterField="nascimento"
        filter
        filterPlaceholder="Filtrar por Dt. Nascimento"
        header="Dt. Nascimento" />
      : null}
    {visibleColumns.includes('Telefone')
      ? <Column
        key="telefone"
        field="telefone"
        filterField="telefone"
        filter
        filterPlaceholder="Filtrar por Telefone"
        header="Telefone" />
      : null}
    {visibleColumns.includes('Observação')
      ? <Column
        key="observacao"
        field="observacao"
        filterField="observacao"
        filter
        filterPlaceholder="Filtrar por Observação"
        header="Observação"
        sortable />
      : null}
    {visibleColumns.includes('Responsável por')
      ? <Column
        key="criancas"
        field="criancas"
        filterField="criancas"
        filter
        filterPlaceholder="Filtrar por Responsável por"
        header="Responsável por" />
      : null}
    {visibleColumns.includes('Equipe')
      ? <Column
        key="equipe"
        field="equipe"
        filter
        filterField="equipe"
        filterElement={options => <MultiSelect filter value={options.value} options={['Amarelo', 'Verde']} onChange={(e) => options.filterCallback(e.value)} placeholder="Filtrar por Equipe" className="p-column-filter" />}
        showFilterMatchModes={false}
        header="Equipe"
        sortable />
      : null}
    {
      columnsExtras
        ? columnsExtras
        : null
    }
  </DataTable>
}