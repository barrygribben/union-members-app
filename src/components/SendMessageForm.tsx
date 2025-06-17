import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';

type User = {
  id: string;
  full_name: string;
  email: string;
  role?: string;
  membership_status?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  region?: string;
  site?: string;
  active?: boolean;
  created_at?: string;
};

interface SendMessageFormProps {
  recipients: User[];
  onBack: () => void;
}

const SendMessageForm: React.FC<SendMessageFormProps> = ({ recipients, onBack }) => {
  const [message, setMessage] = useState('');
  const handleSend = () => {
    // Replace with actual email/send logic
    Alert.alert('Message Sent', `Message sent to ${recipients.length} members`);
    setMessage('');
    onBack();
  };
  return (
    <View>
      <Text>Send to {recipients.length} recipients</Text>
      <TextInput
        placeholder="Your message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Button title="Send" onPress={handleSend} />
      <Button title="Cancel" onPress={onBack} />
    </View>
  );
};

export default SendMessageForm;
