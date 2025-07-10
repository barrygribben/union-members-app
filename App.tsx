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
import { ToastProvider, useToast } from './src/components/ToastProvider';
import { theme } from './src/styles/theme';
import {
  Container,
  Card,
  Title,
  Subtitle,
  BodyText,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  StyledInput,
  SectionHeader,
} from './src/components/StyledComponents';
import LogoutIconButton from './src/components/LogoutIconButton';

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

function AppContent() {
  const { showSuccess, showError } = useToast();
  const [showSplash, setShowSplash] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);  // This is the person using the app
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);  // This is the selected user in some contexts, eg a member
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);   // This is an array of users eg returned from searching for members
  const [showProfile, setShowProfile] = useState(false);


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
      showError(loginError?.message || 'Unknown error', 'Login Failed');
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
      showError('But no user record found in `users` table', 'Login Success');
      setLoading(false);
      return;
    }

    setUser(userData);
    showSuccess('Welcome back!');
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
        <Container>
          <Card style={styles.loginCard}>
            <Title>Union Members App</Title>
            <Subtitle>Sign in to your account</Subtitle>
            
            <StyledInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <StyledInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <PrimaryButton
              title="Sign In"
              onPress={handleLogin}
              disabled={loading}
            />
            
            {loading && (
              <ActivityIndicator 
                size="large" 
                color={theme.colors.primary[500]}
                style={{ marginTop: theme.spacing.lg }}
              />
            )}
            
            <SectionHeader>Test Accounts</SectionHeader>
            <BodyText>All accounts use password: 123456</BodyText>
            <BodyText>• user555@example.com (Admin)</BodyText>
            <BodyText>• user1001@example.com (Member)</BodyText>
            <BodyText>• user100@example.com (Organiser)</BodyText>
          </Card>
        </Container>
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
        <Container>
          <LogoutIconButton onPress={logout} />
          <AdminDashboard onLogout={logout} />
        </Container>
      </PaperProvider>
      );
  }

  // Organiser dashboard
  if (user.role === 'organiser') {
    return (
      <PaperProvider>
        <Container>
          <LogoutIconButton onPress={logout} />
          <Card>
            <Title>Organiser Dashboard</Title>
            <Subtitle>Kia ora, {user.full_name} 👋</Subtitle>
            <BodyText>Role: {user.role}</BodyText>
            <BodyText>Manage members (eg search for David - has pics!)</BodyText>
          </Card>

          {screen === 'search' && (
            <>
              {/* Search Members + Selected: X on same line */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Subtitle style={{ marginBottom: 0 }}>Search Members</Subtitle>
                <BodyText style={{ marginBottom: 0, fontWeight: '600' }}>Selected: {filteredMembers.length}</BodyText>
              </View>
              {/* Filter panel (without its own subtitle) */}
              <MemberFilterPanel
                onSearchResults={(results: User[]) => {
                  setFilteredMembers(results);
                }}
                hideTitle
              />
              {/* Action buttons always visible */}
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                <PrimaryButton
                  title="View Members"
                  onPress={() => setScreen('list')}
                  disabled={filteredMembers.length === 0}
                  style={{ flex: 1 }}
                />
                <SecondaryButton
                  title="Send Message"
                  onPress={() => setScreen('message')}
                  disabled={filteredMembers.length === 0}
                  style={{ flex: 1 }}
                />
              </View>
            </>
          )}

          {screen === 'list' && (
            <ViewMemberList
              members={filteredMembers}
              onViewDetails={setSelectedUser}
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
        </Container>
      </PaperProvider>
    );
  }


  if (showProfile) {
    return (
      <PaperProvider>
        <MemberDetail
          user={user}
          onBack={() => setShowProfile(false)}
        />
      </PaperProvider>
    );
  }

  // Member dashboard
  if (user.role === 'member' || user.role === 'delegate') {
    // Show Report Issue form as separate screen
    if (showIssueForm) {
      return (
        <PaperProvider>
          <ReportIssueForm
            userId={user.id}
            onNoteSubmitted={() => setShowIssueForm(false)}
          />
        </PaperProvider>
      );
    }

    return (
      <PaperProvider>
        <Container>
          <LogoutIconButton onPress={logout} />
          <Card>
            <Title>Member Dashboard</Title>
            <Subtitle>Kia ora, {user.full_name} 👋</Subtitle>
            <BodyText>Role: {user.role}</BodyText>
            <BodyText>Site: {user.site}</BodyText>
            {user.avatar_url && (
              <Image 
                source={{ uri: user.avatar_url }} 
                style={styles.avatar} 
              />
            )}
          </Card>

          <Card>
            <PrimaryButton
              title="Report Issue"
              onPress={() => setShowIssueForm(true)}
            />
            <SecondaryButton
              title="View/Edit My Profile"
              onPress={() => setShowProfile(true)}
            />
          </Card>
        </Container>
      </PaperProvider>
    );
  }

  // Fallback (should not be reached)
  return (
    <PaperProvider>
      <Container>
        <Card>
          <Title>Error</Title>
          <BodyText>Unknown role or error!</BodyText>
          <DangerButton title="Log Out" onPress={logout} />
        </Card>
      </Container>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loginCard: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: theme.spacing.md,
  },
});

// Main App component with ToastProvider wrapper
export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
