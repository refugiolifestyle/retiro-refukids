import { Button } from 'primereact/button';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from 'primereact/dialog';
import { Fragment, useEffect, useState } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
import { useVendinhaService } from "../../services/useVendinhaService";
import { useRifaService } from '../../services/useRifaService';

export const BaixarCartao = ({ inscrito }) => {

    const onBaixarClick = () => {
        let params = new URLSearchParams({
            nome: `${inscrito.nome} - ${inscrito.rede}`,
            numeros: JSON.stringify(inscrito.numeros)
        })
        
        window.open(`download-rifa.html?${params.toString()}`, '_blank')
    }

    return <Fragment key={`action-baixar-cartao-${inscrito.rede}-${inscrito.nome}`}>
        <Button
            icon="pi pi-download"
            tooltip="Baixar cartão (atualizado)"
            tooltipOptions={{ position: "bottom" }}
            className="p-button-outlined p-button-rounded p-button-link p-3"
            onClick={() => onBaixarClick()} />
    </Fragment>;
}
