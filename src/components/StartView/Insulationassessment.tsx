import { Box, Typography, Button, Card, Divider, } from "@mui/material";
import CalculatorIntro from "../CalculatorIntro";
import Monitor from "../../assets/monitor.svg";
import Building from "../../assets/building.svg";
import Performance from "../../assets/performance.svg";
import Cost from "../../assets/cost.svg";
import Constraints from "../../assets/constrains.svg";
import Installation from "../../assets/installation.svg";
import Moisture from "../../assets/moisture.svg";

const assessmentItems = [
  { Icon: Building, label: "Building & Compliance" },
  { Icon: Constraints, label: "Physical Constraints" },
  { Icon: Moisture, label: "Wall & Moisture" },
  { Icon: Performance, label: "Performance Priorities" },
  { Icon: Cost, label: "Cost & Budget" },
  { Icon: Installation, label: "Installation & Delivery" },
];

const AssessmentGrid = () => (
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "6px",
    }}
  >
    {assessmentItems.map(({ Icon, label }) => (
      <Box
        key={label}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          width: "179px",
          height: "165px",
          borderRadius: "20px",
          bgcolor: "#F3F3F3",
        }}
      >
        <Box
          component="img"
          src={Icon}
          alt={label}
          sx={{ width: 72, height: 72 }}
        />
        <Typography
          fontWeight={600}
          color="#1A1A1A"
          sx={{
            fontFamily: "Barlow",
            fontSize: "17px",
            letterSpacing: "0px",
            textAlign: "center",
          }}
        >
          {label}
        </Typography>
      </Box>
    ))}
  </Box>
);

export default function InsulationAssessment({ onStartAssessment }: { readonly onStartAssessment: () => void }) {
  return (
    <Box sx={{ maxWidth: "1238px", mx: "auto" }}>

      <CalculatorIntro />

      <Card sx={{
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        backgroundColor: "#FFFFFF",
        p: 0,
        px: { xs: 3, sm: 6 },
        pb: 5,
        pt: 6,
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        mt: "66px",
        overflow: "visible",
        boxShadow: "0px 4px 43px 0px #00000014",
      }}>
        <Box
          sx={{
            position: "absolute",
            top: "-66px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 132,
            height: 132,
            borderRadius: "50%",
            bgcolor: "#0CA30A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={Monitor}
            alt="Monitor"
            sx={{ width: 64, height: 64 }}
          />
        </Box>

        {/* Heading */}
        <Typography
          fontWeight={700}
          color="#161616"
          sx={{ fontFamily: "Barlow", fontSize: "36px", mt: "80px", mb: 1.5, letterSpacing: "1px", lineHeight: 1 }}
        >
          Find the right insulation system for your project
        </Typography>

        <Divider sx={{ mb: "24px", mx: "auto", maxWidth: "643px", width: "100%", border: "1px solid #DDDDDD" }} />

        {/* Subtext */}
        <Typography
          color="#161616"
          sx={{ fontFamily: "Inter", fontWeight: 400, fontSize: "16px", lineHeight: 1.7, mx: "auto" }}
        >
          Answer a few questions about your building, constraints, and priorities.
          <br />
          We'll analyse four major insulation families and recommend the best fit.
        </Typography>

        {/* Section label */}
        <Typography
          sx={{
            fontFamily: "Inter",
            mt: "72px",
            fontSize: "24px",
            fontWeight: 700,
            color: "#1A1A1A",
            textTransform: "uppercase",
            mb: "24px",
          }}
        >
          The Assessment Covers
        </Typography>

        {/* Icons grid — visible only on desktop (sm and above) */}
        <Box sx={{ display: { xs: "none", sm: "none", md: "block" }, mb: "72px" }}>
          <AssessmentGrid />
        </Box>

        {/* CTA Button */}
        <Button
          variant="contained"
          disableElevation
          onClick={onStartAssessment}
          sx={{
            bgcolor: "#0EAE0C",
            color: "#fff",
            borderRadius: "45px",
            height: "55px",
            width: "278px",
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "Inter",
            letterSpacing: "0px",
            "&:hover": {
              boxShadow: "0 4px 18px rgba(54,193,60,0.3)",
            },
          }}
        >
          Start Assessment
        </Button>

        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: 400,
            color: "#8B959A",
            mt: "8px",
          }}
        >
          Takes approximately 5–10 minutes
        </Typography>

        {/* Icons grid — visible only on mobile (below sm) */}
        <Box sx={{ display: { sm: "block", md: "none" }, mt: "40px" }}>
          <AssessmentGrid />
        </Box>

      </Card>
    </Box>
  );
}