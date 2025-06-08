import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mufqimmxygsryxrigkec.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11ZnFpbW14eWdzcnl4cmlna2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTg5MjYsImV4cCI6MjA2NDgzNDkyNn0.wSKVcocMI1oahb68MhDCyQcqem8NimF18rtm-HpNUOs';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type Member = {
  id: number;
  full_name: string;
  membership_status: string;
};

type Props = {
  member: Member;
  onBack: () => void;
};

const MemberDetail: React.FC<Props> = ({ member, onBack }) => {
  const [editedName, setEditedName] = useState(member.full_name);
  const [editedStatus, setEditedStatus] = useState(member.membership_status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    console.log("Updating member ID:", member.id);
    console.log("Saving values:", { id: member.id, editedName, editedStatus });
    const session = await supabase.auth.getSession();
    console.log("Session:", session.data?.session);
    const { error } = await supabase
      .from('members')
      .update({
        full_name: editedName,
        membership_status: editedStatus,
      })
      .eq('id', member.id);

    if (error) {
      console.error('Update failed:', error.message);
      alert('Error saving changes');
    } else {
      alert('Changes saved');
    }

    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Member Details</Text>

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

      <Button title={saving ? 'Saving...' : 'Save'} onPress={handleSave} disabled={saving} />
      <Button title="Back" onPress={onBack} />
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
});
