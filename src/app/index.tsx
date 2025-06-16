import { useRouter } from 'expo-router';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const login = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace('/(tabs)/old-index');
        } catch (err: any) {
            if (err.code === 'auth/invalid-email') {
                Alert.alert('Invalid Email', 'Please enter a valid email address.');
            } else if (err.code === 'auth/user-not-found') {
                Alert.alert('User Not Found', 'No account found with this email.');
            } else if (err.code === 'auth/wrong-password') {
                Alert.alert('Wrong Password', 'The password you entered is incorrect.');
            } else if (err.code === 'auth/too-many-requests') {
                Alert.alert('Too Many Attempts', 'Access to this account has been temporarily disabled due to many failed login attempts. Please try again later or reset your password.');
            } else {
                Alert.alert('Login failed', err.message || 'An unknown error occurred.');
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
            <Text style={styles.title}>Welcome Back</Text>
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
            <TouchableOpacity style={styles.loginButton} onPress={login} disabled={loading}>
                <Text style={styles.loginButtonText}>{loading ? "Logging in..." : "Login"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/signup')}>
                <Text style={styles.signupButtonText}>Go to Signup</Text>
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
    loginButton: {
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
    loginButtonText: {
        color: '#b9ffb7',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    signupButton: {
        width: '100%',
        backgroundColor: '#fff',
        borderColor: '#1a2e1a',
        borderWidth: 2,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    signupButtonText: {
        color: '#1a2e1a',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
});
