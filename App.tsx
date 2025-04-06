import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Enable react-native-screens
enableScreens();

// Types
export type RootStackParamList = {
  Tabs: undefined;
  CreateEvent: undefined;
  Chat: {
    chatId: string;
    chatGroup: {
      name: string;
    };
  };
  ChatDetail: undefined;
};

type TabParamList = {
  Festas: undefined;
  Explore: undefined;
  Chats: undefined;
  Profile: undefined;
};

// Context and Theme
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { lightTheme, darkTheme } from './theme/theme.ts';
import { EventProvider } from './context/EventContext.tsx';

// Data
import { mockChats, mockNotifications } from './data/mockData.ts';

// Screens
import { FestasScreen } from './screens/FestasScreen.tsx';
import { ChatsScreen } from './screens/ChatsScreen.tsx';
import ProfileScreen from './screens/ProfileScreen.tsx';
import { ChatDetailScreen } from './screens/ChatDetailScreen.tsx';
import { CreateEventScreen } from './screens/CreateEventScreen.tsx';
import { NotificationsScreen } from './screens/NotificationsScreen.tsx';
import { ExploreScreen } from './screens/ExploreScreen.tsx';
import { ChatScreen } from './screens/ChatScreen.tsx';
import { FestaLogo } from './components/FestaLogo.tsx';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: BottomTabNavigationProp<TabParamList>['route'] }) => ({
        tabBarIcon: ({ focused, color, size }: {
          focused: boolean;
          color: string;
          size: number;
        }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'calendar-outline';

          if (route.name === 'Festas') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: 'Georgia',
        },
        headerTitleStyle: {
          fontFamily: 'Georgia',
          color: colors.text,
        },
        headerStyle: {
          backgroundColor: colors.cardBackground,
          height: 140,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTitleContainerStyle: {
          paddingVertical: 20,
        },
        headerTitle: () => <FestaLogo width={100} height={73} />,
      })}
    >
      <Tab.Screen name="Festas" component={FestasScreen} />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{
          title: 'Explore'
        }}
      />
      <Tab.Screen 
        name="Chats" 
        component={ChatsScreen}
        options={({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) => ({
          headerRight: () => {
            const unreadCount = mockNotifications.filter(n => !n.read).length;
            return (
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate('Notifications')}
              >
                <View>
                  <Ionicons name="notifications-outline" size={24} color={colors.text} />
                  {unreadCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }
        })}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;

  const navigationTheme = {
    ...(theme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.cardBackground,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: "Back",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.cardBackground,
          },
          headerTintColor: colors.text,
          headerBackTitleStyle: {
            fontFamily: 'Georgia',
            color: colors.text,
          },
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateEvent"
          component={CreateEventScreen}
          options={{
            headerTitle: () => <FestaLogo width={100} height={73} />,
            headerStyle: {
              backgroundColor: colors.background,
              height: 140,
            },
            headerTitleContainerStyle: {
              paddingVertical: 20,
            },
            headerTintColor: colors.text,
            headerBackTitleStyle: {
              fontFamily: 'Georgia',
            },
            headerLeftContainerStyle: {
              paddingBottom: 10,
            },
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            headerTitle: () => <FestaLogo width={100} height={73} />,
            headerStyle: {
              backgroundColor: colors.background,
              height: 140,
            },
            headerTitleContainerStyle: {
              paddingVertical: 20,
            },
            headerTintColor: colors.text,
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }: NativeStackScreenProps<RootStackParamList, 'Chat'>) => ({
            title: route.params.chatGroup.name || 'Chat',
            headerBackTitle: 'Back',
          })}
        />
        <Stack.Screen
          name="ChatDetail"
          component={ChatDetailScreen}
          options={{
            headerTitle: () => <FestaLogo width={100} height={73} />,
            headerStyle: {
              backgroundColor: colors.background,
              height: 140,
            },
            headerTitleContainerStyle: {
              paddingVertical: 20,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#FF3B30',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
  },
});

export default function App() {
  return (
    <ThemeProvider>
      <EventProvider>
        <AppContent />
      </EventProvider>
    </ThemeProvider>
  );
}
