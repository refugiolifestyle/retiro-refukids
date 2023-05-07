import moment from "moment"

const formatAge = (nascimento) =>
  moment().diff(moment(nascimento, 'DD/MM/YYYY'), 'years')

const formatNome = (nome) => nome.split(' ')
  .map(palavra =>
    palavra.length > 2
      ? `${palavra[0].toUpperCase()}${palavra.slice(1).toLowerCase()}`
      : palavra.toLowerCase())
  .join(' ')

export const useFormats = () => ({
  formatAge,
  formatNome
})