
export const useInscritoService = () => {
  const getParcelasEmAberto = (pagamentos, inscrito) => {
    let parcelasPagasDoInscrito = (inscrito.comprovante || [])
      .reduce((acc, p) => acc.concat(p.parcelas), [])

    let valoresPagosDoInscrito = (inscrito.comprovante || [])
      .reduce((acc, p) => acc + Number.parseFloat(p.valor), 0)

    let parcelasDoRetiroEmAbertoInscrito = pagamentos[inscrito.cargo]
      .parcelas
      .filter(p => Date.now() < new Date(p.dataLimite).getTime() && !parcelasPagasDoInscrito.includes(p.parcela))
      .map((p, i, a) => {
        return {
          parcela: p.parcela,
          valor: ((pagamentos[inscrito.cargo].valor - valoresPagosDoInscrito) / a.length).toFixed(2)
        }
      })

    let parcelasRetiroPagasPeloInscrito = pagamentos[inscrito.cargo].parcelas
      .filter(p => parcelasPagasDoInscrito.includes(p.parcela))
      .map(m => ({
        parcela: m.parcela,
        valor: 0
      }))

    let parcelasZeradas = pagamentos[inscrito.cargo].parcelas
      .map(p => ({
        parcela: p.parcela,
        valor: 0
      }))
      .filter(p => !parcelasRetiroPagasPeloInscrito.some(s => s.parcela === p.parcela) && !parcelasDoRetiroEmAbertoInscrito.some(s => s.parcela === p.parcela))

    return parcelasRetiroPagasPeloInscrito
      .concat(parcelasZeradas)
      .concat(parcelasDoRetiroEmAbertoInscrito)
      .sort((a, b) => a.parcela - b.parcela)
  }

  return {
    getParcelasEmAberto
  }
}