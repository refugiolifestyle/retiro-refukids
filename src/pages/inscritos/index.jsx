import ListInscritos from '../../components/inscritos/list';
import { Page } from '../../components/page';
import { useConfigService } from '../../services/useConfigService';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

export default function Index() {
  const toast = useRef(null);
  const { permitirInscricao } = useConfigService();

  return <Page
    title="Inscritos"
    actions={permitirInscricao === true
      ? <a
        href='/inscritos/novo'
        className="bg-white text-black px-3 py-2 rounded-md text-sm font-medium">
        Novas inscrições
      </a>
      : null}>
    <Toast ref={toast} />
    <ListInscritos />
  </Page>
}