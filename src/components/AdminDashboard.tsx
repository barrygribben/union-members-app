import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [roleData, setRoleData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      const { data: roles, error: roleError } = await supabase.from('role_counts').select('*');
      const { data: statuses, error: statusError } = await supabase.from('membership_status_counts').select('*');

      if (roleError || statusError) {
        console.error('Fetch errors:', roleError, statusError);
      } else {
        setRoleData(roles || []);
        setStatusData(statuses || []);
      }
      setLoading(false);
    };

    fetchCounts();
  }, []);

  const chartWidth = Dimensions.get('window').width - 40;

    const roleChart = roleData.map((r, index) => ({
    name: r.role || 'Unknown',
    count: r.count,
    color: `hsl(${index * 60}, 70%, 60%)`,
    legendFontColor: '#333',
    legendFontSize: 14,
  }));

  const statusChart = statusData.map((s, index) => ({
    name: s.membership_status || 'Unknown',
    count: s.count,
    color: `hsl(${index * 60}, 70%, 60%)`,
    legendFontColor: '#333',
    legendFontSize: 14,
  }));

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  fillShadowGradientFrom: `#FF0000`, // Blue color
  fillShadowGradientFromOpacity: 1,
  fillShadowGradientTo: `#0000FF`,
  fillShadowGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(100, 100, 150, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  subheader: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
});
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <>
          <Text style={styles.subheader}>Users by Role</Text>
          <PieChart
            data={roleChart}
            width={chartWidth}
            height={220}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            chartConfig={chartConfig}
          />

          <Text style={styles.subheader}>Members by Status</Text>
          <PieChart
            data={statusChart}
            width={chartWidth}
            height={220}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            chartConfig={chartConfig}
          />
          <Button title="Log Out" onPress={onLogout} color="red" />
        </>
      )}

      </ScrollView>
  );
}

