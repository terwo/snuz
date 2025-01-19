import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { theme } from '../styles/theme';
import { combineTypography } from '../styles/typography';

interface BaseInputProps {
  label?: string;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

interface TimePickerProps extends BaseInputProps {
  type: 'time';
  value: Date;
  onChange: (date: Date) => void;
  showPicker: boolean;
  onPress: () => void;
  onPickerDismiss: () => void;
}

interface NumberInputProps extends BaseInputProps {
  type: 'number';
  value: string;
  onChangeText: (text: string) => void;
  suffix?: string;
  maxLength?: number;
}

type InputProps = TimePickerProps | NumberInputProps;

export default function Input(props: InputProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderTimePicker = ({ 
    value, 
    onChange, 
    showPicker, 
    onPress,
    onPickerDismiss,
    style,
  }: TimePickerProps) => (
    <>
      <TouchableOpacity
        style={[styles.inputContainer, style]}
        onPress={onPress}
      >
        <Text style={styles.timeText}>{formatTime(value)}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value}
          mode="time"
          is24Hour={false}
          onChange={(event: DateTimePickerEvent, date?: Date) => {
            onPickerDismiss();
            if (event.type === 'set' && date) {
              onChange(date);
            }
          }}
          style={styles.timePicker}
        />
      )}
    </>
  );

  const renderNumberInput = ({ 
    value, 
    onChangeText, 
    suffix,
    style,
    maxLength = 2,
  }: NumberInputProps) => (
    <View style={styles.inputRow}>
      <TextInput
        style={[styles.inputContainer, styles.numberInput, style]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        maxLength={maxLength}
      />
      {suffix && <Text style={styles.inputSuffix}>{suffix}</Text>}
    </View>
  );

  return (
    <View style={[styles.container, props.containerStyle]}>
      {props.label && (
        <Text style={[styles.label, props.labelStyle]}>
          {props.label}
        </Text>
      )}
      {props.type === 'time' 
        ? renderTimePicker(props)
        : renderNumberInput(props)
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    ...combineTypography(theme.typography.h2)[0],
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.background.outline,
    borderRadius: 8,
    padding: 12,
    height: 48,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberInput: {
    ...combineTypography(theme.typography.p)[0],
    width: 60,
    marginRight: 8,
    color: theme.colors.text.primary,
    textAlign: 'center',
    padding: 8,
  },
  timeText: {
    ...combineTypography(theme.typography.p)[0],
    color: theme.colors.text.primary,
  },
  timePicker: {
    flex: Platform.OS === 'ios' ? 1 : undefined,
  },
  inputSuffix: {
    ...combineTypography(theme.typography.p)[0],
    color: theme.colors.text.primary,
  },
});
