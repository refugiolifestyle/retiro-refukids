
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
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

  return <Page
    title="Adicione os inscritos que você quer cadastrar"
    actions={actions}>
    <DataTable
      value={inscritos}
      emptyMessage='Nenhuma inscrição realizada'>
      <Column field="rede" header="Rede"></Column>
      <Column field="cargo" header="Cargo"></Column>
      <Column field="nome" header="Nome"></Column>
      <Column field="sexo" header="Sexo"></Column>
      <Column field="telefone" header="Telefone"></Column>
      <Column field="crianca" header="Responsável de"></Column>
    </DataTable>
  </Page>
}