import { IconButton, SxProps, Theme, Tooltip } from '@mui/material';
import { ReactNode } from 'react';

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
   if (isLoading) {
      return (
         <IconButton
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
