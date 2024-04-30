import { useEffect } from 'react';
import { Page } from '../components/page';
import { useInscritosService } from '../services/useInscritosService';
import { useRifaService } from '../services/useRifaService';
import { useComprovantesService } from '../services/useComprovantesService';
import { helloWorld } from '../../functions';

export default function Relatorio() {
  const {inscritos} = useInscritosService();
  const {rifa} = useRifaService()
  const {comprovantes} = useComprovantesService()
  
  useEffect(() => {
    window.inscritos = inscritos
  }, [inscritos])

  useEffect(() => {
    window.rifas = rifa
  }, [rifa])

  useEffect(() => {
    window.comprovantes = comprovantes
  }, [comprovantes])

  useEffect(() => {
    helloWorld()
  }, [])

  return <Page title="Relatórios">
    <div className='flex flex-col justify-center items-center gap-4'>
      <p className='text-4xl text-black font-semibold'>Relatórios</p>
    </div>
  </Page>
}