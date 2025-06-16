import { useRouter } from 'expo-router';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { goBack } from 'expo-router/build/global-state/routing';

function isValidEmail(email: string) {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const signup = async () => {
        if (!isValidEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Account created! You can now log in.');
            router.replace('..');
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                Alert.alert('Email In Use', 'This email address is already registered.');
            } else if (err.code === 'auth/invalid-email') {
                Alert.alert('Invalid Email', 'Please enter a valid email address.');
            } else if (err.code === 'auth/weak-password') {
                Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            } else {
                Alert.alert('Signup failed', err.message || 'An unknown error occurred.');
            }
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                placeholder="Email"
                placeholderTextColor="#2e4d2c"
                onChangeText={setEmail}
                value={email}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor="#2e4d2c"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity style={styles.signupButton} onPress={signup} disabled={loading}>
                <Text style={styles.signupButtonText}>{loading ? "Signing up..." : "Sign Up"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={() => goBack()}>
                <Text style={styles.loginButtonText}>Back to Login</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaffd0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a2e1a',
        marginBottom: 32,
        letterSpacing: 1,
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderColor: '#b9ffb7',
        borderWidth: 1,
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        color: '#1a2e1a',
        fontSize: 16,
    },
    signupButton: {
        width: '100%',
        backgroundColor: '#1a2e1a',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#1a2e1a',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    signupButtonText: {
        color: '#b9ffb7',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#fff',
        borderColor: '#1a2e1a',
        borderWidth: 2,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#1a2e1a',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
});
