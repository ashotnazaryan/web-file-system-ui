import { createTheme, PaletteOptions } from '@mui/material/styles';

const lightPalette: PaletteOptions = {
  primary: {
    main: '#2b697a',
    light: '#4f8392',
    dark: '#205b6b',
    contrastText: '#fff'
  },
  secondary: {
    main: '#de5114',
    contrastText: '#fff'
  },
  error: {
    main: '#de4545'
  },
  info: {
    main: '#cccccc',
    dark: '#8c8c8c',
    light: '#f2f2f2',
    contrastText: '#000'
  },
  action: {
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  contrastThreshold: 3,
  tonalOffset: 0.2
};

const darkPalette: PaletteOptions = {
  primary: {
    main: '#25744d',
    light: '#339966',
    dark: '#1a4c34',
    contrastText: '#fff'
  },
  secondary: {
    main: '#996633',
    light: '#bf8040',
    dark: '#734d26',
    contrastText: '#fff'
  },
  error: {
    main: '#ff1a1a'
  },
  info: {
    main: '#262626',
    light: '#333333',
    dark: '#1a1a1a',
    contrastText: '#fff'
  },
  action: {
    disabled: 'rgba(255, 255, 255, 0.3)'
  },
  contrastThreshold: 3,
  tonalOffset: 0.2
};

const spacing = 4;

export const lightTheme = createTheme({
  spacing,
  palette: {
    ...lightPalette,
    mode: 'light'
  }
});

export const darkTheme = createTheme({
  spacing,
  palette: {
    ...darkPalette,
    mode: 'dark'
  }
});
