import React from 'react';
import { useFonts } from '@use-expo/font'
import Navigator from './src/Navigator'
import { StatusBar } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {

    const [loaded] = useFonts({
        Lato: require('./assets/fonts/Lato.ttf'),
    });

    StatusBar.setBarStyle('light-content', true)

    if (!loaded) {
        return null
    } else {
        return (
            <Navigator />
        );
    }
}


