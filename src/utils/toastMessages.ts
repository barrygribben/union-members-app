// Common toast message utilities
// These can be used to maintain consistency across the app

export const ToastMessages = {
  // Authentication messages
  login: {
    success: 'Welcome back!',
    error: 'Invalid email or password',
    noUserRecord: 'Login successful but no user record found',
  },
  
  // Form submission messages
  form: {
    success: 'Form submitted successfully',
    error: 'Failed to submit form',
    required: 'Please fill in all required fields',
  },
  
  // Profile messages
  profile: {
    updated: 'Profile updated successfully',
    updateError: 'Failed to update profile',
    photoUploaded: 'Profile photo updated',
    photoError: 'Failed to upload photo',
  },
  
  // Issue reporting messages
  issue: {
    submitted: 'Your issue has been recorded',
    submitError: 'Failed to submit issue',
    imageUploadError: 'Failed to upload image',
  },
  
  // Member management messages
  member: {
    saved: 'Member details saved',
    saveError: 'Failed to save member details',
    notFound: 'Member not found',
  },
  
  // Messaging
  message: {
    sent: (count: number) => `Message sent to ${count} members`,
    sendError: 'Failed to send message',
  },
  
  // General messages
  general: {
    loading: 'Loading...',
    networkError: 'Network error. Please try again.',
    unknownError: 'An unexpected error occurred',
    success: 'Operation completed successfully',
  },
};

// Helper function to get message with count
export const getMessageWithCount = (template: string, count: number): string => {
  return template.replace('{count}', count.toString());
};

// Helper function to get error message with details
export const getErrorMessage = (baseMessage: string, details?: string): string => {
  return details ? `${baseMessage}: ${details}` : baseMessage;
}; 