import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createClient } from '@supabase/supabase-js';
import { Provider as PaperProvider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MemberDetail from './src/components/MemberDetail';
// Add type definitions
type Profile = {
  id: string;
  full_name: string;
  role: 'member' | 'organiser';
  member_id?: number;
};
type Member = {
  id: number;
  full_name: string;
  membership_status: string;
  avatar_url?: string;
};
import { supabase } from './lib/supabase'; 
export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editedName, setEditedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editedMemberName, setEditedMemberName] = useState('');
  const [editedMemberStatus, setEditedMemberStatus] = useState('');
  const [viewingSearchScreen, setViewingSearchScreen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });
  
    if (result.canceled) {
      console.log("Image picking cancelled.");
      return;
    }
  
    const uri = result.assets?.[0]?.uri;
    console.log("Image URI:", uri);
    if (uri) {
      uploadImage(uri);
    } else {
      console.log("No image selected or URI missing.");
    }
  };
  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);
      console.log("Uploading image from URI:", uri);
      const info = await ImagePicker.getMediaLibraryPermissionsAsync();
      console.log("Media Library Permissions:", info);
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: `${profile?.member_id}.jpg`,
        type: 'image/jpeg',
      } as any);
      const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
      if (!accessToken) throw new Error("No access token found");
      const uploadResponse = await fetch(`https://mufqimmxygsryxrigkec.supabase.co/storage/v1/object/avatars/${profile?.member_id}.jpg`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-upsert': 'true',
        },
        body: formData,
      });
      if (!uploadResponse.ok) {
        const errText = await uploadResponse.text();
        console.error("Upload response error:", errText);
        throw new Error("Supabase upload failed");
      }
      const filePath = `avatars/${profile?.member_id}.jpg`;
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const avatar_url = publicUrlData.publicUrl;
      console.log("Public URL:", avatar_url);
      await supabase.from('members').update({ avatar_url }).eq('id', profile?.member_id || 0);
      setMember((prev) => (prev ? { ...prev, avatar_url } : null));
      Alert.alert('Success', 'Profile photo updated');
    } catch (e: any) {
      console.error("Upload failed:", e.message);
      Alert.alert('Upload failed', e.message);
    } finally {
      setUploading(false);
    }
    
  };
  
  const handleLogin = async () => {
    setLoading(true);
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) {
      Alert.alert('Login Failed', loginError.message);
      setLoading(false);
      return;
    }
    const userId = loginData.user.id;
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, role, member_id')
      .eq('id', userId)
      .single();
    if (profileError || !profileData) {
      Alert.alert('Login Success', 'But no profile found');
      setLoading(false);
      return;
    }
    setProfile({ id: userId, ...profileData });
    if (profileData.role === 'member') {
      const { data: memberData } = await supabase
        .from('members')
        .select('*')
        .eq('id', profileData.member_id)
        .single();
      setMember(memberData);
    }
    setEditedName(profileData.full_name);
    setLoading(false);
  };
  const updateName = async () => {
    if (!profile) return;
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: editedName })
      .eq('id', profile.id);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Saved!', 'Your name has been updated.');
      setProfile({ ...profile, full_name: editedName });
    }
  };
  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setEmail('');
    setPassword('');
    setEditedName('');
    setSearchTerm('');
    setSearchResults([]);
    setViewingSearchScreen(false);
    setMember(null);
  };
  const searchMembers = async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .ilike('full_name', `%${searchTerm}%`)
      .order('id', { ascending: true });  // <-- explicitly order by ID;
    if (error) {
      Alert.alert('Search Error', error.message);
    } else {
      setSearchResults(data);
      setViewingSearchScreen(true);
    }
  };
  const updateMember = async () => {
    const { error } = await supabase
      .from('members')
      .update({ full_name: editedMemberName, membership_status: editedMemberStatus })
      .eq('id', editingMemberId);
    if (error) {
      Alert.alert('Update Error', error.message);
    } else {
      Alert.alert('Member updated');
      setEditingMemberId(null);
      setEditedMemberName('');
      setEditedMemberStatus('');
      searchMembers();
    }
  };

  if (!profile) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} value={email} />
          <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword} value={password} />
          <Button title="Log In" onPress={handleLogin} />
          {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
        </View>
      </PaperProvider>
    );
  }
  if (selectedMember) {
    return (
      <PaperProvider>
<MemberDetail
  member={selectedMember}
  onBack={(shouldRefresh) => {
    setSelectedMember(null);
    if (shouldRefresh) searchMembers();  // re-fetch latest data
  }}
/>
      </PaperProvider>
    );
  }

  if (profile.role === 'organiser' && viewingSearchScreen) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Text style={styles.title}>Search Results</Text>
          <Button title="Back to Dashboard" onPress={() => setViewingSearchScreen(false)} />
          {selectedMember ? (
            <MemberDetail
  member={selectedMember}
  onBack={(shouldRefresh) => {
    setSelectedMember(null);
    if (shouldRefresh) searchMembers();  // re-fetch latest data
  }}
/>
) : (
  <FlatList
    data={searchResults}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <View style={styles.profileCard}>
        {item.avatar_url && (
      <Image
        source={{ uri: item.avatar_url }}
        style={{ width: 40, height: 40, borderRadius: 20, marginBottom: 8 }}
      />
    )}
        <Text style={styles.meta}>Name: {item.full_name}</Text>
        <Text style={styles.meta}>Status: {item.membership_status}</Text>
        <Button title="View Details" onPress={() => setSelectedMember(item)} />
      </View>
    )}
  />
)}
          <Button title="Back to Dashboard" onPress={() => setViewingSearchScreen(false)} />
        </View>
      </PaperProvider>
    );
  }
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.profileCard}>
          <Text style={styles.greeting}>Kia ora, {profile.full_name} 👋</Text>
          <Text style={styles.meta}>Role: {profile.role}</Text>
          {profile.role === 'member' && (
            <>
              <Text style={styles.meta}>Member ID: {profile.member_id}</Text>
              {member?.avatar_url && (
                <Image source={{ uri: member.avatar_url }} style={{ width: 100, height: 100, borderRadius: 50 }} />
              )}
            </>
          )}
        </View>
        {profile.role === 'member' && (
          <>
            <TextInput style={styles.input} placeholder="Update your name" value={editedName} onChangeText={setEditedName} />
            <Button title="Save Name" onPress={updateName} />
            <Button title="Upload Profile Photo" onPress={pickImage} disabled={uploading} />
            {uploading && <ActivityIndicator style={{ marginTop: 10 }} />}
          </>
        )}
        {profile.role === 'organiser' && (
          <>
            <Text style={styles.title}>Search Members</Text>
            <TextInput
              style={styles.input}
              placeholder="Search by name"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <Button title="Search members" onPress={searchMembers} />
          </>
        )}
        <Button title="Log Out" onPress={logout} color="red" />
      </View>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  meta: {
    fontSize: 16,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
  },
});
