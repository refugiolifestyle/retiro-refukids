import Head from 'next/head';
import { HeaderNavigation } from './header';

export const Page = ({ title, actions, children }) => {
  return <>
    <Head>
      <title>{title}</title>
    </Head>
    <div className="bg-indigo-800 pb-16">
      <HeaderNavigation current={title} />
      <header className="max-w-7xl border-t border-indigo-700 mx-auto px-6 xl:px-0 pt-10 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {actions}
      </header>
    </div>
    <main className="max-w-7xl bg-white rounded-lg shadow-2xl -mt-16 p-6 my-10 mx-6 xl:mx-auto">
      {children}
    </main>
  </>;
}