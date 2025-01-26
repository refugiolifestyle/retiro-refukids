import { Page } from '../components/page';
import { useConfigService } from '../services/useConfigService';

export default function Index() {
  const { permitirInscricao, exibirFotoTema } = useConfigService();

  return <Page title="Inicio">
    <div className='flex flex-col justify-center items-center gap-4 h-64'>
      {
        exibirFotoTema === true
          ? <img src="https://firebasestorage.googleapis.com/v0/b/retiro-refukids.appspot.com/o/tema.png?alt=media&token=b3e8f0f3-02dc-44e1-a65d-420a7a8e679c" alt="Tema do retiro" className="h-40" />
          : null
      }
      {
        permitirInscricao === true
          ? <a
            href='/inscritos/novo'
            className="bg-indigo-700 text-white px-3 py-2 mt-10 rounded-md text-sm font-medium">
            Novas inscrições
          </a>
          : null
      }
    </div>
  </Page>;
}