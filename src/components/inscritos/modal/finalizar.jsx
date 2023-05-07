import { ref, set } from 'firebase/database';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { firebaseDatabase } from '../../../configs/firebase';

const deparaValores = {
  "Servo": 110,
  "Criança": 125,
  "Responsável": 145
}

export const FinalizarModalInscrito = ({ inscritos }) => {
  const router = useRouter();
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const hideModal = () => {
    setVisible(false);
    reset();
  }

  const concluirInscricao = async data => {
    setLoading(true);

    let reader = new FileReader();
    reader.onload = async ({ target }) => {
      let uuid = v4();
      let comprovantePath = `comprovante/${uuid}`;
      let comprovanteRef = ref(firebaseDatabase, comprovantePath);
      await set(comprovanteRef, {
        inscritos: inscritos.map(({ rede, cargo, nome }) => ({ rede, cargo, nome })),
        comprovante: target.result,
        valor: getAmount(),
        data: new Date().toLocaleString("pt-BR")
      });

      for (let inscrito of inscritos) {
        console.log(inscrito)
        let inscritoRef = ref(firebaseDatabase, `inscritos/${inscrito.rede}/${inscrito.nome}`);
        await set(inscritoRef, {
          ...inscrito,
          comprovante: {
            referencia: comprovantePath,
            arquivo: target.result
          }
        });
      }

      toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro finalizado com sucesso' });
      
      setTimeout(() => {      
        setLoading(false);
        hideModal();

        router.replace('/inscritos');
      }, 3000);
    }

    reader.readAsDataURL(data.comprovante.item(0));
  }

  let getAmount = () => inscritos.reduce((am, inscrito) => {
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
      <form onSubmit={handleSubmit(concluirInscricao)}>
        <div className="flex flex-col sm:flex-row py-2">
          <label className="text-base font-semibold w-64">Valor total</label>
          <div className="flex flex-1 flex-col">
            {new Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" }).format(getAmount())}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row py-2">
          <label className="text-base font-semibold w-64">Comprovante de pagamento</label>
          <div className="flex flex-1 flex-col">
            <input {...register('comprovante', { required: true })} type='file' />
            {errors.comprovante && <span className="text-red-700 text-sm mt-1">Campo obrigatório</span>}
          </div>
        </div>
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
      </form>
    </Dialog>
  </>
}