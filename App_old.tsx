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
import { Provider as PaperProvider } from 'react-native-paper';
import MemberDetail from './src/components/MemberDetail';
import { supabase } from './lib/supabase';

// Type definitions

type User = {
  id: string;
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
};

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedName, setEditedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [viewingSearchScreen, setViewingSearchScreen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });

    if (result.canceled) return;

    const uri = result.assets?.[0]?.uri;
    if (uri) uploadImage(uri);
  };

  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);
      if (!user) return;

      const formData = new FormData();
      formData.append('file', {
        uri,
        name: `${user.id}.jpg`,
        type: 'image/jpeg',
      } as any);

      const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
      if (!accessToken) throw new Error("No access token found");

      const uploadResponse = await fetch(`https://mufqimmxygsryxrigkec.supabase.co/storage/v1/object/avatars/${user.id}.jpg`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-upsert': 'true',
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errText = await uploadResponse.text();
        throw new Error(errText);
      }

      const filePath = `avatars/${user.oldmember_id}.jpg`;
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const avatar_url = publicUrlData.publicUrl;

      await supabase.from('users').update({ avatar_url }).eq('id', user.id);
      setUser((prev) => (prev ? { ...prev, avatar_url } : null));
      Alert.alert('Success', 'Profile photo updated');
    } catch (e: any) {
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

    if (loginError || !loginData.user) {
      Alert.alert('Login Failed', loginError?.message || 'Unknown error');
      setLoading(false);
      return;
    }

    const userId = loginData.user.id;

    const { data: userData, error: userFetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userFetchError || !userData) {
      Alert.alert('Login Success', 'But no user record found in `users` table');
      setLoading(false);
      return;
    }

    setUser(userData);
    setEditedName(userData.full_name);
    setLoading(false);
  };

  const updateName = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('users')
      .update({ full_name: editedName })
      .eq('id', user.id);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Saved!', 'Your name has been updated.');
      setUser({ ...user, full_name: editedName });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setEmail('');
    setPassword('');
    setEditedName('');
    setSearchTerm('');
    setSearchResults([]);
    setViewingSearchScreen(false);
    setUser(null);
  };

  const searchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, role, membership_status, avatar_url')
      .ilike('full_name', `%${searchTerm}%`)
      .order('id', { ascending: true });
    console.log('Search returned', data?.length, 'users:', data);
    if (error) {
      Alert.alert('Search Error', error.message);
    } else {
      setSearchResults(data);
      setViewingSearchScreen(true);
    }
  };

  if (!user) {
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

  if (selectedUser) {
    return (
      <PaperProvider>
        <MemberDetail
          user={selectedUser}
          onBack={(shouldRefresh) => {
            setSelectedUser(null);
            if (shouldRefresh) searchUsers();
          }}
        />
      </PaperProvider>
    );
  }

  if (user.role === 'organiser' && viewingSearchScreen) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Text style={styles.title}>Search Results</Text>
          <Button title="Back to Dashboard" onPress={() => setViewingSearchScreen(false)} />
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
                <Button title="View Details" onPress={() => setSelectedUser(item)} />
              </View>
            )}
          />
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
          <Text style={styles.greeting}>Kia ora, {user.full_name} 👋</Text>
          <Text style={styles.meta}>Role: {user.role}</Text>
          {user.role === 'member' && (
            <>
              <Text style={styles.meta}>Member ID: {user.id}</Text>
              {user.avatar_url && (
                <Image source={{ uri: user.avatar_url }} style={{ width: 100, height: 100, borderRadius: 50 }} />
              )}
            </>
          )}
        </View>
        {user.role === 'member' && (
          <>
            <TextInput style={styles.input} placeholder="Update your name" value={editedName} onChangeText={setEditedName} />
            <Button title="Save Name" onPress={updateName} />
            <Button title="Upload Profile Photo" onPress={pickImage} disabled={uploading} />
            {uploading && <ActivityIndicator style={{ marginTop: 10 }} />}
          </>
        )}
        {user.role === 'organiser' && (
          <>
            <Text style={styles.title}>Search Members</Text>
            <TextInput
              style={styles.input}
              placeholder="Search by name"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <Button title="Search members" onPress={searchUsers} />
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
