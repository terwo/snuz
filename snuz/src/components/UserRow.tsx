import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ViewStyle, ImageSourcePropType } from 'react-native';
import { theme } from '../styles/theme';
import { combineTypography } from '../styles/typography';
import Checkbox from './Checkbox';

interface UserRowProps {
  user: {
    id: number;
    name: string;
    avatar: ImageSourcePropType;
  };
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export default function UserRow({ 
  user, 
  selected, 
  onPress,
  style,
}: UserRowProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
    >
      <View style={styles.userInfo}>
        <Image source={user.avatar} style={styles.avatar} />
        <Text style={styles.userName}>{user.name}</Text>
      </View>
      <Checkbox
        checked={selected}
        onPress={onPress}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    ...combineTypography(theme.typography.p)[0],
    color: theme.colors.text.primary,
  },
});
