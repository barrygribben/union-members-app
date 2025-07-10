import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
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


type Props = {
  userId: string;
  onNoteSubmitted: () => void;
};

const ReportIssueForm: React.FC<Props> = ({ userId, onNoteSubmitted }) => {
  const { showSuccess, showError } = useToast();
  const [noteType, setNoteType] = useState('Health and Safety');
  const [description, setDescription] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  const handleSubmit = async () => {
    const noteId = uuidv4();
    let imageUrl: string | null = null;

      console.log('Submitting note...');
      const { error: insertError } = await supabase.from('notes').insert([
        {
          id: noteId,
          member_id: userId,
          note_type: noteType,
          description,
          urgent,
        },
      ]);

      if (insertError) {
        showError(insertError.message, 'Error');
        return;
      }

      if (imageUri) {
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const fileName = `${noteId}.jpg`;

          const { error: uploadError } = await supabase.storage
            .from('note-images')
            .upload(fileName, blob, {
              contentType: 'image/jpeg',
              upsert: true,
            });

          if (uploadError) {
            console.error('Upload error:', uploadError.message);
            showError(uploadError.message, 'Upload Failed');
            return;
          }

          const { data: publicUrlData } = supabase.storage
            .from('note-images')
            .getPublicUrl(fileName);

          imageUrl = publicUrlData.publicUrl;
          const { error: imageInsertError } = await supabase
            .from('note_images')
            .insert([{ note_id: noteId, image_url: imageUrl }]);
console.log('All saved ok');
          if (imageInsertError) {
            console.error('Image insert error:', imageInsertError.message);
            showError(imageInsertError.message, 'Image Save Failed');
            return;
          }
        } catch (err) {
          console.error('Unexpected error in image upload block:', err);
          showError('Could not upload image.', 'Unexpected Error');
          return;
        }
      }
  showSuccess(ToastMessages.issue.submitted, 'Note Submitted');
        setNoteType('Health and Safety');
        setDescription('');
        setUrgent(false);
        setImageUri(null);
        onNoteSubmitted();


};

  return (
    <Container>
      <Card>
        <Title>Report an Issue</Title>
        <Subtitle>Help us improve workplace conditions</Subtitle>
        
        <StyledInput
          placeholder="Type of Issue"
          value={noteType}
          onChangeText={setNoteType}
        />
        <StyledInput
          placeholder="Describe the issue in detail"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        
        <SecondaryButton
          title={urgent ? 'Mark as NOT Urgent' : 'Mark as Urgent'}
          onPress={() => setUrgent(!urgent)}
        />
        
        <SecondaryButton
          title="Add Photo (Optional)"
          onPress={pickImage}
        />
        
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}
        
        <PrimaryButton
          title="Submit Report"
          onPress={handleSubmit}
        />
      </Card>
    </Container>
  );
};

export default ReportIssueForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
    marginBottom: 10,
  },
});
