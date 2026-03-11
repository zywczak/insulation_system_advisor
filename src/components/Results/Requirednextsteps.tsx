import { Box, Typography, Divider } from "@mui/material";

const defaultSteps = [
  "Confirm target U-value with your architect or energy assessor",
  "Commission a site survey to assess substrate condition and fixings",
  "Obtain detailed specifications for window reveals and junction details",
  "Request system-specific BBA or ETA certification documents",
  "Get installation quotes from approved system installers",
  "Review building control requirements for your specific project",
];

interface RequiredNextStepsProps {
  readonly steps?: string[];
}

export default function RequiredNextSteps({ steps = defaultSteps }: RequiredNextStepsProps) {
  const half = Math.ceil(steps.length / 2);
  const left = steps.slice(0, half);
  const right = steps.slice(half);

  return (
    <Box sx={{ mt: "36px"}}>
      <Typography
        sx={{ fontWeight: 600,fontFamily: 'Barlow', fontSize: "36px", color: "#1C1C1C", letterSpacing: "-1px"}}
      >
        Required next steps
      </Typography>
      <Typography sx={{ fontFamily: 'Inter', fontSize: "12px", fontWeight: 400, color: "#1C1C1C", mb: "24px" }}>
        Data needed to move from recommendation to final specification
      </Typography>

      <Divider sx={{ mb: "24px" }} />

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 0, md: 4 } }}>
        <Box component="ul" sx={{ flex: 1, m: 0, pl: 2.5, listStyleType: "disc" }}>
          {left.map((step) => (
            <Box component="li" key={step}  sx={{ fontFamily: 'Inter', fontSize: "12px", fontWeight: 400, color: "#1D1D1D", lineHeight: "25px" }}>
              {step}
            </Box>
          ))}
        </Box>
        <Box component="ul" sx={{ flex: 1, m: 0, pl: 2.5, listStyleType: "disc" }}>
          {right.map((step) => (
             <Box component="li" key={step}  sx={{ fontFamily: 'Inter', fontSize: "12px", fontWeight: 400, color: "#1D1D1D", lineHeight: "25px" }}>
              {step}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}