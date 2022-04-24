import React from 'react';
import {NavigationContainer, Theme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';

// Screens
import SignIn from '../screens/SignIn';
import Breeds from '../screens/Breeds';
import Breed from '../screens/Breed';

import {
  HomeTabParamList,
  RootStackParamList,
  RootStackScreenProps,
} from './types';
import {IconButton} from 'react-native-paper';
import Profile from '../screens/Profile';
export default function Navigation({theme}: {theme?: Theme}) {
  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const isSignedIn = useSelector<any>(state => state.isSignedIn);
  return (
    <Stack.Navigator>
      {!isSignedIn ? (
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />
      ) : (
        <>
          <Stack.Screen
            name="HomeTab"
            component={HomeNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Breed" component={Breed} />
        </>
      )}
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator<HomeTabParamList>();
function HomeNavigator(_: RootStackScreenProps<'HomeTab'>) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Breeds"
        component={Breeds}
        options={{
          headerShown: false,
          tabBarIcon: props => <IconButton {...props} icon={'dog'} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: props => <IconButton {...props} icon={'account'} />,
        }}
      />
    </Tab.Navigator>
  );
}
