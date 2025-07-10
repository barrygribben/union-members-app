import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { useToast } from './ToastProvider';
import { ToastMessages } from '../utils/toastMessages';
import {
  Container,
  Card,
  Title,
  Subtitle,
  BodyText,
  PrimaryButton,
  SecondaryButton,
  StyledInput,
} from './StyledComponents';

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
  const { showSuccess } = useToast();
  const [message, setMessage] = useState('');
  const handleSend = () => {
    // Replace with actual email/send logic
    showSuccess(ToastMessages.message.sent(recipients.length), 'Message Sent');
    setMessage('');
    onBack();
  };
  return (
    <Container>
      <Card>
        <Title>Send Message</Title>
        <Subtitle>Send to {recipients.length} recipients</Subtitle>
        
        <StyledInput
          placeholder="Type your message here..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        
        <PrimaryButton
          title="Send Message"
          onPress={handleSend}
        />
        
        <SecondaryButton
          title="Cancel"
          onPress={onBack}
        />
      </Card>
    </Container>
  );
};

export default SendMessageForm;
