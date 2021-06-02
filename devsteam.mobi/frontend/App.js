/**
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';

import type {Node} from 'react';
import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {store} from './store/configureStore';
import GalleryScreen from './components/GalleryScreen';
import PhotoScreen from './components/PhotoScreen';

const Stack = createStackNavigator();

const App: () => Node = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="GalleryScreen"
            component={GalleryScreen}
            options={{title: 'Галерея'}}
          />
          <Stack.Screen
            name="Photo"
            component={PhotoScreen}
            options={({route}) => ({title: route.params.photo.id})}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
