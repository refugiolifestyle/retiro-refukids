import { Button } from 'primereact/button';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from 'primereact/dialog';
import { Fragment, useEffect, useState } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
import { useVendinhaService } from "../../services/useVendinhaService";
import { useRifaService } from '../../services/useRifaService';

export const RegistrarVenda = ({ inscrito }) => {
    const [visible, setVisible] = useState(false);
    const { registrarVenda, loading } = useRifaService();

    const onNumeroClick = (inscrito, numero) => {
        let confirm = window.confirm(`Deseja registrar a venda do número ${numero}?`);
        if (confirm) {
            registrarVenda(inscrito, numero)
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
            <div style={{ width: '560px' }}>
                {
                    Object.entries(inscrito.numeros)
                        .map(([numero, vendido]) => <Button
                            key={numero}
                            label={numero}
                            disabled={vendido}
                            loading={loading}
                            className="p-button-outlined p-button-rounded w-12 h-12 p-1 m-1"
                            onClick={() => onNumeroClick(inscrito, numero)} />)
                }
            </div>
        </Dialog>
    </Fragment>;
}
