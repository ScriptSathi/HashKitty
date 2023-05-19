import {
   SxProps,
   Theme,
   CircularProgress,
   ExtendButtonBase,
   IconButton,
   IconButtonTypeMap,
   Tooltip,
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { useContext } from 'react';
import ColorModeContext from '../../../App/ColorModeContext';

type ReloadButtonProps = {
   isLoading: boolean;
   handleReload: () => void;
   disabled?: boolean;
   tooltip?: string;
   sx?: SxProps<Theme>;
} & Partial<ExtendButtonBase<IconButtonTypeMap>>;

function ReloadButton({
   isLoading,
   handleReload,
   disabled,
   tooltip,
   sx,
   ...args
}: ReloadButtonProps) {
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
   return (
      <Tooltip title={tooltip}>
         <span>
            <IconButton
               sx={{
                  color: colors.opposite,
                  '&:hover, &.Mui-focusVisible': {
                     backgroundColor: colors.intermediate2,
                  },
                  ...sx,
               }}
               disabled={disabled || isLoading}
               onClick={e => {
                  e.stopPropagation();
                  handleReload();
               }}
               onKeyDown={e => e.key === 'Enter' && handleReload()}
               {...args}
            >
               {isLoading ? (
                  <CircularProgress size={24} color="secondary" />
               ) : (
                  <CachedIcon />
               )}
            </IconButton>
         </span>
      </Tooltip>
   );
}

ReloadButton.defaultProps = {
   disabled: false,
   sx: {},
   tooltip: '',
};

export default ReloadButton;
