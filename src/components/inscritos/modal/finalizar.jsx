import { ref, set } from 'firebase/database';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef, useState } from "react";
import { firebaseDatabase } from '../../../configs/firebase';
import { useInscrito } from '../../../hooks/useInscrito';

const deparaValores = {
  "Servo": 260,
  "Criança": 170,
  "Responsável": 270,
  "Convidado": 0
}

export const FinalizarModalInscrito = ({ inscritos }) => {
  const router = useRouter();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const { query } = useRouter();
  const { parse } = useInscrito();

  const salvarInscritos = async () => {
    setLoading(true);

    for (let inscrito of inscritos) {
      let inscritoRef = ref(firebaseDatabase, `inscritos/${inscrito.rede}/${inscrito.nome}`);
      await set(inscritoRef, { ...parse(inscrito) });
    }

    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro finalizado com sucesso' });
  }

  return <>
    <Toast ref={toast} onHide={() => router.replace(query.redirectUrl ? query.redirectUrl : "/inscritos")} />
    <Button
      onClick={salvarInscritos}
      loading={loading}
      disabled={loading}
      className="text-white px-3 py-2 rounded-md text-base font-medium gap-2">
      Finalizar inscrição
    </Button>
  </>
}