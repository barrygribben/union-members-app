import React from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet } from 'react-native';



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

type Props = {
  members: User[];
  onViewDetails: (user: User) => void;
  onBack: () => void;
};

const ViewMemberList: React.FC<Props> = ({ members, onViewDetails, onBack }) => (
  <View style={{ flex: 1, padding: 16 }}>
    <Button title="Back to Search" onPress={onBack} />
    <FlatList
      data={members}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
  <View style={styles.cardRow}>
    {item.avatar_url ? (
      <Image
        source={{ uri: item.avatar_url }}
        style={styles.avatar}
      />
    ) : (
      <View style={styles.avatarInitials}>
        <Text style={styles.initialsText}>
          {getInitials(item.full_name)}
        </Text>
      </View>
    )}
    <View style={styles.info}>
      <Text style={styles.name}>{item.full_name}</Text>
      <Text>Site: {item.site || 'N/A'}</Text>
      <Text>Status: {item.membership_status}</Text>
    </View>
    <View style={styles.buttonArea}>
      <Button title="View Details" onPress={() => onViewDetails(item)} />
    </View>
  </View>
)}
    />
  </View>
);

function getInitials(name: string) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0];
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f3f7fb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#aac7f5',
  },
  avatarInitials: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#aac7f5', // matches avatar background for consistency
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 2,
  },
  buttonArea: {
    marginLeft: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default ViewMemberList;