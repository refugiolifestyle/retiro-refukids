import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { MultiSelect } from 'primereact/multiselect';
import { RadioButton } from "primereact/radiobutton";
import { SelectButton } from 'primereact/selectbutton';
import { classNames } from "primereact/utils";
import { Checkbox } from 'primereact/checkbox';
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useConfigService } from '../../../services/useConfigService';
import { useInscritosService } from '../../../services/useInscritosService';
import { useRedesService } from "../../../services/useRedesService";
import { useEquipesService } from "../../../services/useEquipesService";

export const NovoModalInscrito = ({ adicionarInscrito, inscritosAdded }) => {
  const redes = useRedesService();
  const equipes = useEquipesService();
  const { inscritos, loading } = useInscritosService();
  const { permitirInscricao, permitirAdocao, tiosAdotivos } = useConfigService();

  const [visible, setVisible] = useState(false);
  const [tipoInscricao, setTipoInscricao] = useState(null);
  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm();

  const onSubmit = data => {
    switch (tipoInscricao) {
      case "SERVO":
        delete data.nascimento
        delete data.observacao
        delete data.criancas
        delete data.foiAdotada
        delete data.quemAdotou
        break;
      case "CRIANCA":
        delete data.telefone
        delete data.criancas
        delete data.equipe
        break;
      case "RESPONSAVEL":
        delete data.nascimento
        delete data.observacao
        delete data.equipe
        delete data.foiAdotada
        delete data.quemAdotou
        break;
      default:
        delete data.nascimento
        delete data.observacao
        delete data.equipe
        delete data.criancas
        delete data.foiAdotada
        delete data.quemAdotou
        break;
    }
    adicionarInscrito(data, tipoInscricao);

    hideModal();
  };

  const hideModal = () => {
    setTipoInscricao(null);
    reset();

    setVisible(false);
  }

  let criancasSaved = []
    .concat(inscritosAdded)
    .concat(inscritos)
    .filter(i => i.cargo === 'Criança');

  criancasSaved.sort((a, b) => a.nome.localeCompare(b.nome))

  return <>
    <button
      onClick={() => setVisible(true)}
      className="text-white border border-white px-3 py-2 rounded-md text-sm font-medium">
      Adicionar inscrito
    </button>
    <Dialog
      header="Adicionar um inscrito"
      visible={visible}
      breakpoints={{ '1300px': '80vw', '960px': '75vw', '960px': '75vw', '641px': '85vw', '300px': '95vw' }}
      style={{ width: '50vw' }}
      onHide={hideModal}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col sm:flex-row gap-6">
          {
            permitirInscricao === true
              ? <>
                <label htmlFor="servoTipoId" className={classNames(
                  tipoInscricao === 'SERVO' ? "border-indigo-700 font-semibold" : " border-indigo-100 font-light",
                  "flex flex-1 justify-center items-center gap-4 text-lg border-2 rounded-lg py-4 cursor-pointer "
                )}>
                  <RadioButton inputId="servoTipoId" value="SERVO" onChange={(e) => setTipoInscricao('SERVO')} checked={tipoInscricao === 'SERVO'} />
                  Servo
                </label>
                <label htmlFor="criancaTipoId" className={classNames(
                  tipoInscricao === 'CRIANCA' ? "border-indigo-700 font-semibold" : " border-indigo-100 font-light",
                  "flex flex-1 justify-center items-center gap-4 text-lg border-2 rounded-lg py-4 cursor-pointer "
                )}>
                  <RadioButton inputId="criancaTipoId" value="CRIANCA" onChange={(e) => setTipoInscricao('CRIANCA')} checked={tipoInscricao === 'CRIANCA'} />
                  Criança
                </label>
                <label htmlFor="responsavelTipoId" className={classNames(
                  tipoInscricao === 'RESPONSAVEL' ? "border-indigo-700 font-semibold" : " border-indigo-100 font-light",
                  "flex flex-1 justify-center items-center gap-4 text-lg border-2 rounded-lg py-4 cursor-pointer "
                )}>
                  <RadioButton inputId="responsavelTipoId" value="RESPONSAVEL" onChange={(e) => setTipoInscricao('RESPONSAVEL')} checked={tipoInscricao === 'RESPONSAVEL'} />
                  Responsável
                </label>
              </>
              : <label htmlFor="convidadoId" className={classNames(
                tipoInscricao === 'CONVIDADO' ? "border-indigo-700 font-semibold" : " border-indigo-100 font-light",
                "flex flex-1 justify-center items-center gap-4 text-lg border-2 rounded-lg py-4 cursor-pointer "
              )}>
                <RadioButton inputId="convidadoId" value="CONVIDADO" onChange={(e) => setTipoInscricao('CONVIDADO')} checked={tipoInscricao === 'CONVIDADO'} />
                Convidado
              </label>
          }
        </div>

        {
          tipoInscricao === 'RESPONSAVEL'
            ? <Message className='w-full mt-8' severity="info" text="Primeiro realize o cadastro das suas crianças" />
            : null
        }

        {tipoInscricao !== null
          ? <>
            <div className="flex flex-col sm:flex-row py-2 mt-8">
              <label className="text-base w-52">Sexo *</label>
              <div className="flex flex-1 flex-col">
                <SelectButton {...register('sexo', { required: true })} options={['Masculino', 'Feminino']} value={watch('sexo')} />
                {errors.sexo && <span className="text-red-700 text-sm mt-1">Campo obrigatório</span>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row py-2">
              <label className="text-base w-52">Nome *</label>
              <div className="flex flex-1 flex-col">
                <InputText {...register('nome', { required: true })} />
                {errors.nome && <span className="text-red-700 text-sm mt-1">Campo obrigatório</span>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row py-2">
              <label className="text-base w-52">Rede *</label>
              <div className="flex flex-1 flex-col">
                <Dropdown value={watch('rede')} {...register('rede', { required: true })} options={redes} />
                {errors.rede && <span className="text-red-700 text-sm mt-1">Campo obrigatório</span>}
              </div>
            </div>

            {
              tipoInscricao === 'CRIANCA'
                ? <>
                  <div className="flex flex-col sm:flex-row py-2">
                    <label className="text-base w-52">Dt. Nascimento *</label>
                    <div className="flex flex-1 flex-col">
                      <Calendar {...register('nascimento', { required: tipoInscricao === 'CRIANCA' })} dateFormat="dd/mm/yy" />
                      {errors.nascimento && <span className="text-red-700 text-sm mt-1">Campo obrigatório</span>}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row py-2">
                    <label className="text-base w-52">Observação</label>
                    <InputTextarea {...register('observacao')} rows={2} className="flex-1" />
                  </div>

                  {
                    permitirAdocao && <>
                      <div className="flex flex-col sm:flex-row py-2 pb-5">
                        <label htmlFor="foiAdotada" className="text-base w-52">Criança adotada</label>
                        <Controller
                          control={control}
                          name="foiAdotada"
                          render={({ field }) => (
                            <Checkbox inputId="foiAdotada" trueValue={'Sim'} falseValue={'Não'} checked={field.value} {...field} />
                          )}
                        />
                      </div>

                      {
                        watch('foiAdotada') === 'Sim' && <div className="flex flex-col sm:flex-row py-2">
                          <label className="text-base w-52">Quem adotou *</label>
                          <div className="flex flex-1 flex-col">
                            <Dropdown value={watch('quemAdotou')} {...register('quemAdotou', { required: true })} options={tiosAdotivos} />
                            {errors.quemAdotou && <span className="text-red-700 text-sm mt-1">Campo obrigatório</span>}
                          </div>
                        </div>
                      }
                    </>
                  }
                </>
                : null
            }
            {
              ['RESPONSAVEL', 'SERVO', 'CONVIDADO'].includes(tipoInscricao)
                ?
                <div className="flex flex-col sm:flex-row py-2">
                  <label className="text-base w-52">Telefone *</label>
                  <div className="flex flex-1 flex-col">
                    <InputMask {...register(`telefone`, { required: ['RESPONSAVEL', 'SERVO', 'CONVIDADO'].includes(tipoInscricao) })} mask="(99) 99999-9999" />
                    {errors.telefone && <span className="text-red-700 text-sm mt-1">Campo obrigatório</span>}
                  </div>
                </div>
                : null
            }
            {
              tipoInscricao === 'RESPONSAVEL'
                ? <>
                  <div className="flex flex-col sm:flex-row py-2">
                    <label className="text-base w-52">Crianças *</label>
                    <div className="flex flex-1 flex-col">
                      <MultiSelect
                        {...register('criancas', { required: tipoInscricao === 'RESPONSAVEL' })}
                        value={watch('criancas')}
                        options={criancasSaved}
                        optionLabel="nome"
                        optionValue="nome"
                        filter
                        emptyFilterMessage="Nenhuma criança adicionada"
                        placeholder={loading ? "Carregando..." : "Selecione suas crianças"}
                        className="flex-1" />
                      {errors.criancas && <span className="text-red-700 text-sm mt-1">Campo obrigatório</span>}
                    </div>
                  </div>
                </>
                : null
            }

            {
              tipoInscricao === 'SERVO'
                ? <>
                  <div className="flex flex-col sm:flex-row py-2">
                    <label className="text-base w-52">Equipe *</label>
                    <div className="flex flex-1 flex-col">
                      <Dropdown value={watch('equipe')} {...register('equipe', { required: true })} options={equipes} />
                      {errors.equipe && <span className="text-red-700 text-sm mt-1">Campo obrigatório</span>}
                    </div>
                  </div>
                </>
                : null
            }
            <div className="flex flex-1 justify-end items-center mt-8">
              <button
                onClick={hideModal}
                className="text-black px-3 py-2 rounded-md text-sm">
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-indigo-700 text-white px-3 py-2 rounded-md text-base font-medium">
                Adicionar inscrito
              </button>
            </div>
          </>
          : null}
      </form>
    </Dialog >
  </>
}