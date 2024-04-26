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
  "Servo": 240,
  "Criança": 75,
  "Responsável": 240,
  "Convidado": 0
}

export const FinalizarModalInscrito = ({ inscritos }) => {
  const router = useRouter();
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipoPagamento, setTipoPagamento] = useState(null);
  const { query } = useRouter();
  const { permitirDinheiro, permitirInscricao } = useConfigService();
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
      inscritos: inscritos.map(i => ({ 
        rede: i.rede, 
        cargo: i.cargo, 
        nome: i.nome,
        cargo: i.cargo,
        foiAdotada: !!i.foiAdotada
      })),
      valor: getAmount(),
      data: new Date().toLocaleString("pt-BR"),
      ...pagamento
    });

    return comprovantePath;
  }

  const salvarInscritos = async (comprovante) => {
    for (let inscrito of inscritos) {
      let inscritoRef = ref(firebaseDatabase, `inscritos/${inscrito.rede}/${inscrito.nome}`);

      await set(inscritoRef, {
        ...parse(inscrito),
        comprovante
      });
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
    if (inscrito.foiAdotada === 'Sim') {
      return am
    }

    return am + deparaValores[inscrito.cargo]
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
              <label htmlFor="PIXTipoId" className={classNames(
                tipoPagamento === 'PIX' ? "border-indigo-700 font-semibold" : " border-indigo-100 font-light",
                "flex flex-1 justify-center items-center gap-4 text-lg border-2 rounded-lg py-4 cursor-pointer "
              )}>
                <RadioButton inputId="PIXTipoId" value="PIX" onChange={(e) => setTipoPagamento('Pix')} checked={tipoPagamento === 'PIX'} />
                Pix
              </label>
              {
                permitirDinheiro === true
                  ? <label htmlFor="DinheiroTipoId" className={classNames(
                    tipoPagamento === 'DINHEIRO' ? "border-indigo-700 font-semibold" : " border-indigo-100 font-light",
                    "flex flex-1 justify-center items-center gap-4 text-lg border-2 rounded-lg py-4 cursor-pointer "
                  )}>
                    <RadioButton inputId="DinheiroTipoId" value="DINHEIRO" onChange={(e) => setTipoPagamento('Dinheiro')} checked={tipoPagamento === 'DINHEIRO'} />
                    Dinheiro
                  </label>
                  : null
              }
            </>
            : <label htmlFor="ConvidadoTipoId" className={classNames(
              tipoPagamento === 'CONVIDADO' ? "border-indigo-700 font-semibold" : " border-indigo-100 font-light",
              "flex flex-1 justify-center items-center gap-4 text-lg border-2 rounded-lg py-4 cursor-pointer "
            )}>
              <RadioButton inputId="ConvidadoTipoId" value="CONVIDADO" onChange={(e) => setTipoPagamento('Convidado')} checked={tipoPagamento === 'CONVIDADO'} />
              Convidado
            </label>
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
                <input {...register('comprovante', { required: tipoPagamento === 'PIX' })} type='file' />
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
                <InputText {...register('quemRecebeu', { required: tipoPagamento === 'DINHEIRO' })} />
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