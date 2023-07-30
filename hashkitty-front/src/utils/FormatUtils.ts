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

export function truncateString(str: string, n: number) {
   return str.length > n ? `${str.slice(0, n - 1)}...` : str;
}
