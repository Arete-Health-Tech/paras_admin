import { PaletteMode } from '@mui/material';
import { amber, indigo } from '@mui/material/colors';

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      dark: indigo[900],
      main: indigo[600],
      light: indigo[200]
    },
    secondary: {
      dark: amber[800],
      main: amber[400],
      light: amber[100]
    },
    background: {
      default: indigo[50]
    }
  }
});
