import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';


type Props = {
  userId: string;
  onNoteSubmitted: () => void;
};

const ReportIssueForm: React.FC<Props> = ({ userId, onNoteSubmitted }) => {
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
        Alert.alert('Error', insertError.message);
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
            Alert.alert('Upload Failed', uploadError.message);
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
            Alert.alert('Image Save Failed', imageInsertError.message);
            return;
          }
        } catch (err) {
          console.error('Unexpected error in image upload block:', err);
          Alert.alert('Unexpected Error', 'Could not upload image.');
          return;
        }
      }
  if (Platform.OS === 'web') {
        window.alert('Note Submitted. Your issue has been recorded.');
      } else {
    Alert.alert(
    'Note Submitted',
    'Your issue has been recorded.',
    [{text: 'OK'}]
    )
}
        setNoteType('Health and Safety');
        setDescription('');
        setUrgent(false);
        setImageUri(null);
        onNoteSubmitted();


};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report an Issue</Text>
      <TextInput
        style={styles.input}
        placeholder="Type of Note"
        value={noteType}
        onChangeText={setNoteType}
      />
      <TextInput
        style={styles.input}
        placeholder="Describe the issue"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button
        title={urgent ? 'Mark as NOT Urgent' : 'Mark as Urgent'}
        onPress={() => setUrgent(!urgent)}
        color={urgent ? 'red' : 'grey'}
      />
      <Button title="Pick an Image (optional)" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
      <Button title="Submit Note" onPress={handleSubmit} />
    </View>
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
