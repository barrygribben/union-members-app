import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

// Custom toast component for success messages
export const SuccessToast = ({ text1, text2 }: { text1?: string; text2?: string }) => (
  <View style={[styles.toast, styles.successToast]}>
    <MaterialIcons name="check-circle" size={24} color={theme.colors.success.main} />
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.title}>{text1}</Text>}
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  </View>
);

// Custom toast component for error messages
export const ErrorToast = ({ text1, text2 }: { text1?: string; text2?: string }) => (
  <View style={[styles.toast, styles.errorToast]}>
    <MaterialIcons name="error" size={24} color={theme.colors.error.main} />
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.title}>{text1}</Text>}
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  </View>
);

// Custom toast component for info messages
export const InfoToast = ({ text1, text2 }: { text1?: string; text2?: string }) => (
  <View style={[styles.toast, styles.infoToast]}>
    <MaterialIcons name="info" size={24} color={theme.colors.info.main} />
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.title}>{text1}</Text>}
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  </View>
);

// Custom toast component for warning messages
export const WarningToast = ({ text1, text2 }: { text1?: string; text2?: string }) => (
  <View style={[styles.toast, styles.warningToast]}>
    <MaterialIcons name="warning" size={24} color={theme.colors.warning.main} />
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.title}>{text1}</Text>}
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    minHeight: 60,
  },
  successToast: {
    backgroundColor: theme.colors.success.light,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success.main,
  },
  errorToast: {
    backgroundColor: theme.colors.error.light,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error.main,
  },
  infoToast: {
    backgroundColor: theme.colors.info.light,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info.main,
  },
  warningToast: {
    backgroundColor: theme.colors.warning.light,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning.main,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    ...theme.typography.h4,
    marginBottom: 2,
  },
  message: {
    ...theme.typography.body2,
  },
});

// Toast configuration object
export const toastConfig = {
  success: (props: any) => <SuccessToast {...props} />,
  error: (props: any) => <ErrorToast {...props} />,
  info: (props: any) => <InfoToast {...props} />,
  warning: (props: any) => <WarningToast {...props} />,
}; 