import { Page } from '../components/page';
import { useInscritosService } from '../services/useInscritosService';

export default function Relatorio() {
  const {inscritos} = useInscritosService();
  window.inscritos = inscritos

  return <Page title="Relatórios">
    <div className='flex flex-col justify-center items-center gap-4'>
      <p className='text-4xl text-black font-semibold'>Relatórios</p>
    </div>
  </Page>
}