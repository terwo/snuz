import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  title: {
    fontFamily: 'Corben',
    fontSize: 50,
  },
  h1: {
    fontFamily: 'Corben',
    fontSize: 30,
  },
  h2: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 16,
  },
  h3: {
    fontFamily: 'Geist',
    fontSize: 14,
  },
  p: {
    fontFamily: 'Geist',
    fontSize: 16,
  },
});

// Helper function to combine typography styles with additional styles
export const combineTypography = (typographyStyle: any, additionalStyles?: any) => {
  return [typographyStyle, additionalStyles];
};
