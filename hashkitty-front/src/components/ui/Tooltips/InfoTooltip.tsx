import { Info } from '@mui/icons-material';
import { SxProps, Theme, Tooltip } from '@mui/material';

type InfoTooltipProps = {
   tooltip: string | JSX.Element;
   className?: string;
   sx?: SxProps<Theme>;
   onClick?: React.MouseEventHandler<SVGSVGElement>;
};

export default function InfoTooltip({
   tooltip,
   sx,
   className,
   onClick,
}: InfoTooltipProps) {
   return (
      <Tooltip title={tooltip} className={className}>
         <Info onClick={onClick} sx={sx} />
      </Tooltip>
   );
}

InfoTooltip.defaultProps = {
   sx: {},
   className: '',
   onClick: () => {},
};
