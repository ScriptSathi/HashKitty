import type { ListItem } from '../types/TApi';
import type { StandardList } from '../types/TComponents';
import type { TAttackMode } from '../types/TypesORM';

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
}
