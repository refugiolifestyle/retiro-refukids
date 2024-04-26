import { get, ref } from "firebase/database";
import { firebaseDatabase } from "../configs/firebase";

export const useComprovantesService = () => {
  const buscarComprovante = async (comprovante) => {
    let comprovanteRef = ref(firebaseDatabase, `comprovantes/${comprovante}`);
    let comprovanteGet = await get(comprovanteRef);

    return {
      uuid: comprovante,
      ...comprovanteGet.val()
    }
  }

  return {
    buscarComprovante
  }
}