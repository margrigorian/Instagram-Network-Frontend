import React from "react";
import { createTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";

const textFieldTheme = createTheme({
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

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "black",
        opacity: 1,
        border: 0
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5
      }
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff"
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600]
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3
    }
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500
    })
  }
}));

export { textFieldTheme, IOSSwitch };
