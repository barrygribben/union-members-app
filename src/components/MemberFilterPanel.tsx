import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../lib/supabase';

export type FilterState = {
  name: string;
  site: string;
  active: boolean;
};

type Props = {
  onSearchResults: (results: any[]) => void;
};

const MemberFilterPanel: React.FC<Props> = ({ onSearchResults }) => {
  const [filter, setFilter] = useState<FilterState>({ name: '', site: '', active: false });
  const [sites, setSites] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchSites = async () => {
      const { data, error } = await supabase.from('sites').select('id, name');
      if (!error && data) setSites(data);
    };
    fetchSites();
  }, []);

  const handleSearch = async () => {
    let query = supabase.from('users').select('*');
    if (filter.name && filter.name !== '') { 
        query = query.ilike('full_name', `%${filter.name}%`);
    }
    if (filter.site && filter.site !== '') {
        query = query.eq('site', filter.site);
    }
    if (filter.active) {
        query = query.eq('membership_status', 'Active');
    }
    console.log(query)
    const { data, error } = await query;
    if (!error && data) onSearchResults(data);
    else onSearchResults([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for name(s)"
        style={styles.input}
        value={filter.name}
        onChangeText={name => setFilter(f => ({ ...f, name }))}
      />
      <Picker
        selectedValue={filter.site}
        onValueChange={site => setFilter(f => ({ ...f, site }))}
        style={styles.input}
      >
        <Picker.Item label="All Sites" value="" />
        {sites.map(s => (
          <Picker.Item label={s.name} value={s.name} key={s.id} />
        ))}
      </Picker>
      <View style={styles.switchRow}>
        <Text>Active Members Only</Text>
        <Switch value={filter.active} onValueChange={active => setFilter(f => ({ ...f, active }))} />
      </View>
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
});

export default MemberFilterPanel;
