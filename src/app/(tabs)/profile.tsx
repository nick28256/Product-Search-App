import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../../lib/firebase';
import { updateProfile, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ScreenContainer';

const Profile = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setDisplayName(firebaseUser?.displayName || '');
            setPhotoURL(firebaseUser?.photoURL || null);

            // Redirect to login if logged out
            if (!firebaseUser) {
                router.replace('../index'); // or '/index' if that's your login route
            }
        });
        return unsubscribe;
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPhotoURL(result.assets[0].uri);
        }
    };

    const handleUpdate = async () => {
        if (!user) return;
        setUpdating(true);
        try {
            await updateProfile(user, {
                displayName,
                photoURL,
            });
            Alert.alert('Profile updated!');
        } catch (e) {
            Alert.alert('Error updating profile', (e as Error).message);
        }
        setUpdating(false);
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await signOut(auth);
            router.push('/'); // Navigate to the home screen or login screen after logout
        } catch (e) {
            Alert.alert('Error logging out', (e as Error).message);
        }
        setLoggingOut(false);
    };

    if (!user) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1a2e1a" />
                <Text style={{ marginTop: 10 }}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={photoURL ? { uri: photoURL } : require('../../../assets/images/profile-placeholder.png')}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                        <Image
                            source={require('../../../assets/images/camera.png')}
                            style={styles.cameraIcon}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.changePhotoText}>Change Photo</Text>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.email}</Text>
                <Text style={styles.label}>Display Name:</Text>
                <TextInput
                    style={styles.input}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter display name"
                    placeholderTextColor="#888"
                />
                <TouchableOpacity
                    style={[styles.updateButton, updating && { opacity: 0.7 }]}
                    onPress={handleUpdate}
                    disabled={updating}
                >
                    <Text style={styles.updateButtonText}>{updating ? "Updating..." : "Update Profile"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.logoutButton, loggingOut && { opacity: 0.7 }]}
                    onPress={handleLogout}
                    disabled={loggingOut}
                >
                    <Text style={styles.logoutButtonText}>{loggingOut ? "Logging out..." : "Log Out"}</Text>
                </TouchableOpacity>
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaffd0',
        alignItems: 'center',
        padding: 24,
        marginTop: 40,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eaffd0',
    },
    avatarContainer: {
        marginTop: 24,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 4,
        borderColor: '#b9ffb7',
        backgroundColor: '#fff',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 6,
        borderWidth: 1,
        borderColor: '#b9ffb7',
        elevation: 2,
    },
    cameraIcon: {
        width: 24,
        height: 24,
        tintColor: '#1a2e1a',
    },
    changePhotoText: {
        color: '#1a2e1a',
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    label: {
        alignSelf: 'flex-start',
        color: '#1a2e1a',
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 2,
        fontSize: 16,
    },
    value: {
        alignSelf: 'flex-start',
        color: '#1a2e1a',
        marginBottom: 8,
        fontSize: 16,
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderColor: '#b9ffb7',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 18,
        color: '#1a2e1a',
        fontSize: 16,
    },
    updateButton: {
        width: '100%',
        backgroundColor: '#1a2e1a',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#1a2e1a',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    updateButtonText: {
        color: '#b9ffb7',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    logoutButton: {
        width: '100%',
        backgroundColor: '#fff',
        borderColor: '#1a2e1a',
        borderWidth: 2,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 8,
    },
    logoutButtonText: {
        color: '#1a2e1a',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
});

export default Profile;
