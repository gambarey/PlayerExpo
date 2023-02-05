import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

const Tab = createBottomTabNavigator()

const AppNavigator = () => {
    return <Tab.Navigator>
        <Tab.Screen name='AudioList' component={AudioList} options={{
            tabBarIcon: ({ color, size }) => (
                <Entypo name="folder-music" size={size} color={color} />
            )
        }
        } />
        <Tab.Screen name='Player' component={Player} options={{
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="headphones" size={size} color={color} />
            )
        }
        } />
        <Tab.Screen name='PlayList' component={PlayList} options={{
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="playlist-music" size={size} color={color} />
            )
        }
        } />
    </Tab.Navigator>
};

//make this component available to the app
export default AppNavigator;
