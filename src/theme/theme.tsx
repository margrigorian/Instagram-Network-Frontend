import { createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          ".MuiInputLabel-root": {
            fontSize: "12px",
            padding: "2px 0",
            color: "#bfbfbf"
          },
          ".MuiInputLabel-shrink": {
            fontSize: "14px"
          },
          ".MuiOutlinedInput-root": {
            fontSize: "14px",
            fontFamily: "Arial, Helvetica, sans-serif",
            "& fieldset": {
              borderColor: "#bfbfbf",
              borderRadius: "0"
            },
            // не получается отключить
            "&:hover fieldset": {
              borderColor: "#bfbfbf"
            },
            "&.Mui-focused fieldset": {
              border: "1px solid",
              borderColor: "#2196f3"
            }
          },
          "	.MuiFormHelperText-root": {
            fontSize: "11px"
          }
        }
      }
    }
  }
});

export default theme;
