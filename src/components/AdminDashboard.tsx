import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Button } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { supabase } from '../../lib/supabase';

const screenWidth = Dimensions.get('window').width;

type Props = {
  onLogout: () => void;
};

const AdminDashboard: React.FC<Props> = ({ onLogout }) => {
  const [roleCounts, setRoleCounts] = useState<{ [key: string]: number }>({});
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch role counts
        const { data: roleData, error: roleError } = await supabase
          .from('users')
          .select('role, count:count(*)', { count: 'exact', head: false })
          .group('role');

        if (roleError) throw roleError;

        const roleCountMap: { [key: string]: number } = {};
        roleData.forEach((row: any) => {
          roleCountMap[row.role] = row.count;
        });
        setRoleCounts(roleCountMap);

        // Fetch membership status counts
        const { data: statusData, error: statusError } = await supabase
          .from('users')
          .select('membership_status, count:count(*)', { count: 'exact', head: false })
          .group('membership_status');

        if (statusError) throw statusError;

        const statusCountMap: { [key: string]: number } = {};
        statusData.forEach((row: any) => {
          statusCountMap[row.membership_status] = row.count;
        });
        setStatusCounts(statusCountMap);

      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const barData = {
    labels: ['Admin', 'Organiser', 'Delegate', 'Member'],
    datasets: [
      {
        data: [
          roleCounts['admin'] || 0,
          roleCounts['organiser'] || 0,
          roleCounts['delegate'] || 0,
          roleCounts['member'] || 0,
        ],
      },
    ],
  };

  const pieData = Object.keys(statusCounts).map((status, index) => ({
    name: status,
    population: statusCounts[status],
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'][index % 4],
    legendFontColor: '#333',
    legendFontSize: 14,
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <Text style={styles.subtitle}>Users by Role</Text>
      <BarChart
        data={barData}
        width={screenWidth - 32}
        height={220}
        fromZero={true}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={chartConfig}
        style={styles.chart}
      />

      <Text style={styles.subtitle}>Members by Status</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <Button title="Log Out" onPress={onLogout} color="red" />
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: '#f0f4ff',
  backgroundGradientFrom: '#f0f4ff',
  backgroundGradientTo: '#f0f4ff',
  decimalPlaces: 0,
  color: () => '#3366cc',
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
});

export default AdminDashboard;