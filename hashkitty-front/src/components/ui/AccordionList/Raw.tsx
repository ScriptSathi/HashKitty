import { TableCell, TableRow } from '@mui/material';
import { ItemBase } from '../../../types/TComponents';
import DeleteButton from '../Buttons/DeleteButton';

type RawsProps = {
   item: ItemBase;
   handleDeletion: (name: string) => void;
   isLoading: boolean;
};

export default function Raw({ item, handleDeletion, isLoading }: RawsProps) {
   return (
      <TableRow key={item.name}>
         <TableCell component="th" scope="row">
            <div className="flex items-center justify-between">
               <p>{item.name}</p>
               <DeleteButton
                  isLoading={isLoading}
                  handleDeletion={() => handleDeletion(item.name)}
               />
            </div>
         </TableCell>
      </TableRow>
   );
}
