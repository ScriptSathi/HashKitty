import { Control, UseFormRegister, useController } from 'react-hook-form';
import type { TAttackMode, TTemplate } from '../../types/TypesORM';
import Radios from '../ui/Radios/Radios';
import type { CreateTaskForm } from '../../types/TComponents';
import type { ListItem } from '../../types/TApi';

type TypeSetInput<
   T extends string | string[] | object | boolean | null = string,
> = [keyof CreateTaskForm, React.Dispatch<React.SetStateAction<T>>];

type TemplateProps = {
   list: ListItem<TTemplate>[];
   control: Control<CreateTaskForm>;
   register: UseFormRegister<CreateTaskForm>;
   inputWordlist: TypeSetInput<string | null>;
   inputCombinatorWordlistName: TypeSetInput<string | null>;
   inputPotfile: TypeSetInput<string | null>;
   inputAttackMode: TypeSetInput<TAttackMode>;
   inputBreakTemp: TypeSetInput<string | null>;
   inputWorkloadProfile: TypeSetInput<string | null>;
   inputKernelOpti: TypeSetInput<boolean>;
   inputCpuOnly: TypeSetInput<boolean>;
   inputMaskQuery: TypeSetInput<string>;
   inputRules: TypeSetInput<string[]>;
   inputCustomCharsets: [
      TypeSetInput<string>,
      TypeSetInput<string>,
      TypeSetInput<string>,
      TypeSetInput<string>,
   ];
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
   inputCombinatorWordlistName: [
      fieldNameCombinatorWordlist,
      setCombinatorWordlist,
   ],
   inputCustomCharsets: [
      [fieldNameCustomCharset1, setCustomCharset1],
      [fieldNameCustomCharset2, setCustomCharset2],
      [fieldNameCustomCharset3, setCustomCharset3],
      [fieldNameCustomCharset4, setCustomCharset4],
   ],
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
   const { field: fieldCombinatorWordlist } = useController<CreateTaskForm>({
      control,
      name: fieldNameCombinatorWordlist,
   });
   const { field: fieldCustomCharset1 } = useController<CreateTaskForm>({
      control,
      name: fieldNameCustomCharset1,
   });
   const { field: fieldCustomCharset2 } = useController<CreateTaskForm>({
      control,
      name: fieldNameCustomCharset2,
   });
   const { field: fieldCustomCharset3 } = useController<CreateTaskForm>({
      control,
      name: fieldNameCustomCharset3,
   });
   const { field: fieldCustomCharset4 } = useController<CreateTaskForm>({
      control,
      name: fieldNameCustomCharset4,
   });

   const onChange = ({ elem }: { elem: TTemplate }) => {
      fieldCombinatorWordlist.onChange(
         elem.options.combinatorWordlistId?.name ?? '',
      );
      fieldBreakTemp.onChange(elem.options.breakpointGPUTemperature.toString());
      fieldAttackMode.onChange(elem.options.attackModeId.id.toString());
      fieldCpuOnly.onChange(elem.options.CPUOnly);
      fieldKernelOpti.onChange(elem.options.kernelOpti);
      fieldMaskQuery.onChange(elem.options.maskQuery || '');
      setRules(elem.options.rules?.split(',') ?? []);
      fieldRules.onChange(elem.options.rules?.split(',') ?? []);
      setMaskQuery(elem.options.maskQuery || '');
      setKernelOpti(elem.options.kernelOpti);

      setAttackMode(elem.options.attackModeId);

      setCombinatorWordlist(elem.options.combinatorWordlistId?.name ?? '');
      setBreakTemp(elem.options.breakpointGPUTemperature.toString());
      setCpuOnly(elem.options.CPUOnly);
      if (elem.options.workloadProfileId) {
         setWorkloadProfile(
            elem.options.workloadProfileId.profileId.toString(),
         );
         fielWorkloadProfile.onChange(
            elem.options.workloadProfileId.profileId.toString(),
         );
      }
      if (elem.options.potfileName) {
         setInputPotfile(elem.options.potfileName);
         fieldPotfile.onChange(elem.options.potfileName);
      }
      if (elem.options.wordlistId) {
         setInputWordlist(elem.options.wordlistId.name);
         fieldWordlist.onChange(elem.options.wordlistId.name);
      }
      if (elem.options.customCharset1) {
         const key = `customCharset1`;
         setCustomCharset1(elem.options[key] as string);
         fieldCustomCharset1.onChange(elem.options[key]);
      }
      if (elem.options.customCharset2) {
         const key = `customCharset2`;
         setCustomCharset2(elem.options[key] as string);
         fieldCustomCharset2.onChange(elem.options[key]);
      }
      if (elem.options.customCharset3) {
         const key = `customCharset3`;
         setCustomCharset3(elem.options[key] as string);
         fieldCustomCharset3.onChange(elem.options[key]);
      }
      if (elem.options.customCharset4) {
         const key = `customCharset4`;
         setCustomCharset4(elem.options[key] as string);
         fieldCustomCharset4.onChange(elem.options[key]);
      }
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
         useTemplateTooltips
      />
   );
}
