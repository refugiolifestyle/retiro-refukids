import { Column } from 'primereact/column';
import ListInscritos from '../../components/inscritos/list';
import { Pagar2ParcelaModal } from '../../components/inscritos/modal/pagar';
import { Page } from '../../components/page';
import { useConfigService } from '../../services/useConfigService';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

export default function Index() {
  const toast = useRef(null);
  const { permitirInscricao } = useConfigService();

  const buildExtrasColumns = (inscrito) => ['Responsável', 'Servo'].includes(inscrito.cargo)
    && inscrito.situacaoPagamento
    && inscrito.situacaoPagamento === '1ª Parcela'
    ? <div key={`action-${inscrito.rede}-${inscrito.nome}`}
      className="flex justify-content-end align-items-center gap-2">
      <Pagar2ParcelaModal inscritos={[inscrito]} toast={toast} />
    </div>
    : null

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
    <ListInscritos
      columnsExtras={[
        <Column
          key="parcelas"
          header=""
          body={linha => buildExtrasColumns(linha)}>
        </Column>
      ]} />
  </Page>
}