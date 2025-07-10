import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

// Styled Container
export const Container: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <View style={[styles.container, style]}>
    {children}
  </View>
);

// Styled Card
export const Card: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

// Styled Title
export const Title: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <Text style={[styles.title, style]}>
    {children}
  </Text>
);

// Styled Subtitle
export const Subtitle: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <Text style={[styles.subtitle, style]}>
    {children}
  </Text>
);

// Styled Body Text
export const BodyText: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <Text style={[styles.bodyText, style]}>
    {children}
  </Text>
);

// Styled Caption
export const Caption: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <Text style={[styles.caption, style]}>
    {children}
  </Text>
);

// Styled Input
export const StyledInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  style?: any;
}> = ({ placeholder, value, onChangeText, secureTextEntry, multiline, style }) => (
  <TextInput
    style={[styles.input, style]}
    placeholder={placeholder}
    placeholderTextColor={theme.colors.text.secondary}
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    multiline={multiline}
  />
);

// Primary Button
export const PrimaryButton: React.FC<{
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}> = ({ title, onPress, disabled, style }) => (
  <TouchableOpacity
    style={[
      styles.primaryButton,
      disabled && styles.primaryButtonDisabled,
      style
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// Secondary Button
export const SecondaryButton: React.FC<{
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}> = ({ title, onPress, disabled, style }) => (
  <TouchableOpacity
    style={[
      styles.secondaryButton,
      disabled && styles.secondaryButtonDisabled,
      style
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[styles.secondaryButtonText, disabled && styles.buttonTextDisabled]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// Danger Button
export const DangerButton: React.FC<{
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}> = ({ title, onPress, disabled, style }) => (
  <TouchableOpacity
    style={[
      styles.dangerButton,
      disabled && styles.dangerButtonDisabled,
      style
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// Section Header
export const SectionHeader: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <View style={[styles.sectionHeader, style]}>
    <Text style={styles.sectionHeaderText}>{children}</Text>
  </View>
);

// Divider
export const Divider: React.FC<{ style?: any }> = ({ style }) => (
  <View style={[styles.divider, style]} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.md,
  },
  title: {
    ...theme.typography.h2,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary[700],
  },
  subtitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  bodyText: {
    ...theme.typography.body1,
    marginBottom: theme.spacing.sm,
  },
  caption: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.surface,
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.text.primary,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  primaryButtonDisabled: {
    backgroundColor: theme.colors.neutral[300],
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.secondary[500],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
  secondaryButtonDisabled: {
    borderColor: theme.colors.neutral[300],
  },
  dangerButton: {
    backgroundColor: theme.colors.error.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  dangerButtonDisabled: {
    backgroundColor: theme.colors.neutral[300],
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
  secondaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.secondary[500],
  },
  buttonTextDisabled: {
    color: theme.colors.text.disabled,
  },
  sectionHeader: {
    backgroundColor: theme.colors.primary[50],
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
  },
  sectionHeaderText: {
    ...theme.typography.h4,
    color: theme.colors.primary[700],
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.neutral[200],
    marginVertical: theme.spacing.md,
  },
}); 