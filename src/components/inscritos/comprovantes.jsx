import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Badge } from 'primereact/badge';
import { useState } from "react";
import { useComprovantesService } from '../../services/useComprovantesService';
import { getDownloadURL, ref } from 'firebase/storage';
import { firebaseStorage } from '../../configs/firebase';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const VisualizarComprovantesModal = ({ inscritos }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comprovantes, setComprovantes] = useState([]);
  const { buscarComprovante } = useComprovantesService();

  const openModal = () => {
    setLoading(true)

    Promise.all(Array
      .from(inscritos.comprovante)
      .map(({ referencia }) => buscarComprovante(referencia)))
      .then(results => setComprovantes(results))
      .finally(() => setLoading(false))
  }

  const hideModal = () => {
    setLoading(false);
    setVisible(false);
  }

  return <>
    <Button
      text
      onClick={() => setVisible(true)}
      label="Visualizar"
      icon="pi pi-external-link"
      className="p-btn-link bg-white text-black px-3 py-2 rounded-md text-sm font-medium" />
    <Dialog
      header="Visualizar comprovantes"
      visible={visible}
      breakpoints={{ '1300px': '80vw', '960px': '75vw', '960px': '75vw', '641px': '85vw', '300px': '95vw' }}
      style={{ width: '50vw' }}
      onShow={openModal}
      onHide={hideModal}>
      {
        loading
          ? <div className="w-full text-center py-4">
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
          </div>
          : <Accordion>
            {
              comprovantes.map(c => <AccordionTab header={c.data}>
                <div className="flex flex-col sm:flex-row py-2">
                  <label className="text-base font-semibold w-64">Identificador</label>
                  <div className="flex flex-1 flex-col">
                    {c.uuid}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row py-2">
                  <label className="text-base font-semibold w-64">Valor total</label>
                  <div className="flex flex-1 flex-col">
                    {new Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" }).format(c.valor)}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row py-2">
                  <label className="text-base font-semibold w-64">Tipo de pagamento</label>
                  <div className="flex flex-1 flex-col">{c.tipoPagamento}</div>
                </div>
                {
                  c.tipoPagamento === 'Pix'
                    ? <div className="flex flex-col sm:flex-row py-2">
                      <label className="text-base font-semibold w-64">Visualizar arquivo</label>
                      <div
                        className="flex items-center cursor-pointer text-blue-500"
                        onClick={() => {
                          let refComprovante = ref(firebaseStorage, c.arquivo)
                          getDownloadURL(refComprovante)
                            .then(url => window.open(url, '_blank'))
                        }}>
                        <i className='pi pi-external-link mr-4'></i>
                        Visualizar arquivo
                      </div>
                    </div>
                    : <div className="flex flex-col sm:flex-row py-2">
                      <label className="text-base font-semibold w-64">Quem recebeu</label>
                      <div className="flex flex-1 flex-col">{c.quemRecebeu}</div>
                    </div>
                }
                <div className="flex flex-col sm:flex-row py-2">
                  <label className="text-base font-semibold w-64">Inscritos</label>
                </div>
                <div className="flex flex-col sm:flex-row py-2">
                  <div className="flex flex-1 flex-col">
                    <DataTable value={c.inscritos} size="small">
                      <Column field="rede" header="Rede"></Column>
                      <Column 
                        field="nome" 
                        header="Nome"
                        body={linha => <>
                          {linha.nome}
                          {
                            linha.cargo === 'Criança'
                            && linha.foiAdotada === 'Sim'
                            ? <Badge value="Adotada" severity="info" className='ml-2'></Badge>
                            : null
                          }
                        </>}></Column>
                      <Column field="cargo" header="Cargo"></Column>
                      <Column field="situacaoPagamento" header="Pagamentos efetuados"></Column>
                    </DataTable>
                  </div>
                </div>
              </AccordionTab>)
            }
          </Accordion>
      }
    </Dialog>
  </>
}