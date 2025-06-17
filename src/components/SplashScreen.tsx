import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

type Props = {
  onFinish: () => void;
};

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFinish();
    }, 5000); // show for 3 seconds
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/MaramaUnionSplash.png')} // Replace with your file path
        style={styles.logo}
        resizeMode="stretch"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,                  // Full height
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Optional, good fallback color
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});