import { Info } from '@mui/icons-material';
import { SxProps, Theme, Tooltip } from '@mui/material';

type InfoTooltipProps = {
   tooltip: string;
   className?: string;
   sx?: SxProps<Theme>;
};

export default function InfoTooltip({ tooltip, sx, className }: InfoTooltipProps) {
   return (
      <Tooltip title={tooltip} className={className} >
         <Info sx={sx} />
      </Tooltip>
   );
}

InfoTooltip.defaultProps = {
   sx: {},
   className: '',
};
