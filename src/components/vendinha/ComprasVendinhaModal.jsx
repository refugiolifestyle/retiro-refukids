import { Badge } from "primereact/badge";
import { Button } from 'primereact/button';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from 'primereact/dialog';
import React, { Fragment, useState } from 'react';
import { useFormats } from "../../hooks/useFormats";
import { useVendinhaService } from "../../services/useVendinhaService";

export const ComprasVendinhaModal = ({ inscrito }) => {
    const [visible, setVisible] = useState(false);
    const { formatDate } = useFormats();
    const { quitarVenda, loading } = useVendinhaService();

    const pagarCompras = async () => {
        await quitarVenda(inscrito);
        setVisible(false);
    }

    const getTotal = (pago) => {
        let compras = inscrito.vendinha || [];

        if (pago !== undefined) {
            compras = compras.filter(compra => compra.pago === pago);
        }

        return compras.reduce((am, compra) => {
            return am + (compra.valor * Number.parseInt(compra.quantidade))
        }, 0.0);
    }


    return <Fragment>
        <Button
            icon="pi pi-list"
            tooltip="Visualizar as compras"
            tooltipOptions={{ position: "bottom" }}
            className="p-button-outlined p-button-rounded p-button-link p-3"
            onClick={() => setVisible(true)} />
        <Dialog
            visible={visible}
            onHide={() => setVisible(false)}
            style={{ width: '90%', maxWidth: '75rem' }}
            header={<h2>Compras realizadas</h2>}
            footer={<div className="flex justify-end items-center">
                    <Button
                        disabled={getTotal(false) === 0}
                        loading={loading}  
                        label="Quitar divida"
                        icon="pi pi-check"
                        className="p-button-raised p-button-success h-3rem"
                        onClick={() => pagarCompras()} />
                </div>
            }>
            <div className="flex flex-col p-3 mb-3 gap-3 bg-gray-200">
                <div className="flex justify-between items-center text-green-700">
                    <span className="font-bold">Total pago:</span>
                    <span>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                            .format(getTotal(true))}
                    </span>
                </div>
                <div className="flex justify-between items-center text-red-700">
                    <span className="font-bold">Total à pagar:</span>
                    <span>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                            .format(getTotal(false))}
                    </span>
                </div>
                <div className="flex justify-between items-center font-bold mt-3">
                    <span>Total geral:</span>
                    <span>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                            .format(getTotal())}
                    </span>
                </div>
            </div>
            <DataTable
                stripedRows
                paginator
                rows={5}
                value={inscrito.vendinha}
                emptyMessage="Não foi encontrado resultado">
                <Column
                    field="produto"
                    header="Produto">
                </Column>
                <Column
                    field="data"
                    header="Data da compra"
                    body={({ data }) => formatDate(data)}></Column>
                <Column
                    field="quantidade"
                    header="Quantidade">
                </Column>
                <Column
                    header="Situação"
                    body={({ pago }) =>
                        <Badge
                            value={pago ? "Pago" : "Falta pagar"}
                            severity={pago ? "success" : "warning"}
                            size="large"
                        ></Badge>
                    }></Column>
                <Column
                    header="Valor Total"
                    body={({ valor, quantidade }) =>
                        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                            .format(valor * Number.parseInt(quantidade))
                    }></Column>
            </DataTable>
        </Dialog>
    </Fragment>;
}
