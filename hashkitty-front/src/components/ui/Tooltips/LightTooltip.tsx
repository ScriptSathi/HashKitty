import { SxProps, Theme, Tooltip } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

type LightTooltipProps = {
   tooltip: string;
   className?: string;
   sx?: SxProps<Theme>;
   onClick?: React.MouseEventHandler<SVGSVGElement>;
};

export default function LightTooltip({
   tooltip,
   sx,
   className,
   onClick,
}: LightTooltipProps) {
   return (
      <Tooltip title={tooltip} className={className}>
         <LightbulbIcon onClick={onClick} sx={sx} />
      </Tooltip>
   );
}

LightTooltip.defaultProps = {
   sx: {},
   className: '',
   onClick: () => {},
};
