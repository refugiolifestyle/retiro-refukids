import moment from "moment";
import { useFormats } from "./useFormats";

const parse = (inscrito) => {
  const { formatAge } = useFormats();

  if (inscrito.nascimento) {
    let dtNascimento = inscrito.nascimento;
    if(typeof dtNascimento !== 'string') {
      dtNascimento = moment(inscrito.nascimento).format("DD/MM/YYYY")
    }

    inscrito.nascimento = dtNascimento
    inscrito.idade = formatAge(dtNascimento)
  }

  return inscrito
}

export const useInscrito = () => ({
  parse
})