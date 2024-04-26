import { Button } from 'primereact/button';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from 'primereact/dialog';
import { Fragment, useEffect, useState } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
import { useVendinhaService } from "../../../services/useVendinhaService";

export const NovaCompraVendinhaModal = ({ inscrito, produtos }) => {
    const [visible, setVisible] = useState(false);
    const [totalGeral, setTotalGeral] = useState(0);
    const { finalizarVenda, loading } = useVendinhaService();
    const { control, register, handleSubmit, watch, formState: { errors } } = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "compras",
    });

    useEffect(() => {
        const subscription = watch((value) => {
            let totalGeral = (value.compras ? value.compras : []).reduce((a, c) => {
                return a + (c.valor * (c.quantidade ? Number.parseInt(c.quantidade) : 0));
            }, 0.0);

            setTotalGeral(totalGeral);
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    const realizarCompra = (pago = true) => async (data) => {
        let compras = data.compras
            .filter((compra) => compra.quantidade && /^\d+$/.test(compra.quantidade))
            .map((compra) => ({
                ...compra,
                pago
            }));

        await finalizarVenda(inscrito, compras);

        hideModal();
    }

    const showModal = () => {
        produtos.forEach(produto =>
            append(produto));

        setVisible(true);
    }
    const hideModal = () => {
        setVisible(false);
        remove();
    }

    return <Fragment>
        <Button
            icon="pi pi-plus"
            tooltip="Fazer uma nova compra"
            tooltipOptions={{ position: "bottom" }}
            className="p-button-outlined p-button-rounded p-button-link p-3"
            onClick={() => showModal()} />
        <Dialog
            visible={visible}
            onHide={hideModal}
            style={{ width: '90%', maxWidth: '75rem' }}
            header={<h2>Total {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(totalGeral)}</h2>}
            footer={<div className="flex justify-end items-center pt-5">
                <Button
                    disabled={totalGeral == 0}
                    loading={loading}
                    label="Pagar agora"
                    icon="pi pi-check"
                    className="p-button-raised p-button-success h-3rem"
                    onClick={handleSubmit(realizarCompra(true))} />
                <Button
                    disabled={totalGeral == 0}
                    loading={loading}
                    label="Colocar na conta"
                    icon="pi pi-clock"
                    className="p-button-raised p-button-warning h-3rem"
                    onClick={handleSubmit(realizarCompra(false))} />
            </div>
            }>
            <form>
                <DataTable value={fields} size="small" emptyMessage="Não foi encontrado resultado" stripedRows>
                    <Column
                        field="produto"
                        header="Produto"
                        headerClassName={"py-3"}
                        style={{ width: '50%' }}>
                    </Column>
                    <Column
                        field="valor"
                        header="Valor"
                        headerClassName={"py-3 w-7rem"}
                        style={{ width: '25%' }}
                        body={({ valor }) =>
                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
                        }></Column>
                    <Column
                        header="Quantidade"
                        headerClassName={"py-3"}
                        style={{ width: '25%' }}
                        body={(produto, { rowIndex }) => <div className="ml-2">
                            <input
                                type="text"
                                placeholder={`Quantidade de ${produto.produto}`}
                                className={`text-2xl text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary ${errors?.compras?.[rowIndex] ? 'p-invalid' : ''}`}
                                {...register(`compras.${rowIndex}.quantidade`, {
                                    validate: value => !value || value && /^\d+$/.test(value)
                                })} />
                            {errors?.compras?.[rowIndex] &&
                                <small className="p-error">Digite uma quantidade fechada</small>}
                        </div>}></Column>
                </DataTable>
            </form>
        </Dialog>
    </Fragment>;
}
