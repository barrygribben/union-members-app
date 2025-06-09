import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { supabase } from '../../lib/supabase'; 

type User = {
  id: string;  // UUID from auth.users
  oldmember_id?: any;
  full_name: string;
  email: string;
  role?: string;
  membership_status?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  region?: string;
  created_at?: string;

  // Add any other fields you've added to the `users` table
};
type Props = {
  user: User;
  onBack: (refresh?: boolean) => void;
};

const MemberDetail: React.FC<Props> = ({ user, onBack }) => {
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.full_name);
  const [editedStatus, setEditedStatus] = useState(user.membership_status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: editedName,
        membership_status: editedStatus
      })
      .eq('id', user.id)
      .select();
    
      setSaving(false);

    if (error) {
      alert('Error saving changes: ' + error.message);
    } else if (!data || data.length === 0) {
      alert('No changes were made. Could not find user to update.');
    } else {
      alert('Changes saved');
      onBack(true);  // <-- pass the updated user
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Member Details</Text>

      {editing ? (
        <>
        <TextInput
          value={editedName}
          onChangeText={setEditedName}
          style={styles.input}
          placeholder="Full Name"
        />
          <TextInput
            value={editedStatus}
            onChangeText={setEditedStatus}
            style={styles.input}
            placeholder="Status"
          />
          <Button title="Save" onPress={handleSave} />
        </>
      ) : (
        <>
          <Image source={{ uri: user.avatar_url }} style={styles.avatar} resizeMode="cover" />
          <Text style={styles.meta}>Name: {user.full_name}</Text>
          <Text style={styles.meta}>Status: {user.membership_status}</Text>
          <Button title="Edit" onPress={() => setEditing(true)} />
        </>
      )}

<Button title="Back to Results" onPress={() => onBack()} />
    </View>
  );
};

export default MemberDetail;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
  },
  meta: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
