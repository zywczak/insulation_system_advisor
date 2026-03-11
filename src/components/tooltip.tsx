import { Tooltip, TooltipProps } from '@mui/material';

const tooltipSx = {
  '& .MuiTooltip-tooltip': {
    bgcolor: 'background.paper',
    color: 'text.primary',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: '6px',
    fontSize: '0.875rem',
    px: 1.5,
    py: 0.75,
    boxShadow: 2,
  },
};

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const TooltipTrigger = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span style={{ display: 'inline-flex' }} {...props}>{children}</span>
);

const TooltipContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const StyledTooltip = (props: TooltipProps) => (
  <Tooltip slotProps={{ popper: { sx: tooltipSx } }} {...props} />
);

export { StyledTooltip as Tooltip, TooltipProvider, TooltipTrigger, TooltipContent };
export type { TooltipProps };