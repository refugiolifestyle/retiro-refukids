
import { useRouter } from 'next/router';
import { useState } from 'react';
import { NovoModalInscrito } from '../../components/inscritos/modal/adicionar';
import { FinalizarModalInscrito } from '../../components/inscritos/modal/finalizar';
import TableInscritos from '../../components/inscritos/table';
import { Page } from '../../components/page';
import { useInscrito } from '../../hooks/useInscrito';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';

const deparaCargo = {
  'SERVO': "Servo",
  'CRIANCA': "Criança",
  'RESPONSAVEL': "Responsável",
  'CONVIDADO': "Convidado",
}

export default function Novo() {
  const { parse } = useInscrito();
  const { query } = useRouter();
  const [inscritosAdded, setInscritosAdded] = useState([]);

  const adicionarInscrito = (data, tipoInscricao) => {
    let newInscritosAdded = [
      parse({
        ...data,
        cargo: deparaCargo[tipoInscricao]
      }),
      ...inscritosAdded
    ]

    setInscritosAdded(newInscritosAdded)
    setupBeforeUnloadListener()
  }

  const setupBeforeUnloadListener = () => {
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      return ev.returnValue = 'Você tem certeza que deseja sair?';
    });
  };

  const removeInscrito = linha => {
    setInscritosAdded(oldInscritosAdded => oldInscritosAdded
      .filter(inscrito => inscrito.nome !== linha.nome))
  }

  return <Page
    title="Adicione os inscritos que você quer cadastrar"
    actions={<div className="flex self-end gap-4">
      <a
        href={query.redirectUrl ? query.redirectUrl : "/inscritos"}
        className="text-white px-3 py-2 rounded-md text-sm">
        Cancelar
      </a>
      <NovoModalInscrito
        adicionarInscrito={adicionarInscrito}
        inscritosAdded={inscritosAdded} />
      {
        inscritosAdded.length
          ? <FinalizarModalInscrito inscritos={inscritosAdded} />
          : null
      }
    </div>}>
    <Message className='w-full mb-4' severity="warn" text="Atenção! Ao terminar de adicionar os inscritos, finalize sua inscrição." />
    <TableInscritos
      inscritos={inscritosAdded}
      loading={false}
      columnsDefault={["Rede", "Cargo", "Nome", "Sexo", "Dt. Nascimento", "Criança adotada"]}
      columnsExtras={[
        <Column
          key="excluirLinha"
          header=""
          body={linha => <button
            onClick={() => removeInscrito(linha)}
            className="bg-red-700 text-white px-3 py-2 rounded-md text-sm font-bold">
            X
          </button>} />
      ]} />
  </Page>
}