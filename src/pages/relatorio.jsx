import { useEffect } from 'react';
import { Page } from '../components/page';
import { useInscritosService } from '../services/useInscritosService';
import { useRifaService } from '../services/useRifaService';
import { useComprovantesService } from '../services/useComprovantesService';

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
      <p className='text-4xl text-black font-semibold'>Relatórios</p>
    </div>
  </Page>
}