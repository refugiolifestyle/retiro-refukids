import ListInscritos from '../../components/inscritos/list';
import { Page } from '../../components/page';

export default function Index() {
  return <Page
    title="Inscritos"
    actions={<a
      href='/inscritos/novo'
      className="bg-white text-black px-3 py-2 rounded-md text-sm font-medium">
      Novas inscrições
    </a>}>
    <ListInscritos />
  </Page>
}