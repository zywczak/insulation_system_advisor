import Button from "@mui/material/Button";
import { ReactNode } from "react";

type StepButtonProps = {
  readonly label: string;
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly icon?: ReactNode;
  readonly iconPosition?: "start" | "end";
};

export default function StepButton({
  label,
  onClick,
  disabled = false,
  icon,
  iconPosition = "start",
}: StepButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      startIcon={iconPosition === "start" ? icon : undefined}
      endIcon={iconPosition === "end" ? icon : undefined}
      sx={{
        backgroundColor: disabled ? "#D7D7D7" : "#48D858",
        width: { xs: "96px", sm: "114px" },
        height: { xs: "38px", sm: "44px" },
        borderRadius: "45px",
        textTransform: "none",
        fontSize: { xs: "12px", sm: "14px" },
        fontWeight: 700,
        color: "#fff",
        "&.Mui-disabled": {
          backgroundColor: "#D7D7D7",
          color: "#fff",
          opacity: 0.7,
        },
      }}
    >
      {label}
    </Button>
  );
}