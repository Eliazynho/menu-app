// theme.js

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Azul MUI
    },
    secondary: {
      main: "#f50057", // Rosa
    },
  },
  typography: {
    fontFamily: '"Nunito", "Helvetica", "Arial", sans-serif', // Usando a fonte Poppins
  },
});

export default theme;
