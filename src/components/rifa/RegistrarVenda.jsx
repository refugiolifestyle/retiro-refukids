import { Dialog } from 'primereact/dialog';
import { Fragment, useState } from 'react';
import { Button } from 'primereact/button';
import { useRifaService } from '../../services/useRifaService';
import { TabView, TabPanel } from 'primereact/tabview';

export const RegistrarVenda = ({ inscrito }) => {
    const [visible, setVisible] = useState(false);
    const [blockVisibility, setBlockVisibility] = useState("BLOCO");
    const { registrarVenda, loading } = useRifaService();

    const onNumeroClick = (inscrito, numero) => {
        let comprador = window.prompt(`Para quem foi vendido o número ${numero}?`);
        if (comprador) {
            registrarVenda(inscrito, numero, comprador)
        }
    }

    return <Fragment key={`action-registar-venda-${inscrito.rede}-${inscrito.nome}`}>
        <Button
            icon="pi pi-plus"
            tooltip="Registrar venda"
            tooltipOptions={{ position: "bottom" }}
            className="p-button-outlined p-button-rounded p-button-link p-3"
            onClick={() => setVisible(true)} />
        <Dialog
            visible={visible}
            onHide={() => setVisible(false)}
            header="Registrar venda">
            <div style={{ maxWidth: '600px', minWidth: '400px', width: '100%' }}>
                <TabView>
                    <TabPanel header="Bloco" leftIcon="pi pi-th-large mr-2">
                        {
                            Object.entries(inscrito.numeros)
                                .map(([numero, comprador]) => <Button
                                    key={numero}
                                    label={numero}
                                    loading={loading}
                                    disabled={!!comprador}
                                    tooltip={comprador}
                                    tooltipOptions={{ position: "bottom", showOnDisabled: true }}
                                    className="p-button-outlined p-button-rounded w-12 h-12 p-1 m-1"
                                    onClick={() => onNumeroClick(inscrito, numero)} />)
                        }
                    </TabPanel>
                    <TabPanel header="Lista" rightIcon="pi pi-list ml-2">
                        <div className='flex flex-col'>
                            {
                                Object.entries(inscrito.numeros)
                                    .map(([numero, comprador]) => !!comprador
                                        ? <div
                                            key={numero}
                                            className='my-4'>
                                            <b>{numero}:</b> {comprador}
                                        </div>
                                        : <Button
                                            key={numero}
                                            label={numero}
                                            loading={loading}
                                            className="p-button-outlined w-12 h-12 p-1 m-1"
                                            onClick={() => onNumeroClick(inscrito, numero)} />
                                    )
                            }
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </Dialog>
    </Fragment>;
}
