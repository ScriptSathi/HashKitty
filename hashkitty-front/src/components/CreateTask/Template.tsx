import { Control, UseFormRegister, useController } from 'react-hook-form';
import { TTemplate } from '../../types/TypesORM';
import Radios from '../ui/Radios/Radios';
import { CreateTaskForm } from '../../types/TComponents';

type TypeSetInput<T extends string | number | boolean | null = string> = [
   keyof CreateTaskForm,
   React.Dispatch<React.SetStateAction<T>>,
];

type TemplateProps = {
   list: TTemplate[];
   control: Control<CreateTaskForm>;
   register: UseFormRegister<CreateTaskForm>;
   inputWordlist: TypeSetInput<string | null>;
   inputPotfile: TypeSetInput<string | null>;
   inputAttackMode: TypeSetInput<string | null>;
   inputBreakTemp: TypeSetInput<number | null>;
   inputWorkloadProfile: TypeSetInput<number | null>;
   inputKernelOpti: TypeSetInput<boolean>;
   inputCpuOnly: TypeSetInput<boolean>;
   inputMaskQuery: TypeSetInput<string>;
};

export default function Template({
   list,
   control,
   register,
   inputWordlist: [fieldNameWordlist, setInputWordlist],
   inputPotfile: [fieldNamePotfile, setInputPotfile],
   inputAttackMode: [fieldNameAttackMode, setAttackMode],
   inputBreakTemp: [fieldNameBreakTemp, setBreakTemp],
   inputWorkloadProfile: [fieldNameWorkloadProfile, setWorkloadProfile],
   inputCpuOnly: [fieldNameCpuOnly, setCpuOnly],
   inputKernelOpti: [fieldNameKernelOpti, setKernelOpti],
   inputMaskQuery: [fieldNameMaskQuery, setMaskQuery],
}: TemplateProps) {
   const { field: fieldWordlist } = useController<CreateTaskForm>({
      control,
      name: fieldNameWordlist,
   });
   const { field: fieldPotfile } = useController<CreateTaskForm>({
      control,
      name: fieldNamePotfile,
   });
   const { field: fieldAttackMode } = useController<CreateTaskForm>({
      control,
      name: fieldNameAttackMode,
   });
   const { field: fielWorkloadProfile } = useController<CreateTaskForm>({
      control,
      name: fieldNameWorkloadProfile,
   });
   const { field: fieldBreakTemp } = useController<CreateTaskForm>({
      control,
      name: fieldNameBreakTemp,
   });
   const { field: fieldCpuOnly } = useController<CreateTaskForm>({
      control,
      name: fieldNameCpuOnly,
   });
   const { field: fieldKernelOpti } = useController<CreateTaskForm>({
      control,
      name: fieldNameKernelOpti,
   });
   const { field: fieldMaskQuery } = useController<CreateTaskForm>({
      control,
      name: fieldNameMaskQuery,
   });

   const onChange = ({ elem }: { elem: TTemplate }) => {
      fieldWordlist.onChange(elem.options.wordlistId.name);
      fieldPotfile.onChange(elem.options.potfileName);
      fieldBreakTemp.onChange(elem.options.breakpointGPUTemperature);
      fielWorkloadProfile.onChange(elem.options.workloadProfileId.profileId);
      fieldAttackMode.onChange(elem.options.attackModeId.id.toString());
      fieldCpuOnly.onChange(elem.options.CPUOnly);
      fieldKernelOpti.onChange(elem.options.kernelOpti);
      fieldMaskQuery.onChange(elem.options.maskQuery || '');
      setMaskQuery(elem.options.maskQuery || '');
      setKernelOpti(elem.options.kernelOpti);
      setInputWordlist(elem.options.wordlistId.name);
      setAttackMode(elem.options.attackModeId.id.toString());
      setWorkloadProfile(elem.options.workloadProfileId.profileId);
      setBreakTemp(elem.options.breakpointGPUTemperature);
      setCpuOnly(elem.options.CPUOnly);
      if (elem.options.potfileName) setInputPotfile(elem.options.potfileName);
   };

   return (
      <Radios<TTemplate, CreateTaskForm>
         name="Templates"
         fieldName="templateId"
         list={list}
         register={register}
         onChangeElem={onChange}
      />
   );
}
