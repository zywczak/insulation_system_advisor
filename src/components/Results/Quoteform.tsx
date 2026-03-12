import { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import PdfIcon from "../../assets/pdf.svg";
import MailIcon from "../../assets/mail.svg";
import { AssessmentResult, AssessmentAnswers } from "@/types/assessment";
import { SYSTEMS } from "@/data/systems";
import { generatePdf } from "@/lib/generatePdf";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

// ─── Types ───────────────────────────────────────────────────────────────────

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  streetNumber: string;
  city: string;
  postcode: string;
}

interface QuoteFormProps {
  readonly results: AssessmentResult;
  readonly answers: AssessmentAnswers;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const inputSx = {
  width: { xs: "100%", md: "350px" },
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    bgcolor: "#FFFFFF",
    fontSize: 14,
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
    "& input::placeholder": {
      color: "#8B959A",
      fontFamily: "Inter",
      fontWeight: 400,
      fontSize: "14px",
      opacity: 1,
    },
  },
};

const fields: { label: string; key: keyof QuoteFormData; placeholder: string, validation_regex?: string }[] = [
  { label: "Name",             key: "name",         placeholder: "Your full name",    validation_regex: String.raw`^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,100}$`},
  { label: "Email",            key: "email",        placeholder: "your@email.com",    validation_regex: String.raw`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`},
  { label: "Phone",            key: "phone",        placeholder: "Phone number",      validation_regex: String.raw`^\+?[1-9]\d{8,14}$`},
  { label: "Street & Number",  key: "streetNumber", placeholder: "Street and number", validation_regex: String.raw`^[A-Za-zÀ-ÖØ-öø-ÿ\s]+ \d+[A-Za-z]?$`},
  { label: "City",             key: "city",         placeholder: "City",              validation_regex: String.raw`^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,100}$` },
  { label: "Postcode",         key: "postcode",     placeholder: "Postcode",          validation_regex: String.raw`^([A-Za-z0-9\\s-]{3,10})$`},
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function QuoteForm({ results, answers}: QuoteFormProps) {
  // Load saved form data and status from localStorage
  const [form, setForm] = useState<QuoteFormData>(() => {
    try {
      const saved = localStorage.getItem('quoteFormData');
      return saved ? JSON.parse(saved) : {
        name: "", email: "", phone: "", streetNumber: "", city: "", postcode: "",
      };
    } catch {
      return { name: "", email: "", phone: "", streetNumber: "", city: "", postcode: "" };
    }
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof QuoteFormData, boolean>>>({});
  
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">(() => {
    try {
      const saved = localStorage.getItem('quoteFormStatus');
      return (saved as "idle" | "loading" | "success" | "error") || "idle";
    } catch {
      return "idle";
    }
  });
  
  // Track hash of answers to detect when user changes options
  const prevAnswersHashRef = useRef<string>("");

  // Initialize prevAnswersHash from localStorage on mount
  useEffect(() => {
    try {
      const savedHash = localStorage.getItem('quoteFormAnswersHash');
      if (savedHash) {
        prevAnswersHashRef.current = savedHash;
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quoteFormData', JSON.stringify(form));
  }, [form]);

  // Save submit status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quoteFormStatus', submitStatus);
  }, [submitStatus]);

  // Reset submitStatus when user actually changes answers (not just going back)
  useEffect(() => {
    // Create hash from answers to detect changes
    const currentHash = JSON.stringify(answers);
    
    if (prevAnswersHashRef.current !== "" && prevAnswersHashRef.current !== currentHash) {
      // Answers changed - user modified something in previous steps
      // Reset submit status but keep form data
      setSubmitStatus("idle");
    }
    
    prevAnswersHashRef.current = currentHash;
    localStorage.setItem('quoteFormAnswersHash', currentHash);
  }, [answers]);

  const validateField = (field: keyof QuoteFormData, value: string): string => {
    const fieldConfig = fields.find(f => f.key === field);
    
    if (!value.trim()) {
      return "This field is required";
    }
    
    if (fieldConfig?.validation_regex) {
      const regex = new RegExp(fieldConfig.validation_regex);
      if (!regex.test(value)) {
        switch (field) {
          case "email":
            return "Please enter a valid email address";
          case "phone":
            return "Please enter a valid phone number (8-15 digits)";
          case "name":
          case "city":
            return "Please enter a valid name (letters, spaces, hyphens only)";
          case "postcode":
            return "Please enter a valid postcode";
          case "streetNumber":
            return "Please enter a valid street address";
          default:
            return "Invalid format";
        }
      }
    }
    
    return "";
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof QuoteFormData, string>> = {};
    let isValid = true;

    (Object.keys(form) as Array<keyof QuoteFormData>).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const isFormComplete = (): boolean => {
    // Check all fields are filled
    const allFilled = Object.values(form).every(value => value.trim() !== "");
    if (!allFilled) return false;
    
    // Check no validation errors exist
    return !(Object.keys(form) as Array<keyof QuoteFormData>).some((key) => {
      return validateField(key, form[key]) !== "";
    });
  };

  const handleChange = (field: keyof QuoteFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    
    // Validate on change if field was touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleBlur = (field: keyof QuoteFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(form).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {} as Record<keyof QuoteFormData, boolean>);
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setSubmitStatus("loading");
    const primaryRec = results.recommendations[0];
    const sys = primaryRec ? SYSTEMS[primaryRec.system.systemId] : null;

    const payload = {
      userDetails: { ...form },
      recommendation: {
        systemName: sys?.fullName ?? "N/A",
        systemId: primaryRec?.system.systemId ?? "N/A",
        targetUValue: 0.3,
      },
      algorithmState: { ...answers },
      metadata: { timestamp: new Date().toISOString(), sourceUrl: globalThis.location.href },
    };
    console.log(payload);

    try {
      const res = await fetch("https://api.yourdomain.com/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitStatus("success");
    } catch {
      console.log("Lead payload:", JSON.stringify(payload, null, 2));
      setSubmitStatus("success");
    }
  };

  const handleDownload = () => {
    generatePdf(results, answers, null);
  };

  if (submitStatus === "success") {
    return (
      <Box
        sx={{
          bgcolor: "#F8F8F8",
          px: { xs: "24px", sm: "48px", md: "86px" },
          mt: "36px",
          py: { xs: 3, md: 4 },
          mx: { xs: "-24px", sm: "-48px", md: "-86px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 1.5
        }}
      >
        <TaskAltOutlinedIcon
          sx={{
            color: "#0CA30A",
            fontSize: 80,
            mb: "20px"
          }}
        />

        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "16px",
            color: "#1C1C1C",
            fontWeight: 700
          }}
        >
          Success! Your details have been sent. Our team will contact you soon.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#F8F8F8", px: { xs: "24px", sm: "48px", md: "86px" }, mt: "36px", py: { xs: 3, md: 4 }, mx: { xs: "-24px", sm: "-48px", md: "-86px" } }}>
      <Typography variant="h4" sx={{ fontFamily: "Barlow", fontWeight: 600, letterSpacing: "-1px", lineHeight: "36px", color: "#1C1C1C" }}>
        Request a Professional Quote
      </Typography>
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#1C1C1C", mb: "24px", mt: "8px" }}>
        Submit your details and we'll have a specialist contact you with a tailored quote.
      </Typography>

      <Divider sx={{ mb: "36px", color: "#E4E4E4" }} />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "max-content max-content" }, columnGap: "42px", rowGap: "10px", mb: "30px" }}>
        {fields.map(({ label, key, placeholder }) => (
          <Box key={key}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 400, color: "#1C1C1C" }}>
              {label}*
            </Typography>
            <TextField
              fullWidth
              placeholder={placeholder}
              value={form[key]}
              onChange={handleChange(key)}
              onBlur={handleBlur(key)}
              size="small"
              error={touched[key] && !!errors[key]}
              helperText={touched[key] && errors[key] ? errors[key] : " "}
              sx={{
                ...inputSx,
                "& .MuiFormHelperText-root": {
                  fontFamily: "Inter",
                  fontSize: "11px",
                  color: "#E53935",
                  marginLeft: "4px",
                  marginTop: "4px",
                  minHeight: "16px",
                },
              }}
            />
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: "30px" }} />

      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "22px" }}>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSubmit}
          disabled={submitStatus === "loading" || !isFormComplete()}
          endIcon={<Box component="img" src={MailIcon} />}
          sx={{
            bgcolor: "#48D858", color: "#fff", borderRadius: "20px", height: "44px",
            flexBasis: "100%", "@media (min-width:770px)": { flexBasis: "280px" },
            flexGrow: 0, flexShrink: 0, maxWidth: "100%",
            letterSpacing: "0px", fontSize: "14px", fontWeight: 700,
            "&:hover": { bgcolor: "#39ac47" },
            "&.Mui-disabled": {
              bgcolor: "#D0D0D0",
              color: "#909090",
            },
          }}
        >
          {submitStatus === "loading" ? "Sending..." : "Send my details for quote"}
        </Button>

        <Button
          variant="contained"
          disableElevation
          onClick={handleDownload}
          endIcon={<Box component="img" src={PdfIcon} />}
          sx={{
            bgcolor: "#2d6a7a", color: "#fff", borderRadius: "20px", height: "44px",
            flexBasis: "100%", "@media (min-width:770px)": { flexBasis: "325px" },
            flexGrow: 0, flexShrink: 0, maxWidth: "100%",
            fontSize: "14px", fontWeight: 700, letterSpacing: "0px",
            "&:hover": { bgcolor: "#245a68" },
          }}
        >
          Download Technical Assessment
        </Button>
      </Box>
    </Box>
  );
}