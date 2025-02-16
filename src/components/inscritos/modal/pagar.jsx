import { get, ref, set } from 'firebase/database';
import { ref as storageRef, uploadString } from 'firebase/storage';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { SelectButton } from 'primereact/selectbutton';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { firebaseDatabase, firebaseStorage } from '../../../configs/firebase';
import { useConfigService } from '../../../services/useConfigService';
import { useInscritoService } from '../../../services/useInscritoService';

export const Pagar2ParcelaModal = ({ inscrito, toast }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipoPagamento, setTipoPagamento] = useState(null);
  const { permitirDinheiro, permitirPagamentoParcelas, pagamentos } = useConfigService();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  const { getParcelasEmAberto } = useInscritoService();

  const parcelasEmAberto = pagamentos && inscrito
    ? getParcelasEmAberto(pagamentos, inscrito)
      .map(m => ({
        label: `${m.parcela}ª Parcela`,
        valor: m.valor,
        parcela: m.parcela,
        disabled: m.valor == 0
      }))
    : []

  const valorTotal = watch('situacaoPagamento') 
    ? watch('situacaoPagamento').reduce((acc, p) => acc + Number.parseFloat(p.valor), 0)
    : 0

  useEffect(() => {
    setTipoPagamento(null);
  }, [permitirDinheiro]);

  const hideModal = () => {
    setLoading(false);
    setTipoPagamento(null);
    reset();
    setVisible(false);
  }

  const salvarComprovante = async (uuid, _pagamento) => {
    let comprovantePath = `comprovantes/${uuid}`;
    let comprovanteRef = ref(firebaseDatabase, comprovantePath);

    let { parcelas, ...pagamento } = _pagamento

    await set(comprovanteRef, {
      tipoPagamento,
      inscritos: [{
        rede: inscrito.rede,
        nome: inscrito.nome,
        cargo: inscrito.cargo,
        foiAdotada: inscrito.foiAdotada || null,
        parcelas: parcelas
      }],
      valor: valorTotal,
      data: new Date().toLocaleString("pt-BR"),
      ...pagamento
    });

    return comprovantePath;
  }

  const salvarInscritos = async (comprovante) => {
    let comprovanteRef = ref(firebaseDatabase, `inscritos/${inscrito.rede}/${inscrito.nome}/comprovante`);
    let comprovanteGet = await get(comprovanteRef);
    let comprovanteSaved = comprovanteGet.val();

    let newCom = [
      ...comprovanteSaved,
      comprovante
    ]
    await set(comprovanteRef, newCom);

    let situacaoPagamentoRef = ref(firebaseDatabase, `inscritos/${inscrito.rede}/${inscrito.nome}/situacaoPagamento`);
    await set(situacaoPagamentoRef, newCom.reduce((acc, c) => acc.concat(c.parcelas), []).map(m => `${m}ª Parcela`));
  }

  const finalizarInscricao = async () => {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Parcelas pagas com sucesso' });

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
        quemRecebeu: data.quemRecebeu,
        parcelas: data.situacaoPagamento.map(m => m.parcela)
      })

      await salvarInscritos({
        referencia: uuid,
        quemRecebeu: data.quemRecebeu,
        tipoPagamento,
        parcelas: data.situacaoPagamento.map(m => m.parcela),
        valor: valorTotal,
      });

      await finalizarInscricao();
    }
  }

  return <>
    {
      permitirPagamentoParcelas === true
        ? <Button
          text
          onClick={() => setVisible(true)}
          label="Pagar parcelas"
          icon="pi pi-wallet"
          className="bg-white text-black px-3 py-2 rounded-md text-sm font-medium" />
        : null
    }
    <Dialog
      header="Pagamento das parcelas"
      visible={visible}
      onHide={() => hideModal()}
      breakpoints={{ '1300px': '80vw', '960px': '75vw', '960px': '75vw', '641px': '85vw', '300px': '95vw' }}
      style={{ width: '50vw' }}>
      <div className="flex flex-col sm:flex-row gap-6">
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
          <label className="text-base font-semibold w-64">Parcelas à pagar</label>
          <div className="flex flex-1 flex-col">
            <SelectButton {...register('situacaoPagamento', { required: true })} options={parcelasEmAberto} value={watch('situacaoPagamento')} multiple />
            {errors.situacaoPagamento && <span className="text-red-700 text-sm mt-1">Campo obrigatório</span>}
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
        <div className="flex flex-col sm:flex-row py-2">
          <label className="text-base font-semibold w-64">Valor total</label>
          <div className="flex flex-1 flex-col">
            {new Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" }).format(valorTotal)}
          </div>
        </div>
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