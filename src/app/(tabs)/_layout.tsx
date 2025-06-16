import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { HapticTab } from "../../components/HapticTab";

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarButton: HapticTab,
                tabBarActiveTintColor: '#2e7d32', // softer green for active
                tabBarInactiveTintColor: '#555', // darker gray for inactive
                tabBarStyle: {
                    backgroundColor: 'transparent', // transparent nav bar
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    height: 70,
                    position: 'absolute',
                    left: 10,
                    right: 10,
                    bottom: 10,
                    marginTop: 0,
                    borderTopWidth: 0,
                    shadowColor: '#b9ffb7',
                    shadowOpacity: 0.15,
                    shadowOffset: { width: 0, height: -2 },
                    shadowRadius: 8,
                    elevation: 8,
                },
                tabBarLabelStyle: {
                    fontWeight: 'bold',
                    fontSize: 13,
                    marginBottom: 6,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen name="old-index" options={{
                headerTitle: "Home",
                title: "Home",
                tabBarIcon: ({ color }) => <Ionicons name="home" size={26} color={color} />,
            }} />
            <Tabs.Screen name="profile" options={{
                headerTitle: "Profile",
                title: "Profile",
                tabBarIcon: ({ color }) => <FontAwesome5 name="user-alt" size={24} color={color} />,
            }} />
            <Tabs.Screen name="about" options={{
                headerTitle: "About",
                title: "About",
                tabBarIcon: ({ color }) => <FontAwesome6 name="circle-info" size={24} color={color} />,
            }} />
        </Tabs>
    );
}

export default TabsLayout;
