import React, { useState } from 'react';
import { StyleSheet, Platform, View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

interface LogoutIconButtonProps {
  onPress: () => void;
}

const LogoutIconButton: React.FC<LogoutIconButtonProps> = ({ onPress }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View style={styles.wrapper}>
      {showTooltip && (
        <View style={styles.tooltip} pointerEvents="none">
          <Text style={styles.tooltipText}>Sign out</Text>
        </View>
      )}
      <Pressable
        onPress={onPress}
        style={styles.iconButton}
        accessibilityLabel="Log out"
        hitSlop={10}
        onHoverIn={() => Platform.OS === 'web' && setShowTooltip(true)}
        onHoverOut={() => Platform.OS === 'web' && setShowTooltip(false)}
        onLongPress={() => Platform.OS !== 'web' && setShowTooltip(true)}
        onPressOut={() => Platform.OS !== 'web' && setShowTooltip(false)}
      >
        <MaterialIcons name="logout" size={28} color={theme.colors.error.main} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 100,
    alignItems: 'flex-end',
  },
  iconButton: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 24,
    padding: 4,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tooltip: {
    backgroundColor: theme.colors.neutral[900],
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 6,
    alignSelf: 'center',
    maxWidth: 120,
  },
  tooltipText: {
    color: theme.colors.text.inverse,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LogoutIconButton; 