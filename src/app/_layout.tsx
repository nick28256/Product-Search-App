
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AnimatedSplashScreen from "../components/AnimatedSplashScreen";
import Animated, { FadeIn } from 'react-native-reanimated';
import { StatusBar } from "expo-status-bar";
import React from "react";


export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);




  useEffect(() => {
    if (!appReady) {
      setAppReady(true);
    }
  }, [appReady]);

  if (!appReady || !splashAnimationFinished) {
    return (
      <AnimatedSplashScreen onAnimationFinish={(isCanceled) => {
        if (!isCanceled) {
          setSplashAnimationFinished(true);
        }
      }}
      />
    );
  }




  return (
    <Animated.View style={{ flex: 1 }} entering={FadeIn}>
      <StatusBar style="auto" />
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </Animated.View>
  );
}
