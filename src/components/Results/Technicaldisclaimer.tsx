import { Box, Typography } from "@mui/material";

interface TechnicalDisclaimerProps {
  readonly text?: string;
}

const DEFAULT_TEXT =
  "This  report is a preliminary automated assessment based on user-provided  data. It does not replace a professional on-site survey. Final system  specification must be verified by an EWI Pro technical consultant to  ensure compliance with local building regulations and structural  requirements.";

export default function TechnicalDisclaimer({ text = DEFAULT_TEXT }: TechnicalDisclaimerProps) {
  return (
    <Box sx={{mt: "24px"}}>
      <Typography sx={{ fontFamily: 'Inter', fontSize: "12px", color: "#1C1C1C", fontWeight: 700 }}>
        Technical Disclaimer:
      </Typography>
      <Typography sx={{ fontFamily: 'Inter', fontSize: "12px", color: "#1C1C1C", fontWeight: 400 }}>
        {text}
      </Typography>
    </Box>
  );
}