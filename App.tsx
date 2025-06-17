// Imports
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './lib/supabase';
import SplashScreen from './src/components/SplashScreen';
import MemberDetail from './src/components/MemberDetail';
import AdminDashboard from './src/components/AdminDashboard';
import ReportIssueForm from './src/components/ReportIssueForm';
import MemberFilterPanel from './src/components/MemberFilterPanel';
import SendMessageForm from './src/components/SendMessageForm';
import ViewMemberList from './src/components/ViewMemberList';

// User type
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

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);  // This is the person using the app
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);  // This is the selected user in some contexts, eg a member
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);   // This is an array of users eg returned from searching for members

  // Member: Report issue form state
  const [showIssueForm, setShowIssueForm] = useState(false);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Organiser screens - so organiser gets to see the member search components when logs in 
  // the syntax sets default value of screen to 'search'
  const [screen, setScreen] = useState<'search' | 'list' | 'message' | 'detail'>('search');

  // Login handler - this won't run until called 
  // its a separate supabase authentication system handles this
  // on providing email and password and this being cusseful loginData is returned
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
  // If user authenticates to supabase We then look up this uuid in our application table users ....
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
    setLoading(false);
  };
  // End of login function 

  const logout = async () => {
    await supabase.auth.signOut();
    setEmail('');
    setPassword('');
    setUser(null);
    setShowIssueForm(false);
    setSelectedUser(null);
    setFilteredMembers([]);
  };

  // Everyone gets Splash screen - time for display is in SplashScreen.tsx
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

  // Login screen - only displayed if no user ...
  if (!user) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} value={email} />
          <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword} value={password} />
          <Button title="Log In" onPress={handleLogin} />  {/*THIS DOES THE LOGIN*/}
          <Text>3 roles to play with</Text>
          <Text>Dummy db 1000 members, all have pw=123456</Text>
          <Text>  </Text>
          <Text>user555@example.com = admin </Text>
          <Text>user1001@example.com = member </Text>
          <Text>user100@example.com = organiser </Text>
          {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
        </View>
      </PaperProvider>
    );
  }

  // Show member details if selected eg if selected in a card produced by ViewMembers when View Details button pressed
  if (selectedUser) {
    return (
      <PaperProvider>
        <MemberDetail
          user={selectedUser}
          onBack={() => setSelectedUser(null)}
        />
      </PaperProvider>
    );
  }
  // Now we display interfaces depending on role of user - there are 3 roles at present admin / organiser / member
  // Admin dashboard view
  if (user.role === 'admin') {
    return (
      <PaperProvider>
        <AdminDashboard onLogout={logout} /> 
      </PaperProvider>
      );
  }

  // Organiser dashboard
  if (user.role === 'organiser') {
    return (
      <PaperProvider>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.greeting}>Kia ora, {user.full_name} 👋</Text>
          <Text style={styles.meta}>Role: {user.role}</Text>
          <Text style={styles.meta}>Manage members (eg search for David - has pics!) </Text>

          {screen === 'search' && (
          <>
          {/* Filter panel */}
          <MemberFilterPanel
            onSearchResults={(results: User[]) => {
              setFilteredMembers(results);
            }}
          />

          {/* Display result size and options */}
         
          <View style={{ marginVertical: 10 }}>
          {filteredMembers.length === 0 ? (
            <Text>No members found.</Text>
          ) : (          
            <>
              <Text>{filteredMembers.length} members found.</Text>
              <Button title="View Members" onPress={() => setScreen('list')} />
              <Button title="Send Message" onPress={() => setScreen('message')} />
            </> 
          )}
          </View>
        </>
        )}


       {screen === 'list' && (
          <ViewMemberList
            members={filteredMembers}
            onViewDetails={setSelectedUser}    // <-- This is the key!
            onBack={() => setScreen('search')}
          />
        )}

        {/* Message form */}
          {screen === 'message' && (
            <SendMessageForm
              recipients={filteredMembers}
              onBack={() => setScreen('list')}
            />
          )}

          <Button title="Log Out" onPress={logout} color="red" />
        </ScrollView>
      </PaperProvider>
    );
  }

  // Member dashboard
  if (user.role === 'member' || user.role === 'delegate') {
    return (
      <PaperProvider>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Member Dashboard</Text>
          <Text style={styles.greeting}>Kia ora, {user.full_name} 👋</Text>
          <Text style={styles.meta}>Role: {user.role}</Text>
          <Text style={styles.meta}>Site: {user.site}</Text>
          {user.avatar_url && (
            <Image source={{ uri: user.avatar_url }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          )}
          <Button title="Report Issue" onPress={() => setShowIssueForm(true)} />
          {showIssueForm && (
            <ReportIssueForm
              userId={user.id}
              onNoteSubmitted={() => setShowIssueForm(false)}
            />
          )}
          <Button title="Log Out" onPress={logout} color="red" />
        </ScrollView>
      </PaperProvider>
    );
  }

  // Fallback (should not be reached)
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Unknown role or error!</Text>
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
