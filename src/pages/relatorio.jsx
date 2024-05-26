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
          .filter(([n, v]) => !!v)
          .map(([n, v]) => `${n}: ${v.replaceAll(/(\s+|-)/gi, ' ')} (Vendedor(a) ${r.nome})`)
        return a.concat(numerosPreparados)
      }, [])
      .sort((n, n2) => collactor.compare(n, n2))
      .join('\n')

    await navigator.clipboard.writeText(textoParaSorteio)
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Lista copiada com sucesso' });
  }

  return <Page title="Relatórios">
    <Toast ref={toast} />
    <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
      <Button
        label='Números para sorteio'
        onClick={gerarNumerosParaSorteio} />
    </div>
  </Page>
}