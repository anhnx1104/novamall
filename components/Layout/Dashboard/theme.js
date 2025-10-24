import { createTheme } from "@mui/material/styles";

// Define your custom dashboard theme
const dashboardTheme = createTheme({
  palette: {
    primary: {
      main: "#9945ff", // Default blue
      light: "#e9d4ff",
      dark: "#5d00ce",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#dc004e", // Default pink
      light: "#ff5c8d",
      dark: "#9a0036",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
      light: "#f6685e",
      dark: "#d32f2f",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#ffffff",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    background: {
      default: "#f5f7fa", // Lighter background for dashboard
      paper: "#ffffff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "rgba(0, 0, 0, 0.38)",
    },
  },
  typography: {
    h1: {
      fontSize: "2.2rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.8rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.6rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.4rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.2rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1.1rem",
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 600,
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 400,
      textTransform: "uppercase",
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8, // Slightly more rounded corners for dashboard
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
          borderRadius: 12,
        },
        outlined: {
          borderColor: "rgba(0, 0, 0, 0.12)",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        regular: {
          minHeight: 56,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          wordBreak: "keep-all",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          minWidth: 480,
          overflowX: "auto",
          "& .MuiTableHead-root": {
            borderTop: "none !important",
            borderBottom: "1px solid rgba(224, 224, 224, 0.5) !important  ",
          },
          "& .MuiTableHead-root .MuiTableCell-root": {
            borderTop: "none !important",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: "bold",
          backgroundColor: "rgba(0, 0, 0, 0.03)",
          borderTop: "none !important",
        },
        root: {
          padding: "12px 16px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            borderTop: "1px dashed rgba(224, 224, 224, 0.5) !important",
            borderBottom: "none !important",
          },
          "&:last-child .MuiTableCell-root": {
            borderBottom: "none !important",
          },
        },
        hover: {
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.04)",
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          "&.MuiGrid-item": {
            paddingTop: 8,
            paddingLeft: 8,
          },
        },
      },
    },
  },
});

export default dashboardTheme;
