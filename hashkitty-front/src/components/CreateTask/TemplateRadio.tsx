import { Control, UseFormRegister, useController } from 'react-hook-form';
import { TTemplate } from '../../types/TypesORM';
import Radios from '../ui/Radios/Radios';
import { CreateTaskForm } from '../../types/TComponents';
import { ListItem } from '../../types/TApi';

type TypeSetInput<T extends string | string[] | number | boolean | null = string> = [
   keyof CreateTaskForm,
   React.Dispatch<React.SetStateAction<T>>,
];

type TemplateProps = {
   list: ListItem<TTemplate>[];
   control: Control<CreateTaskForm>;
   register: UseFormRegister<CreateTaskForm>;
   inputWordlist: TypeSetInput<string | null>;
   inputPotfile: TypeSetInput<string | null>;
   inputAttackMode: TypeSetInput<string | null>;
   inputBreakTemp: TypeSetInput<string | null>;
   inputWorkloadProfile: TypeSetInput<string | null>;
   inputKernelOpti: TypeSetInput<boolean>;
   inputCpuOnly: TypeSetInput<boolean>;
   inputMaskQuery: TypeSetInput<string>;
   inputRules: TypeSetInput<string[]>;
};

export default function TemplateRadio({
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
   inputRules: [fieldNameRules, setRules],
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
   const { field: fieldRules } = useController<CreateTaskForm>({
      control,
      name: fieldNameRules,
   });

   const onChange = ({ elem }: { elem: TTemplate }) => {
      fieldWordlist.onChange(elem.options.wordlistId.name);
      fieldPotfile.onChange(elem.options.potfileName);
      fieldBreakTemp.onChange(elem.options.breakpointGPUTemperature.toString());
      fielWorkloadProfile.onChange(
         elem.options.workloadProfileId.profileId.toString(),
      );
      fieldAttackMode.onChange(elem.options.attackModeId.id.toString());
      fieldCpuOnly.onChange(elem.options.CPUOnly);
      fieldKernelOpti.onChange(elem.options.kernelOpti);
      fieldMaskQuery.onChange(elem.options.maskQuery || '');
      setRules(elem.options.rules?.split(',') ?? []);
      fieldRules.onChange(elem.options.rules?.split(',') ?? []);
      setMaskQuery(elem.options.maskQuery || '');
      setKernelOpti(elem.options.kernelOpti);
      setInputWordlist(elem.options.wordlistId.name);
      setAttackMode(elem.options.attackModeId.id.toString());
      setWorkloadProfile(elem.options.workloadProfileId.profileId.toString());
      setBreakTemp(elem.options.breakpointGPUTemperature.toString());
      setCpuOnly(elem.options.CPUOnly);
      if (elem.options.potfileName) setInputPotfile(elem.options.potfileName);
   };

   const templateList = list.reduce(
      (acc, elem) => [...acc, elem.item],
      [] as TTemplate[],
   );

   return (
      <Radios<TTemplate, CreateTaskForm>
         name="Templates"
         fieldName="templateId"
         list={templateList}
         register={register}
         onChangeElem={onChange}
      />
   );
}
