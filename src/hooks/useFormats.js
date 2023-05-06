import moment from "moment"

const formatAge = (nascimento) => 
  moment().diff(moment(nascimento, 'DD/MM/YYYY'), 'years')

export const useFormats = () => ({
  formatAge
})