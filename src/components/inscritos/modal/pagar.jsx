import { get, ref, set } from 'firebase/database';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { firebaseDatabase, firebaseStorage } from '../../../configs/firebase';
import { useConfigService } from '../../../services/useConfigService';
import { uploadString, ref as storageRef } from 'firebase/storage';

const deparaValores = {
  "Servo": 240,
  "Criança": 75,
  "Responsável": 200,
  "Convidado": 0
}

export const Pagar2ParcelaModal = ({ inscritos, toast }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipoPagamento, setTipoPagamento] = useState(null);
  const { permitirDinheiro, permitirPagamentoParcelas } = useConfigService();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    setTipoPagamento(null);
  }, [permitirDinheiro]);

  const hideModal = () => {
    setLoading(false);
    setTipoPagamento(null);
    reset();
    setVisible(false);
  }

  const salvarComprovante = async (uuid, pagamento) => {
    let comprovantePath = `comprovantes/${uuid}`;
    let comprovanteRef = ref(firebaseDatabase, comprovantePath);

    await set(comprovanteRef, {
      tipoPagamento,
      inscritos: inscritos.map(i => {
        let newI = {
          rede: i.rede,
          nome: i.nome,
          cargo: i.cargo,
          situacaoPagamento: "2ª Parcela"
        }

        if (i.foiAdotada) {
          newI.foiAdotada = i.foiAdotada
        }

        return newI
      }),
      valor: getAmount(),
      data: new Date().toLocaleString("pt-BR"),
      ...pagamento
    });

    return comprovantePath;
  }

  const salvarInscritos = async (comprovante) => {
    for (let inscrito of inscritos) {
      let comprovanteRef = ref(firebaseDatabase, `inscritos/${inscrito.rede}/${inscrito.nome}/comprovante`);
      let comprovanteGet = await get(comprovanteRef);
      let comprovanteSaved = comprovanteGet.val();

      await set(comprovanteRef, [
        ...comprovanteSaved,
        comprovante
      ]);

      let situacaoPagamentoRef = ref(firebaseDatabase, `inscritos/${inscrito.rede}/${inscrito.nome}/situacaoPagamento`);
      await set(situacaoPagamentoRef, "Todas Parcelas");
    }
  }

  const finalizarInscricao = async () => {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: '2ª parcela paga com sucesso' });

    setTimeout(() => {
      hideModal();
    }, 3000);
  }

  const concluirInscricao = async data => {
    setLoading(true);

    if (tipoPagamento === 'Pix') {
      let file = data.comprovante.item(0)

      let reader = new FileReader();
      reader.onload = async ({ target }) => {
        let uuid = v4();
        let extension = file.name.split('.').pop()
        let filePath = `comprovantes/${uuid}.${extension}`
        const comprovanteStorageRef = storageRef(firebaseStorage, filePath);
        await uploadString(comprovanteStorageRef, target.result, 'data_url')

        await salvarComprovante(uuid, {
          arquivo: filePath,
        })

        await salvarInscritos({
          referencia: uuid,
          arquivo: filePath,
          tipoPagamento
        });

        await finalizarInscricao();
      }

      reader.readAsDataURL(file);
    } else if (tipoPagamento === 'Dinheiro') {
      let uuid = v4();

      await salvarComprovante(uuid, {
        quemRecebeu: data.quemRecebeu
      })

      await salvarInscritos({
        referencia: uuid,
        quemRecebeu: data.quemRecebeu,
        tipoPagamento
      });

      await finalizarInscricao();
    }
  }

  let getAmount = () => inscritos.reduce((am, inscrito) => {
    let deparaValor = deparaValores[inscrito.cargo]
    return am + (deparaValor / 2)
  }, 0.0);

  return <>
    {
      permitirPagamentoParcelas === true
        ? <Button
          text
          onClick={() => setVisible(true)}
          label="2ª Parcela"
          icon="pi pi-wallet"
          className="bg-white text-black px-3 py-2 rounded-md text-sm font-medium" />
        : null
    }
    <Dialog
      header="Pagamento da 2ª parcela"
      visible={visible}
      breakpoints={{ '1300px': '80vw', '960px': '75vw', '960px': '75vw', '641px': '85vw', '300px': '95vw' }}
      style={{ width: '50vw' }}
      onHide={hideModal}>
      <div className="flex flex-col sm:flex-row gap-6">
        <label htmlFor="PixTipoId" className={classNames(
          tipoPagamento === 'Pix' ? "border-indigo-700 font-semibold" : " border-indigo-100 font-light",
          "flex flex-1 justify-center items-center gap-4 text-lg border-2 rounded-lg py-4 cursor-pointer "
        )}>
          <RadioButton inputId="PixTipoId" value="Pix" onChange={(e) => setTipoPagamento('Pix')} checked={tipoPagamento === 'Pix'} />
          Pix
        </label>
        {
          permitirDinheiro === true
            ? <label htmlFor="DinheiroTipoId" className={classNames(
              tipoPagamento === 'Dinheiro' ? "border-indigo-700 font-semibold" : " border-indigo-100 font-light",
              "flex flex-1 justify-center items-center gap-4 text-lg border-2 rounded-lg py-4 cursor-pointer "
            )}>
              <RadioButton inputId="DinheiroTipoId" value="Dinheiro" onChange={(e) => setTipoPagamento('Dinheiro')} checked={tipoPagamento === 'Dinheiro'} />
              Dinheiro
            </label>
            : null
        }
      </div>
      <form onSubmit={handleSubmit(concluirInscricao)} className='mt-4'>
        <div className="flex flex-col sm:flex-row py-2">
          <label className="text-base font-semibold w-64">Valor total</label>
          <div className="flex flex-1 flex-col">
            {new Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" }).format(getAmount())}
          </div>
        </div>
        {
          tipoPagamento === 'Pix'
            ? <div className="flex flex-col sm:flex-row py-2">
              <label className="text-base font-semibold w-64">Comprovante de pagamento *</label>
              <div className="flex flex-1 flex-col">
                <input {...register('comprovante', { required: tipoPagamento === 'Pix' })} type='file' />
                {errors.comprovante && <span className="text-red-700 text-sm mt-1">Campo obrigatório</span>}
              </div>
            </div>
            : null
        }
        {
          tipoPagamento === 'Dinheiro' ?
            <div className="flex flex-col sm:flex-row py-2">
              <label className="text-base font-semibold w-64">Quem Recebeu *</label>
              <div className="flex flex-1 flex-col">
                <InputText {...register('quemRecebeu', { required: tipoPagamento === 'Dinheiro' })} />
                {errors.quemRecebeu && <span className="text-red-700 text-sm mt-1">Campo obrigatório</span>}
              </div>
            </div>
            : null
        }
        {
          tipoPagamento !== null
            ?
            <div className="flex flex-1 justify-end items-center mt-8">
              <button
                onClick={hideModal}
                className="text-black px-3 py-2 rounded-md text-sm">
                Cancelar
              </button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="bg-indigo-700 text-white px-3 py-2 rounded-md text-base font-medium gap-2">
                Concluir pagamento
              </Button>
            </div>
            : null
        }
      </form>
    </Dialog>
  </>
}