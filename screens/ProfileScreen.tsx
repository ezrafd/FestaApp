import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, SafeAreaView, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext.tsx';
import { lightTheme, darkTheme } from '../theme/theme.ts';
import { Ionicons } from '@expo/vector-icons';
import { mockUsers } from '../data/mockData.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const defaultUser = {
  id: '1',
  username: 'currentuser',
  name: 'Current User',
  profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
  bio: 'I love coding and meeting new people!'
};

const currentUser = mockUsers.find(user => user.id === '1') || defaultUser;

type RootStackParamList = {
  Settings: undefined;
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;

  const handleEditProfile = () => {
    // In a real app, this would navigate to edit profile screen
    console.log('Navigate to edit profile');
  };

  const handleLogout = () => {
    // In a real app, this would handle logout
    console.log('Handle logout');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profilePicContainer}>
            <Image
              source={{ uri: currentUser.profilePic }}
              style={styles.profilePic}
              onError={(error) => {
                console.log('Image loading error:', error.nativeEvent);
                console.log('Failed to load image from URL:', currentUser.profilePic);
              }}
              onLoad={() => console.log('Image loaded successfully')}
            />
            <View style={[styles.profilePicFallback, { backgroundColor: colors.cardBackground }]}>
              <Ionicons name="person" size={50} color={colors.text} />
            </View>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{currentUser.name}</Text>
          <Text style={[styles.username, { color: colors.secondaryText }]}>@{currentUser.username}</Text>
          {currentUser.bio && (
            <Text style={[styles.bio, { color: colors.text }]}>{currentUser.bio}</Text>
          )}
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons 
              name={theme === 'dark' ? 'sunny' : 'moon'} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleEditProfile}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.danger }]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  profilePicContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePicFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Georgia',
  },
  username: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'Georgia',
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    fontFamily: 'Georgia',
  },
  themeToggle: {
    padding: 8,
  },
  section: {
    padding: 16,
    marginTop: 20,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
}); 