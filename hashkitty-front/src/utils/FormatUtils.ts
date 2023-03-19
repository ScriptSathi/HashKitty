import { StandardList } from '../types/TComponents';
import { TAttackMode, THashType } from '../types/TypesORM';

export default class FormatList {
   public static standard(list: StandardList[]): string[] {
      return list.reduce((acc: string[], elem) => {
         return [...acc, ...[elem.name]];
      }, []);
   }

   public static attackMode(list: TAttackMode[]): TAttackMode[] {
      return list.reduce((acc: TAttackMode[], { name, mode, id }) => {
         return [...acc, { name: `${mode} - ${name}`, mode, id }];
      }, []);
   }

   public static hashType(list: THashType[]) {
      return list.reduce(
         (acc, elem) => {
            const data = {
               label: `${elem.typeNumber} - ${elem.name}`,
               id: elem.id,
            };
            if (acc[0].id < 0) {
               return [data];
            }
            return [...acc, ...[data]];
         },
         [{ id: -1, label: '' }],
      );
   }
}
