import { Badge } from 'primereact/badge';
import { Column } from 'primereact/column';
import ListInscritos from '../components/inscritos/list';
import { Page } from '../components/page';
import { ComprasVendinhaModal } from '../components/vendinha/ComprasVendinhaModal';
import { NovaCompraVendinhaModal } from '../components/vendinha/NovaCompraVendinhaModal';
import { useRifaService } from '../services/useRifaService';
import TableInscritos from '../components/inscritos/table';
import { RegistrarVenda } from '../components/rifa/RegistrarVenda';
import { BaixarCartao } from '../components/rifa/BaixarCartao';

export default function Rifa() {
  const { rifa, loading } = useRifaService();

  const buildRifaNumerosColumns = (inscrito) => {
    let totalVendido = Object.values(inscrito.numeros)
      .filter(comprador => !!comprador)
      .length

    return <div key={`action-${inscrito.rede}-${inscrito.nome}`}
      className="flex justify-content-end align-items-center gap-2">
      {totalVendido} {totalVendido == 1 ? "vendido" : "vendidos"}
    </div>
  }

  const buildExtrasColumns = (inscrito) => <div key={`action-${inscrito.rede}-${inscrito.nome}`}
    className="flex justify-content-end align-items-center gap-2">
    <RegistrarVenda inscrito={inscrito} />
    <BaixarCartao inscrito={inscrito} />
  </div>

  return <Page title="Rifa">
    <TableInscritos
      inscritos={rifa}
      loading={loading}
      columnsDefault={["Rede", "Nome"]}
      columnsExtras={[
        <Column
          key="rifaNumeros"
          header="Total vendido"
          body={linha => buildRifaNumerosColumns(linha)}>
        </Column>,
        <Column
          key="rifaAcoes"
          header=""
          body={linha => buildExtrasColumns(linha)}>
        </Column>
      ]}
    />
  </Page>
}