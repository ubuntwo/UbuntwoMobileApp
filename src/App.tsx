import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useState, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import {
  ChatScreen,
  LoginScreen,
  RegisterScreen,
  RoomsScreen,
  UsersScreen,
} from './screens'
import {
  AuthStackParamList,
  MainStackParamList,
  RootStackParamList,
  UsersStackParamList,
} from './types'

const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const MainStack = createNativeStackNavigator<MainStackParamList>()
const RootStack = createNativeStackNavigator<RootStackParamList>()
const UsersStack = createNativeStackNavigator<UsersStackParamList>()

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name='Login' component={LoginScreen} />
      <AuthStack.Screen name='Register' component={RegisterScreen} />
    </AuthStack.Navigator>
  )
}

const MainStackNavigator = () => {
  return (
    <MainStack.Navigator initialRouteName='Rooms'>
      <MainStack.Screen name='Chat' component={ChatScreen} />
      <MainStack.Screen name='Rooms' component={RoomsScreen} />
    </MainStack.Navigator>
  )
}

const UsersStackNavigator = () => {
  return (
    <UsersStack.Navigator>
      <UsersStack.Screen name='Users' component={UsersScreen} />
    </UsersStack.Navigator>
  )
}

const Stack = createNativeStackNavigator();

// Note that an async function or a function that returns a Promise
// is required for both subscribers.
async function onMessageReceived(message) {
    // Do something
    console.log('Notification caused app to open from background state:>>>>', message);
}


const App = () => {
    //const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState('Home');
    messaging().registerDeviceForRemoteMessages().then(x => {
        messaging().getToken().then(token => {
            console.log('>>>>Token', token);x
        });
    });
    messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);



    useEffect(()=> {

        messaging().onMessage(onMessageReceived);
        messaging().setBackgroundMessageHandler(onMessageReceived);

        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from background state:',
                remoteMessage.notification,
            );
           // navigation.navigate(remoteMessage.data.type);
        });

        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );
                   // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
                }
                setLoading(false);
            });


    },[])

    return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName='Main'
        screenOptions={{ headerShown: false }}>
        <RootStack.Screen
          name='Auth'
          component={AuthStackNavigator}
          options={{ presentation: 'modal' }}
        />
        <RootStack.Screen name='Main' component={MainStackNavigator} />
        <RootStack.Screen
          name='UsersStack'
          component={UsersStackNavigator}
          options={{ presentation: 'modal' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default App
