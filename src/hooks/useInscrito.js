import moment from "moment";
import { useFormats } from "./useFormats";

const parse = (inscrito) => {
  const { formatAge, formatNome } = useFormats();

  if (inscrito.nascimento) {
    let dtNascimento = inscrito.nascimento;
    if (typeof dtNascimento !== 'string') {
      dtNascimento = moment(inscrito.nascimento).format("DD/MM/YYYY")
    }

    inscrito.nascimento = dtNascimento
    inscrito.idade = formatAge(dtNascimento)
  }

  if (inscrito.criancas) {
    let criancas = inscrito.criancas;
    if (typeof criancas === 'string') {
      criancas = [criancas]
    }

    inscrito.criancas = criancas
      .map(nome => formatNome(nome))
      .join(', ')
  }


  inscrito.nome = formatNome(inscrito.nome)
  return inscrito
}

export const useInscrito = () => ({
  parse
})