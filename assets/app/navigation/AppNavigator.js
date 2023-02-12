import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import PlayListDetail from '../screens/PlayListDetail';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlayListScreen = () => {
  return <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='PlayList' component={PlayList} />
    <Stack.Screen name='PlayListDetail' component={PlayListDetail} />
  </Stack.Navigator>
}

const AppNavigator = () => {
  return <Tab.Navigator>
    <Tab.Screen
      name='AudioList'
      component={AudioList}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Entypo
            name="folder-music"
            size={size}
            color={color} />
        )
      }
      } />
    <Tab.Screen
      name='Player'
      component={Player}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="headphones"
            size={size}
            color={color} />
        ),
      }
      } />
    <Tab.Screen
      name='PlayList'
      component={PlayListScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="playlist-music"
            size={size}
            color={color} />
        ),
      }
      } />
  </Tab.Navigator>
};

//make this component available to the app
export default AppNavigator;
