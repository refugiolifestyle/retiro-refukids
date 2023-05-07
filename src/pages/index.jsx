import { Page } from '../components/page';

export default function Index() {
  return <Page title="Inicio">
    <div className='flex flex-col justify-center items-center gap-4 h-64'>
      <p className='text-4xl text-black font-semibold'>Retiro Pais e Filhos</p>
      <p className='text-2xl text-black font-light'>Amigos de Deus</p>
      <a
        href='/inscritos/novo'
        className="bg-indigo-700 text-white px-3 py-2 mt-10 rounded-md text-sm font-medium">
        Novas inscrições
      </a>
    </div>
  </Page>;
}