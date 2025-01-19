import { StyleSheet, Platform } from 'react-native';

// Helper function to calculate line height based on fontSize
const getLineHeight = (fontSize: number) => {
  // Android needs more line height to prevent clipping
  const multiplier = Platform.OS === 'android' ? 1.5 : 1.3;
  return Math.round(fontSize * multiplier);
};

export const typography = StyleSheet.create({
  title: {
    fontFamily: 'Corben',
    fontSize: 50,
    lineHeight: getLineHeight(50),
    includeFontPadding: false, // Android specific
    textAlignVertical: 'center', // Android specific
  },
  h1: {
    fontFamily: 'Corben',
    fontSize: 30,
    lineHeight: getLineHeight(30),
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  h2: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 16,
    lineHeight: getLineHeight(16),
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  h3: {
    fontFamily: 'Geist',
    fontSize: 14,
    lineHeight: getLineHeight(14),
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  p: {
    fontFamily: 'Geist',
    fontSize: 16,
    lineHeight: getLineHeight(16),
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  timeValue: {
    fontFamily: 'Geist-Light',
    fontSize: 54,
    lineHeight: 54,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  timePeriod: {
    fontFamily: 'Geist-Regular',
    fontSize: 24,
    lineHeight: 24,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

// Helper function to combine typography styles with additional styles
export const combineTypography = (typographyStyle: any, additionalStyles?: any) => {
  return [typographyStyle, additionalStyles];
};
