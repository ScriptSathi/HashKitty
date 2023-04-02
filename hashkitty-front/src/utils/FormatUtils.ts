import { ListItem } from '../types/TApi';
import { StandardList } from '../types/TComponents';
import { TAttackMode, THashType } from '../types/TypesORM';

export default class FormatList {
   public static standard(list: ListItem<StandardList>[]): string[] {
      return list.reduce((acc: string[], elem) => {
         return [...acc, ...[elem.item.name]];
      }, []);
   }

   public static attackMode(list: TAttackMode[]): TAttackMode[] {
      return list.reduce((acc: TAttackMode[], { name, mode, id }) => {
         return [...acc, { name: `${mode} - ${name}`, mode, id }];
      }, []);
   }

   public static hashType(
      list: THashType[],
   ): (THashType & { label: string })[] {
      return list.reduce(
         (
            acc: (THashType & { label: string })[],
            { name, typeNumber, id, description },
         ) => {
            return [
               ...acc,
               {
                  label: `${typeNumber} - ${name}`,
                  typeNumber,
                  id,
                  description,
                  name,
               },
            ];
         },
         [],
      );
   }
}
