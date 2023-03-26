import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type DeleteButtonProps = {
   isLoading: boolean;
   handleDeletion: () => void;
};

function DeleteButton({
   isLoading,
   handleDeletion,
   ...args
}: DeleteButtonProps) {
   return (
      <IconButton
         disabled={isLoading}
         onClick={handleDeletion}
         onKeyDown={e => e.key === 'Delete' && handleDeletion()}
         {...args}
      >
         <DeleteIcon className="IconBtn__icon" />
      </IconButton>
   );
}

export default DeleteButton;
