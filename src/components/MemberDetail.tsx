import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase'; 

type Member = {
  id: number;
  full_name: string;
  membership_status: string;
};

type Props = {
  member: Member;
  onBack: (refresh?: boolean) => void;
};

const MemberDetail: React.FC<Props> = ({ member, onBack }) => {
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(member.full_name);
  const [editedStatus, setEditedStatus] = useState(member.membership_status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('members')
      .update({
        full_name: editedName,
        membership_status: editedStatus,
      })
      .eq('id', member.id);

    setSaving(false);

    if (error) {
      alert('Error saving changes: ' + error.message);
    } else {
      alert('Changes saved');
      setEditing(false);
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
          <Button
  title="Save"
  onPress={async () => {
    setSaving(true);
    const { error } = await supabase
      .from('members')
      .update({
        full_name: editedName,
        membership_status: editedStatus,
      })
      .eq('id', member.id);

    if (error) {
      alert('Error saving changes');
    } else {
      alert('Changes saved');
      onBack(true);  // trigger refresh in parent
    }

    setSaving(false);
  }}
/>
        </>
      ) : (
        <>
          <Text style={styles.meta}>Name: {member.full_name}</Text>
          <Text style={styles.meta}>Status: {member.membership_status}</Text>
          <Button title="Edit" onPress={() => setEditing(true)} />
        </>
      )}

      <Button title="Back to Results" onPress={onBack} />
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
});
