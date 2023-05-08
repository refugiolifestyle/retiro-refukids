import { useInscritosService } from '../../services/useInscritosService';
import TableInscritos from './table';

export default function ListInscritos() {
  const {inscritos, loading} = useInscritosService()

  return <TableInscritos
    inscritos={inscritos}
    loading={loading} />
}