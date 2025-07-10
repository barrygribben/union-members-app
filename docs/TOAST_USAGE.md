# Toast Message System

This document explains how to use the toast message system in the Union Members App.

## Overview

The app uses `react-native-toast-message` with a custom context provider for displaying toast notifications. Toasts appear at the top of the screen and automatically disappear after 4 seconds.

## Available Toast Types

- **Success** - Green toast with checkmark icon
- **Error** - Red toast with error icon  
- **Info** - Blue toast with info icon
- **Warning** - Orange toast with warning icon

## How to Use

### 1. Import the hook

```typescript
import { useToast } from '../components/ToastProvider';
```

### 2. Use in your component

```typescript
const MyComponent = () => {
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  
  const handleSubmit = () => {
    // Show success message
    showSuccess('Operation completed successfully');
    
    // Show error message
    showError('Something went wrong');
    
    // Show info message
    showInfo('Please check your email');
    
    // Show warning message
    showWarning('This action cannot be undone');
  };
};
```

### 3. Using with titles

You can also provide a title for the toast:

```typescript
showSuccess('Profile updated successfully', 'Success');
showError('Failed to connect to server', 'Connection Error');
```

## Predefined Messages

Use the `ToastMessages` utility for consistent messaging:

```typescript
import { ToastMessages } from '../utils/toastMessages';

// Authentication
showSuccess(ToastMessages.login.success);
showError(ToastMessages.login.error);

// Form submission
showSuccess(ToastMessages.form.success);
showError(ToastMessages.form.error);

// Profile updates
showSuccess(ToastMessages.profile.updated);
showError(ToastMessages.profile.updateError);

// Issue reporting
showSuccess(ToastMessages.issue.submitted);
showError(ToastMessages.issue.submitError);

// Messaging
showSuccess(ToastMessages.message.sent(5)); // "Message sent to 5 members"
```

## Toast Configuration

Toasts are configured with:
- **Position**: Top of screen
- **Duration**: 4 seconds
- **Auto-hide**: Yes
- **Top offset**: 50px from top

## Customization

To customize toast appearance, edit `src/components/ToastConfig.tsx`:

```typescript
// Change colors, icons, or layout
const styles = StyleSheet.create({
  successToast: {
    backgroundColor: '#E8F5E8',
    borderLeftColor: '#4CAF50',
  },
  // ... other styles
});
```

## Best Practices

1. **Use appropriate types**: Success for confirmations, Error for failures, Info for general info, Warning for cautions
2. **Keep messages concise**: Toast messages should be brief and clear
3. **Use predefined messages**: Leverage `ToastMessages` for consistency
4. **Don't overuse**: Avoid showing toasts for every minor action
5. **Provide context**: Use titles when the message needs more context

## Migration from Alert.alert()

Replace `Alert.alert()` calls with appropriate toast messages:

```typescript
// Before
Alert.alert('Success', 'Operation completed');

// After
showSuccess('Operation completed', 'Success');
```

## Examples

### Login Success
```typescript
showSuccess(ToastMessages.login.success);
```

### Form Validation Error
```typescript
showError(ToastMessages.form.required);
```

### Network Error
```typescript
showError(ToastMessages.general.networkError);
```

### Member Count
```typescript
showInfo(`${members.length} members found`);
``` 