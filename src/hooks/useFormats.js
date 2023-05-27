import moment from "moment";

const formatAge = (nascimento) =>
  moment().diff(moment(nascimento, 'DD/MM/YYYY'), 'years')

const formatNome = (nome) => nome ? nome.split(' ')
  .map(palavra =>
    palavra.length > 2
      ? `${palavra[0].toUpperCase()}${palavra.slice(1).toLowerCase()}`
      : palavra.toLowerCase())
  .join(' ') : '-'

  const formatDate = (date) => {
    let reference = new Date(Date.parse(date));
    let now = new Date();

    let period = Math.floor(now.getTime() - reference.getTime());
    if (period < 1000 * 60 * 60 * 24 * 7) { // segundo * minuto * hora * dia * semana
        return [
            reference.toLocaleString('pt-BR', {weekday: "short"}),
            "às",
            reference.toLocaleString('pt-BR', {timeStyle: "short"})
        ].join(' ');
    } else {
        return [
            reference.toLocaleString('pt-BR', {dateStyle: "short"}),
            reference.toLocaleString('pt-BR', {timeStyle: "short"})
        ].join(' ');
    }
}

export const useFormats = () => ({
  formatAge,
  formatNome,
  formatDate
})