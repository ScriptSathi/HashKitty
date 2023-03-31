import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type DeleteButtonProps = {
   isLoading: boolean;
   handleDeletion: () => void;
   disabled?: boolean;
   tooltip?: string;
};

function DeleteButton({
   isLoading,
   handleDeletion,
   disabled,
   tooltip,
   ...args
}: DeleteButtonProps) {
   return (
      <Tooltip title={tooltip}>
         <span>
            <IconButton
               disabled={disabled || isLoading}
               onClick={handleDeletion}
               onKeyDown={e => e.key === 'Delete' && handleDeletion()}
               {...args}
            >
               {isLoading ? (
                  <CircularProgress size={24} color="secondary" />
               ) : (
                  <DeleteIcon className="IconBtn__icon" />
               )}
            </IconButton>
         </span>
      </Tooltip>
   );
}

DeleteButton.defaultProps = {
   disabled: false,
   tooltip: '',
};

export default DeleteButton;
