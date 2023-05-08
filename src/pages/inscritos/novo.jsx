
import { useState } from 'react';
import { NovoModalInscrito } from '../../components/inscritos/modal/adicionar';
import { FinalizarModalInscrito } from '../../components/inscritos/modal/finalizar';
import TableInscritos from '../../components/inscritos/table';
import { Page } from '../../components/page';
import { useInscrito } from '../../hooks/useInscrito';

const deparaCargo = {
  'SERVO': "Servo",
  'CRIANCA': "Criança",
  'RESPONSAVEL': "Responsável",
}

export default function Index() {
  const { parse } = useInscrito();
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
        href="/inscritos"
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
    <TableInscritos
      inscritos={inscritosAdded}
      loading={false}
      actions={linha =>
        <button
          onClick={() => removeInscrito(linha)}
          className="bg-red-700 text-white px-3 py-2 rounded-md text-sm font-bold">
          X
        </button>
      } />
  </Page>
}