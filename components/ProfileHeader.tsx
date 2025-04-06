import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext.tsx';
import { lightTheme, darkTheme } from '../theme/theme.ts';

interface ProfileHeaderProps {
  user: {
    id: string;
    username: string;
    name: string;
    profilePic: string;
    bio?: string;
  };
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <Image source={{ uri: user.profilePic }} style={styles.profileImage} />
      <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
      <Text style={[styles.username, { color: colors.secondaryText }]}>@{user.username}</Text>
      {user.bio && (
        <Text style={[styles.bio, { color: colors.text }]}>{user.bio}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Georgia',
  },
  username: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Georgia',
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Georgia',
  },
}); 