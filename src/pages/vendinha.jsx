import { Badge } from 'primereact/badge';
import { Column } from 'primereact/column';
import ListInscritos from '../components/inscritos/list';
import { Page } from '../components/page';
import { ComprasVendinhaModal } from '../components/vendinha/modal/compras';
import { NovaCompraVendinhaModal } from '../components/vendinha/modal/nova-compra';
import { useVendinhaService } from '../services/useVendinhaService';

export default function Vendinha() {
  const { produtos, loading } = useVendinhaService();

  const buildSaldoColumn = (inscrito) => {
    let saldoGrupo = (inscrito.vendinha ? inscrito.vendinha : []).reduce(
      (sa, venda) => sa + (venda.pago ? 0 : (Number.parseInt(venda.quantidade) * venda.valor)), 0.0)

    return <Badge key={`saldo-${inscrito.rede}-${inscrito.nome}`}
      value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoGrupo || 0)}
      severity={saldoGrupo > 0 ? "warning" : "success"}>
    </Badge>;
  }

  const buildExtrasColumns = (inscrito) => <div key={`action-${inscrito.rede}-${inscrito.nome}`}
    className="flex justify-content-end align-items-center gap-2">
    <NovaCompraVendinhaModal inscrito={inscrito} produtos={produtos} />
    <ComprasVendinhaModal inscrito={inscrito} />
  </div>

  return <Page title="Vendinha" actions={<a
    href='/inscritos/novo?redirectUrl=/vendinha'
    className="bg-white text-black px-3 py-2 rounded-md text-sm font-medium">
    Cadastrar convidado
  </a>}>
    <ListInscritos loadingExtras={loading}
      columnsDefault={["Rede", "Cargo", "Nome"]}
      columnsExtras={[
        <Column
          key="vendinhaSaldoDevedor"
          header="Saldo devedor"
          body={linha => buildSaldoColumn(linha)}>
        </Column>,
        <Column
          key="vendinhaAcoes"
          header=""
          body={linha => buildExtrasColumns(linha)}>
        </Column>
      ]} />
  </Page>
}