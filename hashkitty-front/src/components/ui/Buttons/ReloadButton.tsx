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
   return (
      <Tooltip title={tooltip}>
         <span>
            <IconButton
               sx={sx}
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
                  <CachedIcon className="IconBtn__icon" />
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
