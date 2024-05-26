import { useEffect } from 'react';
import { Page } from '../components/page';
import { useInscritosService } from '../services/useInscritosService';
import { useRifaService } from '../services/useRifaService';
import { useComprovantesService } from '../services/useComprovantesService';
import { Button } from 'primereact/button';

export default function Relatorio() {
  const {inscritos} = useInscritosService();
  const {rifa} = useRifaService()
  const {comprovantes} = useComprovantesService()
  
  useEffect(() => {
    window.inscritos = inscritos
    console.log('Inscritos atualizados', new Date().toLocaleString('pt-br'))
  }, [inscritos])

  useEffect(() => {
    window.rifas = rifa
    console.log('Rifas atualizados', new Date().toLocaleString('pt-br'))
  }, [rifa])

  useEffect(() => {
    window.comprovantes = comprovantes
    console.log('Comprovantes atualizados', new Date().toLocaleString('pt-br'))
  }, [comprovantes])

  return <Page title="Relatórios">
    <div className='flex flex-col justify-center items-center gap-4'>
      <Button label='Números para Rifa' onClick={async () => {
        let text = rifa.reduce((a, r) => a.concat(Object.entries(r.numeros).filter(([n, v]) => v !== false).map(([n, v]) => `${n}: ${v.replaceAll(/(\s+|-)/gi, ' ')} (Vendedor(a) ${r.nome} )`)), []).join('\n')
        await navigator.clipboard.writeText(text)
      }} />
    </div>
  </Page>
}