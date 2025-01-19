import { typography } from './typography';

export const theme = {
  typography,
  colors: {
    background: {
      main: '#F3F2F1',
      menu: '#EEEDEC',
      white: '#FFFFFF',
      selected: '#FFFFFF',
      avatar: '#EEEDEC',
      outline: '#D2D2D2',
    },
    text: {
      primary: '#4B361F',
      accent: '#CF1D1D',
      disabled: '#D2D2D2'
    },
    accent: '#CF1D1D',
    disabled: '#D2D2D2'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};

export type Theme = typeof theme;

// Export individual theme parts for convenience
export const { colors, spacing } = theme;
