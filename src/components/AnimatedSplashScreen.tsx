import React, { useRef } from 'react';
import LottieView from 'lottie-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const AnimatedSplashScreen = ({ onAnimationFinish = (isCanceled) => { }, }: { onAnimationFinish?: (isCanceled: boolean) => void; }) => {
    const animation = useRef<LottieView>(null);

    return (
        <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <LottieView
                ref={animation}
                loop={false}
                onAnimationFinish={onAnimationFinish}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                source={require('@assets/lottie/SplashScreen.json')}
                autoPlay
            />
        </Animated.View>
    );
};

export default AnimatedSplashScreen;
