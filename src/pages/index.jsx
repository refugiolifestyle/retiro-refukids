import { Page } from '../components/page';

export default function Index() {
  return <Page title="Inicio">
    <div className='flex flex-col justify-center items-center gap-4 h-64'>
      <p className='text-4xl text-black font-semibold'>Retiro Pais e Filhos 2023</p>
      <p className='text-2xl text-black font-light'>Amigos de Deus</p>
    </div>
  </Page>;
}