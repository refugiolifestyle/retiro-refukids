import { useInscritosService } from '../../services/useInscritosService';
import TableInscritos from './table';

export default function ListInscritos({loadingExtras, columnsExtras, columnsDefault}) {
  const {inscritos, loading} = useInscritosService()

  return <TableInscritos
    inscritos={inscritos}
    loading={loading || loadingExtras}
    columnsDefault={columnsDefault}
    columnsExtras={columnsExtras} />
}