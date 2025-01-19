import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../styles/theme';
import { combineTypography } from '../styles/typography';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export default function Checkbox({ 
  checked, 
  onPress, 
  label,
  style,
  labelStyle,
}: CheckboxProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
    >
      <View style={[
        styles.checkbox,
        checked && styles.checkboxSelected
      ]}>
        {checked && <View style={styles.checkboxInner} />}
      </View>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: theme.colors.background.menu,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.white,
  },
  checkboxSelected: {
    borderColor: theme.colors.accent,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: theme.colors.accent,
    borderRadius: 2,
  },
  label: {
    ...combineTypography(theme.typography.p)[0],
    color: theme.colors.text.primary,
    flex: 1,
  },
});
