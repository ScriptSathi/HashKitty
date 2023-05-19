import { IconButton, SxProps, Theme, Tooltip } from '@mui/material';
import { ReactNode, useContext } from 'react';
import ColorModeContext from '../../../../App/ColorModeContext';

type RunButtonProps = {
   isRunning: boolean;
   isLoading: boolean;
   handleStop: () => void;
   handleStart: () => void;
   children: ReactNode;
   sx?: SxProps<Theme>;
};

function RunButton({
   isRunning,
   isLoading,
   handleStart,
   handleStop,
   sx,
   children,
}: RunButtonProps) {
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
   if (isLoading) {
      return (
         <IconButton
            disabled={isLoading}
            onClick={isRunning ? handleStop : handleStart}
            onKeyDown={e =>
               e.key === 'Enter' && isRunning ? handleStop() : handleStart()
            }
            sx={{
               color: colors.opposite,
               '&:hover, &.Mui-focusVisible': {
                  backgroundColor: colors.intermediate2,
               },
               ...sx,
            }}
            size="small"
            aria-label="Start/Stop the task"
         >
            {children}
         </IconButton>
      );
   }

   return (
      <Tooltip title={`${isRunning ? 'Stop' : 'Start'} the task`}>
         <IconButton
            className="Mui-focusVisible"
            disableRipple
            disabled={isLoading}
            onClick={isRunning ? handleStop : handleStart}
            onKeyDown={e =>
               e.key === 'Enter' && isRunning ? handleStop() : handleStart()
            }
            sx={sx}
            size="small"
            aria-label="Start/Stop the task"
         >
            {children}
         </IconButton>
      </Tooltip>
   );
}

RunButton.defaultProps = {
   sx: {},
};

export default RunButton;
