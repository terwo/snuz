import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'Corben': require('../../assets/fonts/Corben-Regular.ttf'),
          'Corben-Bold': require('../../assets/fonts/Corben-Bold.ttf'),
          'Geist': require('../../assets/fonts/Geist-Regular.ttf'),
          'Geist-SemiBold': require('../../assets/fonts/Geist-SemiBold.ttf'),
          'Geist-Bold': require('../../assets/fonts/Geist-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Set to true even on error to not block the app
      }
    };

    loadFonts();
  }, []);

  return fontsLoaded;
};
