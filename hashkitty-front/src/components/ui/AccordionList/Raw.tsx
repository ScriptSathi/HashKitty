import { TableCell, TableRow } from '@mui/material';
import { useContext } from 'react';
import DeleteButton from '../Buttons/DeleteButton';
import { ListItemAvailable } from '../../../types/TApi';
import { TTask } from '../../../types/TypesORM';
import ColorModeContext from '../../../App/ColorModeContext';

type RawsProps = {
   item: ListItemAvailable;
   handleDeletion: (name: string) => void;
   isLoading: boolean;
   bindToTasks: TTask[];
   deleteDisabled?: boolean;
};

export default function Raw({
   item,
   handleDeletion,
   isLoading,
   bindToTasks,
   deleteDisabled,
}: RawsProps) {
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
   const tooltip = (): string => {
      if (bindToTasks.length === 0) {
         return `Delete the file ${item.name}`;
      }
      const bindedTaskString = bindToTasks.reduce(
         (acc, task) => [...acc, task.name],
         [] as string[],
      );
      const taskString = bindedTaskString.length > 1 ? 'tasks' : 'task';
      return `The file is bind to ${taskString} ${bindedTaskString.join(', ')}`;
   };

   return (
      <TableRow key={item.name}>
         <TableCell component="th" scope="row">
            <div className="flex items-center justify-between">
               <p style={{ color: colors.font }}>{item.name}</p>
               <DeleteButton
                  disabled={deleteDisabled}
                  tooltip={tooltip()}
                  isLoading={isLoading}
                  handleDeletion={() => handleDeletion(item.name)}
               />
            </div>
         </TableCell>
      </TableRow>
   );
}

Raw.defaultProps = {
   deleteDisabled: false,
};
