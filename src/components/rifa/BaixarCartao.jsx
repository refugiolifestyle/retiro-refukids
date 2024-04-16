import { Button } from 'primereact/button';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tooltip } from 'primereact/tooltip';
import { Fragment, useEffect, useState } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
import { useVendinhaService } from "../../services/useVendinhaService";
import { useRifaService } from '../../services/useRifaService';

export const BaixarCartao = ({ inscrito }) => {
    let keyIdentifier = `action-baixar-cartao-${inscrito.rede.replaceAll(' ', '_')}-${inscrito.nome.replaceAll(' ', '_')}`

    let params = new URLSearchParams({
        nome: `${inscrito.nome} - ${inscrito.rede}`,
        numeros: JSON.stringify(inscrito.numeros)
    })

    return <Fragment key={keyIdentifier}>
        <a
            href={`download-rifa.html?${params.toString()}`}
            target='_blank'
            className={`p-3`}>
            <i className='pi pi-download' />
        </a>
    </Fragment>;
}
