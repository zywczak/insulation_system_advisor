import {
  Box,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import InsightsIcon from "../../assets/insights.svg";

interface RecommendationCardProps {
  readonly productBrand: string;
  readonly productName: string;
  readonly score: number;
  readonly keyStrengths: string[];
  readonly considerations: string[];
  readonly additionalInfo?: string;
  readonly expertInsight?: string;
  readonly costRange: string;
  readonly fireClass: string;
  readonly lambda: string;
  readonly minThickness: string;
}

export default function RecommendationCard({
  productBrand,
  productName,
  score,
  keyStrengths,
  considerations,
  additionalInfo,
  expertInsight,
  costRange,
  fireClass,
  lambda,
  minThickness,
}: RecommendationCardProps) {
  let scoreColor: string;

  if (score <= 10) {
    scoreColor = "#EF3939";
  } else if (score <= 40) {
    scoreColor = "#f5b300";
  } else {
    scoreColor = "#0CA30A";
}


  return (
    <Paper
      elevation={0}
      sx={{
        mt: "36px",
        borderTopRightRadius: { xs: 0, md: "20px" },
        borderBottomRightRadius: { xs: 0, md: "20px" },
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        {/* Left content */}
        
        <Box sx={{ flex: 1 }}>
          {/* Badge header */}
     <Box
  sx={{
    bgcolor: "#437A8E",
    height: "41px",
    pl: { xs: "12px", sm: "24px" },
    display: "flex",
    alignItems: "center"
  }}
>
  <Typography
    sx={{
      fontFamily: "Barlow",
      color: "#fff",
      fontSize: "20px",
      fontWeight: 700,
      letterSpacing: "-1px"
    }}
  >
    Aspirational / Performance Upgrade
  </Typography>
</Box>


          {/* Title + score */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    height: "72px",
    pl: { xs: "12px", sm: "24px" },
    pr: "100px",
    backgroundColor: "#F8F8F8",
    borderTop: "3px solid #E5E5E5",
    borderBottom: "1px solid #E5E5E5",
    position: "relative",
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontFamily: "Barlow",
      fontWeight: 400,
      fontSize: "20px",
      letterSpacing: "-1px",
    }}
  >
    <Box component="span" sx={{ fontWeight: 600 }}>
      {productBrand}{" "}
    </Box>
    {productName}
  </Typography>

  <Box
    sx={{
      position: "absolute",
      backgroundColor: "#fff",
      right:  "24px",
      width: "113px",
      height: "55px",
      '@media (max-width:980px)': {
          fontSize: "16px",
          right: "3px",
          width: "69px",
          height: "48px",
        },
        '@media (max-width:900px)': {
          fontSize: "32px",
          right: "24px",
          width: "113px",
          height: "55px",
        },
        '@media (max-width:620px)': {
          fontSize: "16px",
          right: "3px",
          width: "69px",
          height: "48px",
        },
      bottom: "-1px",
      border: "1px solid #E5E5E5",
      borderBottom: "none",
      borderTopRightRadius: "8px",
      borderTopLeftRadius: "8px",
      textAlign: "center",
    }}
  >
    <Typography
      sx={{
        fontFamily: "Inter",
        fontSize: "32px",
        '@media (max-width:980px)': {
          fontSize: "16px"
        },
        '@media (max-width:900px)': {
          fontSize: "32px"
        },
        '@media (max-width:620px)': {
          fontSize: "16px"
        },
        fontWeight: 700,
        letterSpacing: "0px",
        position: "absolute",
        bottom: { xs: "12px", sm: "0px" },
        left: "50%",
        transform: "translateX(-50%)",
        color: scoreColor,
      }}
    >
      {score}
      <Box
        component="span"
        sx={{
          fontSize: { xs: "12px", sm: "16px" },
          fontWeight: 700,
          color: "#8B959A",
        }}
      >
        /100
      </Box>
    </Typography>
  </Box>
</Box>


          <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    p: "24px",
    px: {xs: "12px", sm: "24px"},
    "@media (min-width:1045px)": {
      flexDirection: "row",
    },
  }}
>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontFamily: "Inter", fontWeight: 700, fontSize: "14px", letterSpacing: "0px", color: "#1D1D1D", mb: "8px" }}>Key Strenghts</Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5, listStyleType: 'disc' }}>
                {keyStrengths.map((s) => (
                  <Box component="li" key={s} sx={{ fontFamily: "Inter", fontWeight: 400, fontSize: "12px", letterSpacing: "0px", color: "#1D1D1D" }}>{s}</Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontFamily: "Inter", fontWeight: 700, fontSize: "14px", letterSpacing: "0px", color: "#1D1D1D", mb: "8px" }}>Considerations</Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5, listStyleType: 'disc' }}>
                {considerations.map((c) => (
                  <Box component="li" key={c} sx={{ fontFamily: "Inter", fontWeight: 400, fontSize: "12px", letterSpacing: "0px", color: "#1D1D1D" }}>{c}</Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Additional info */}
          {additionalInfo && (
            <Box sx={{ mb: 2.5, px: { xs: "12px", sm: "24px" } }}>
              <Typography sx={{ fontFamily: "Inter", fontWeight: 700, fontSize: "14px", letterSpacing: "0px", color: "#1D1D1D", mb: "8px" }}>Additional info</Typography>
              <Typography sx={{ fontFamily: "Inter", fontWeight: 400, fontSize: "12px", letterSpacing: "0px", color: "#1D1D1D" }}>{additionalInfo}</Typography>
            </Box>
          )}

          <Box sx={{ borderBottom: {xs: "none", md: "3px solid #E5E5E5" } }}>
  {/* Expert insight */}
  {expertInsight && (
    <Box
      sx={{
        display: "flex",
        mx: { xs: "12px", sm: "24px" },
        mb: "24px",
        position: "relative",
      }}
    >
      <Box
  sx={{
    width: { xs: "58px", sm: "87px" },
    bgcolor: "#0CA30A",
    alignSelf: "stretch",
    borderRadius: "8px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 2
  }}
>
        <Box component="img" src={InsightsIcon} alt="Insights" />
      </Box>

      <Box sx={{ px: { xs: "12px", sm: "24px" }, border: "1px solid #E5E5E5", ml: "-8px", py: "20px", 
              borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
      bgcolor: "#F8F8F8", flex: 1}}>
        <Typography sx={{ fontFamily: "Inter", fontWeight: 700, fontSize: "12px", letterSpacing: "0px", color: "#1D1D1D" }}>
          Expert Insights
        </Typography>
        <Typography sx={{ fontFamily: "Inter", fontWeight: 400, fontSize: "12px", letterSpacing: "0px", color: "#1D1D1D" }}>
          {expertInsight}
        </Typography>
      </Box>
    </Box>
  )}
</Box>
</Box>
       
        {/* Right stats panel */}
       <Box
  sx={{
    borderTopRightRadius: "20px",
    borderBottomRightRadius: "20px",
    bgcolor: "#0CA30A",
    px: { xs: "60px", md: "28px" },
    py: { xs: "34px", md: "28px" },
    width: { md: 282 },
    mx: { xs: "12px", md: 0 },
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    gap: { xs: 2, md: 0 },
    justifyContent: "center", 
  }}
>
  {[
    { label: "COST RANGE", value: costRange },
    { label: "FIRE CLASS", value: fireClass },
    { label: "LAMBDA", value: lambda },
    { label: "MIN. THICKNESS (U=0.3)", value: minThickness },
  ].map(({ label, value }, i, arr) => (
    <Box
      key={label}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        pb: "9px",
        borderBottom: i < arr.length - 1 ? "1px solid #48D858" : "none",
        pt: { md: i > 0 ? "10px" : 0 },
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "12px",
          fontWeight: 400,
          letterSpacing: "0px",
          color: "#FFFFFF",
          mb: "8px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "16px",
          fontWeight: 700,
          letterSpacing: "0px",
          color: "#FFFFFF",
        }}
      >
        {value}
      </Typography>
    </Box>
  ))}
</Box>

 <Divider
  sx={{
    border: "3px solid #E5E5E5",
    mt: "24px",
    mx: "12px",
    display: { xs: "block", md: "none" }
  }}
/>
      </Box>
    </Paper>
  );
}