
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
  const [inscritos, setInscritos] = useState([]);

  const adicionarInscrito = (data, tipoInscricao) => {
    let newInscritos = [
      parse({
        ...data,
        cargo: deparaCargo[tipoInscricao]
      }),
      ...inscritos
    ]

    setInscritos(newInscritos)
    setupBeforeUnloadListener()
  }

  const setupBeforeUnloadListener = () => {
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      return ev.returnValue = 'Você tem certeza que deseja sair?';
    });
  };

  const removeInscrito = linha => {
    setInscritos(oldInscritos => oldInscritos
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
        criancas={inscritos.filter(i => i.cargo === 'Criança')} />
      {
        inscritos.length
          ? <FinalizarModalInscrito inscritos={inscritos} />
          : null
      }
    </div>}>
    <TableInscritos
      inscritos={inscritos}
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