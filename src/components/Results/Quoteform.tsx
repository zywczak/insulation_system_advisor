import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import PdfIcon from "../../assets/pdf.svg";
import MailIcon from "../../assets/mail.svg";

// ─── Quote Form ───────────────────────────────────────────────────────────────

interface QuoteFormProps {
  readonly onSubmit?: (data: QuoteFormData) => void;
  readonly onDownload?: () => void;
  readonly onRestart?: () => void;
}

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  streetNumber: string;
  city: string;
  postcode: string;
}

const inputSx = {
    width: { xs: "100%", md: "350px" },
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    bgcolor: "#FFFFFF",
    fontSize: 14,

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e0e0e0",
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e0e0e0",
    },

    "& input::placeholder": {
      color: "#8B959A",
      fontFamily: "Inter",
      fontWeight: 400,
      fontSize: "14px",
      opacity: 1,
    },
  },
};

export default function QuoteForm({ onSubmit, onDownload, onRestart }: QuoteFormProps) {
  const [form, setForm] = useState<QuoteFormData>({
    name: "",
    email: "",
    phone: "",
    streetNumber: "",
    city: "",
    postcode: "",
  });

  const handleChange = (field: keyof QuoteFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    onSubmit?.(form);
  };

  const fields: { label: string; key: keyof QuoteFormData; placeholder: string }[] = [
    { label: "Name", key: "name", placeholder: "Your full name" },
    { label: "Email", key: "email", placeholder: "your@email.com" },
    { label: "Phone", key: "phone", placeholder: "Phone number" },
    { label: "Street & Number", key: "streetNumber", placeholder: "Street and number" },
    { label: "City", key: "city", placeholder: "City" },
    { label: "Postcode", key: "postcode", placeholder: "Postcode" },
  ];

  return (
    <Box sx={{ bgcolor: "#F8F8F8", px:  {xs: "24px", sm: "48px", md: "86px" }, mt: "36px",py: { xs: 3, md: 4 },
        mx: { xs: "-24px", sm: "-48px", md: "-86px" },
        }}>
      <Typography
        variant="h4"
        sx={{
            fontFamily: 'Barlow',
          fontWeight: 600,
          letterSpacing: "-1px",
          lineHeight: "36px",
          color: "#1C1C1C",
        }}
      >
        Request a Professional Quote
      </Typography>
      <Typography sx={{ fontFamily: 'Inter', fontSize: "12px", color: "#1C1C1C", mb: "24px", mt: "8px" }}>
        Submit your details and we'll have a specialist contact you with a tailored quote.
      </Typography>

      <Divider sx={{ mb: "36px", color: "#E4E4E4" }} />

      <Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "max-content max-content" },
    columnGap: "42px",
    rowGap: "18px",
    mb: "30px",
  }}
>
  {fields.map(({ label, key, placeholder }) => (
    <Box key={key}>
            <Typography sx={{ fontFamily: 'Inter', fontSize: "12px", fontWeight: 400, color: "#1C1C1C" }}>
              {label}
            </Typography>
            <TextField
              fullWidth
              placeholder={placeholder}
              value={form[key]}
              onChange={handleChange(key)}
              size="small"
              sx={inputSx}
            />
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: "30px" }} />

   {/* Action buttons */}
<Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "22px",
  }}
>
  <Button
    variant="contained"
    disableElevation
    onClick={handleSubmit}
    endIcon={<Box component="img" src={MailIcon} />}
    sx={{
      bgcolor: "#48D858",
      color: "#fff",
      borderRadius: "20px",
      height: "44px",
      flexBasis: "100%",
      "@media (min-width:770px)": { flexBasis: "280px" },
      flexGrow: 0,
      flexShrink: 0,
      maxWidth: "100%",
      letterSpacing: "0px",
      fontSize: "14px",
      fontWeight: 700,
      "&:hover": { bgcolor: "#39ac47" },
    }}
  >
    Send my details for quote
  </Button>
  <Button
    variant="contained"
    disableElevation
    onClick={onDownload}
    endIcon={<Box component="img" src={PdfIcon} />}
    sx={{
      bgcolor: "#2d6a7a",
      color: "#fff",
      borderRadius: "20px",
      height: "44px",
      flexBasis: "100%",
      "@media (min-width:770px)": { flexBasis: "325px" },
      flexGrow: 0,
      flexShrink: 0,
      maxWidth: "100%",
      fontSize: "14px",
      fontWeight: 700,
      letterSpacing: "0px",
      "&:hover": { bgcolor: "#245a68" },
    }}
  >
    Download Technical Assessment
  </Button>
</Box>
    </Box>
  );
}