import { Box, Typography } from "@mui/material";

interface DescriptionProps {
  readonly text?: string;
}

const DEFAULT_TEXT =
  "Rate each performance criterion from 0 (not important) to 5 (critical). This directly shapes your recommendation.";

export default function Description({ text = DEFAULT_TEXT }: DescriptionProps) {
  return (
    <Box >
      <Typography sx={{ fontFamily: 'Inter', fontSize: "14px", color: "#1D1D1D", lineHeight: "18px", letterSpacing: "0px", fontWeight: 400 }}>
        {text}
      </Typography>
    </Box>
  );
}