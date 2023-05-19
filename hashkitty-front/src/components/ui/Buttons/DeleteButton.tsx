import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext } from 'react';
import ColorModeContext from '../../../App/ColorModeContext';

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
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
   return (
      <Tooltip title={tooltip}>
         <span>
            <IconButton
               disabled={disabled || isLoading}
               onClick={handleDeletion}
               onKeyDown={e => e.key === 'Delete' && handleDeletion()}
               sx={{
                  color: colors.opposite,
                  '&:hover, &.Mui-focusVisible': {
                     backgroundColor: colors.intermediate2,
                  },
                  '&.Mui-disabled': {
                     color: colors.intermediate2,
                  },
               }}
               {...args}
            >
               {isLoading ? (
                  <CircularProgress size={24} color="secondary" />
               ) : (
                  <DeleteIcon />
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
