import { ref, set } from 'firebase/database';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useEffect, useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { firebaseDatabase, firebaseStorage } from '../../../configs/firebase';
import { useInscrito } from '../../../hooks/useInscrito';
import { useConfigService } from '../../../services/useConfigService';
import { uploadString, ref as storageRef } from 'firebase/storage';

const deparaValores = {
  "Servo": 260,
  "Criança": 170,
  "Responsável": 270,
  "Convidado": 0
}

export const FinalizarModalInscrito = ({ inscritos }) => {
  const router = useRouter();
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipoPagamento, setTipoPagamento] = useState(null);
  const { query } = useRouter();
  const { permitirDinheiro, permitirPix, permitirInscricao, permitirVendinha, pagamentos } = useConfigService();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { parse } = useInscrito();

  useEffect(() => {
    setTipoPagamento(null);
  }, [permitirDinheiro]);

  const hideModal = () => {
    setVisible(false);
    setLoading(false);
    setTipoPagamento(null);
    reset();
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
          parcelas: i.situacaoPagamento.map(m => m.parcela),
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
      let inscritoRef = ref(firebaseDatabase, `inscritos/${inscrito.rede}/${inscrito.nome}`);

      if (comprovante) {
        await set(inscritoRef, {
          ...parse(inscrito),
          comprovante: [{
            ...comprovante,
            valor: inscrito.situacaoPagamento.reduce((acc, a) => acc + Number.parseFloat(a.valor), 0),
            parcelas: inscrito.situacaoPagamento.map(m => m.parcela)
          }]
        });
      } else {
        await set(inscritoRef, { ...parse(inscrito) });
      }

      let situacaoPagamentoRef = ref(firebaseDatabase, `inscritos/${inscrito.rede}/${inscrito.nome}/situacaoPagamento`);
      await set(situacaoPagamentoRef, inscrito.situacaoPagamento.map(m => `${m.parcela}ª Parcela`));
    }
  }

  const finalizarInscricao = async () => {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro finalizado com sucesso' });

    setTimeout(() => {
      setLoading(false);
      hideModal();

      router.replace(query.redirectUrl ? query.redirectUrl : "/inscritos");
    }, 3000);
  }

  const concluirInscricao = async data => {
    setLoading(true);

    if (tipoPagamento === 'Convidado') {
      await salvarInscritos(null);

      await finalizarInscricao();
    } else if (tipoPagamento === 'Pix') {
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
    if (inscrito.foiAdotada === 'Sim') {
      return am
    }

    return am + inscrito.situacaoPagamento.reduce((acc, a) => acc + Number.parseFloat(a.valor), 0)
  }, 0.0);

  return <>
    <Toast ref={toast} />
    <button
      onClick={() => setVisible(true)}
      className="bg-white text-black px-3 py-2 rounded-md text-sm font-medium">
      Finalizar Inscrição
    </button>
    <Dialog
      header="Finalizar inscrição"
      visible={visible}
      breakpoints={{ '1300px': '80vw', '960px': '75vw', '960px': '75vw', '641px': '85vw', '300px': '95vw' }}
      style={{ width: '50vw' }}
      onHide={hideModal}>
      <div className="flex flex-col sm:flex-row gap-6">
        {
          permitirInscricao === true
            ? <>
              {
                permitirPix === true
                  ? <label htmlFor="PixTipoId" className={classNames(
                    tipoPagamento === 'Pix' ? "border-indigo-700 font-semibold" : " border-indigo-100 font-light",
                    "flex flex-1 justify-center items-center gap-4 text-lg border-2 rounded-lg py-4 cursor-pointer "
                  )}>
                    <RadioButton inputId="PixTipoId" value="Pix" onChange={(e) => setTipoPagamento('Pix')} checked={tipoPagamento === 'Pix'} />
                    Pix
                  </label>
                  : null
              }
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
            </>
            : null
        }
        {
          permitirVendinha
            && router.query.redirectUrl === '/vendinha'
            ? <label htmlFor="ConvidadoTipoId" className={classNames(
              tipoPagamento === 'Convidado' ? "border-indigo-700 font-semibold" : " border-indigo-100 font-light",
              "flex flex-1 justify-center items-center gap-4 text-lg border-2 rounded-lg py-4 cursor-pointer "
            )}>
              <RadioButton inputId="ConvidadoTipoId" value="Convidado" onChange={(e) => setTipoPagamento('Convidado')} checked={tipoPagamento === 'Convidado'} />
              Convidado
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
                Concluir inscrição
              </Button>
            </div>
            : null
        }
      </form>
    </Dialog>
  </>
}