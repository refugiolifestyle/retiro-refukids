import { useEffect, useRef } from 'react';
import { Page } from '../components/page';
import { useInscritosService } from '../services/useInscritosService';
import { useRifaService } from '../services/useRifaService';
import { useComprovantesService } from '../services/useComprovantesService';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

export default function Relatorio() {
  const toast = useRef(null);
  const { inscritos } = useInscritosService();
  const { rifa } = useRifaService()
  const { comprovantes } = useComprovantesService()

  useEffect(() => {
    window.inscritos = inscritos
    window.rifas = rifa
    window.comprovantes = comprovantes

    console.log('Dados atualizados', new Date().toLocaleString('pt-br'))
  }, [inscritos])

  const gerarNumerosParaSorteio = async () => {
    let collactor = new Intl.Collator('pt-BR', { numeric: true, usage: 'sort' });
    let textoParaSorteio = rifa
      .reduce((a, r) => {
        let numerosPreparados = Object
          .entries(r.numeros)
          .map(([n, v]) => {
            if (!v) {
              return `${n}: ${r.nome}`
            }

            let comprador = v
              .replaceAll(/(\s{2,}|-)/gi, '')
              .trim()

            return `${n}: ${r.nome} (Vendido para: ${comprador})`
          })
        return a.concat(numerosPreparados)
      }, [])
      .sort((n, n2) => collactor.compare(n, n2))
      .join('\n')

    await navigator.clipboard.writeText(textoParaSorteio)
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Lista copiada com sucesso' });
  }

  const gerarListaParaQuartos = async () => {
    let Quartos = { Feminino: [], Masculino: [] }
    let collator = new Intl.Collator('pt-BR', { numeric: true });

    inscritos
      .filter(inscrito => inscrito.cargo === "Criança")
      .map(crianca => {
        return {
          ...crianca,
          responsaveis: inscritos.filter(i => i.cargo === "Responsável" && i.criancas.includes(crianca.nome))
        }
      })
      .sort((a, b) => {
        return collator.compare(`${a.rede}${a.responsaveis.join('')}`, `${b.rede}${b.responsaveis.join('')}`)
      })
      .forEach(({ responsaveis, ...crianca }) => {
        if (responsaveis.length === 1) {
          let [responsavel] = responsaveis;
          Quartos[responsavel.sexo].push(crianca);
          Quartos[responsavel.sexo].push(responsaveis);
        }
        else {
          Quartos[crianca.sexo].push(crianca);

          let rF = responsaveis.filter(r => r.sexo === 'Feminino');
          Quartos.Feminino = Quartos.Feminino.concat(rF);

          let rM = responsaveis.filter(r => r.sexo === 'Masculino');
          Quartos.Masculino = Quartos.Masculino.concat(rM);
        }
      })

    inscritos
      .filter(c => c.cargo === "Servo")
      .sort(function (a, b) {
        return collator.compare(`${a.rede}${a.nome}`, `${b.rede}${b.nome}`)
      })
      .forEach(servo => {
        Quartos[servo.sexo].push(servo)
      })

    Quartos = Object.fromEntries(
      Object.entries(Quartos)
        .map(([sexo, lista]) => {
          return [
            sexo,
            lista
              .filter((value, index, array) => array.lastIndexOf(value) === index)
              .map(inscrito => `${inscrito.rede} - ${inscrito.nome} (${inscrito.cargo})`)
          ]
        })
    )

    let clipboardText = `Feminino\n${Quartos.Feminino.join('\n')}\n\nMasculino\n${Quartos.Masculino.join('\n')}`
    await navigator.clipboard.writeText(clipboardText)

    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Lista copiada com sucesso' });
  }

  return <Page title="Relatórios">
    <Toast ref={toast} />
    <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
      <Button
        label='Números para sorteio da Rifa'
        onClick={gerarNumerosParaSorteio} />
      <Button
        label='Lista de nomes para quartos'
        onClick={gerarListaParaQuartos} />
    </div>
  </Page>
}