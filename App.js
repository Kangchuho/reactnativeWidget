import { View, Text, Platform, TouchableOpacity, NativeModules, Button, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import SharedGroupPreferences from 'react-native-shared-group-preferences'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const appGroupIdentifier = "group.com.app.together"
const { RNSharedWidget, WeatherWidgetModule } = NativeModules;

const userData = {
  c_name: 'reddok',
  c_age: 23,
  c_email: 'reddokk@gmail.com',
}

const ff = () => {

  // 이런방식의 콜?
  const refreshAllWidgets = React.useCallback(() => {
    WeatherWidgetModule.refreshAllWidgets()
  }, []);

  useEffect(() => {
    async function load() {
      if (Platform.OS == 'android') {
        await dealWithPermissions()
      } else {
        // await saveUserDataToSharedStorage(userData);
        // 이걸사용합니다.
        await RNSharedWidget.setData(
          'myAppData',
          JSON.stringify(userData),
          (_status) => {
            // log callback in case of success/error
            console.log(_status);
          }
        );
      }
    }
    load();
  },[])

  const [mydata, setMydata] = useState(userData);

  // 안드로이드 퍼미션 안내
  async function dealWithPermissions() {
    try {
      const grantedStatus = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ])
      const writeGranted = grantedStatus["android.permission.WRITE_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED
      const readGranted = grantedStatus["android.permission.READ_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED
      if (writeGranted && readGranted) {
        this.saveUserDataToSharedStorage(userData)
      } else {
      }
    } catch (err) {
      console.warn(err)
    }
  }
  // 이모듈을 사용하지 않습니다.!!!
  async function saveUserDataToSharedStorage() {
    try {
      await SharedGroupPreferences.setItem("myAppData", mydata, appGroupIdentifier)
      await loadUsernameFromSharedStorage()
    } catch(errorCode) {
      console.log(errorCode)
    }
  }

  async function loadUsernameFromSharedStorage() {
    try {
      const loadedData = await SharedGroupPreferences.getItem("myAppData", appGroupIdentifier)
      console.log('username:',loadedData.c_name);
    } catch(error) {
      console.log('error :', error)
    }
  }

  return (
    <View style={{marginTop: 200}}>
      <Text>App</Text>
      <TouchableOpacity onPress={async()=>{
        const date = new Date();
        setMydata(prev => ({
          c_name: date.toISOString(),
          c_age: 11234,
          c_email: 'reddokk@hanmail.net',
        }))
        // await saveUserDataToSharedStorage()
        // 이걸 사용합니다.
        await RNSharedWidget.setData(
          'myAppData',
          JSON.stringify(mydata),
          (_status) => {
            // log callback in case of success/error
            console.log(_status);
          }
        );
        
        }}>
        <Text>change age</Text>
      </TouchableOpacity>
    </View>
  )
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to WidgetScreen"
        onPress={() => navigation.navigate('WidgetScreen')}
      />
    </View>
  );
}

function WidgetScreen({ navigation }) {

  const [mydata, setMydata] = useState(userData);
  const refreshAllWidgets = React.useCallback(async() => {
    // WeatherWidgetModule.refreshAllWidgets()
    const date = new Date();
    setMydata({
      c_name: date.toISOString(),
      c_age: 11234,
      c_email: 'reddokk@hanmail.net',
    })
    await RNSharedWidget.setData(
      'myAppData',
      JSON.stringify(mydata),
      (_status) => {
        // log callback in case of success/error
        //console.log(_status);
      }
    );
  }, []);

  const reload = async() => {
    const date = new Date();
    setMydata({
      c_name: date.toISOString(),
      c_age: 11234,
      c_email: emailvalue,
    })
    await RNSharedWidget.setData(
      'myAppData',
      JSON.stringify(mydata),
      (_status) => {}
    );
  }

  const [emailvalue, setEmailvalue] = useState('reddokk@hanmail.net')

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput 
      value={emailvalue} onChangeText={setEmailvalue}
      className='w-full h-10 px-2 py-1 '
      />
      <Button
        title="Refresh All Widgets"
        onPress={reload}
      />
      <Button
        title="Go to Notifications"
        onPress={() => navigation.navigate('Notifications')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="WidgetScreen" component={WidgetScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer
      linking={{
        prefixes: [
          'widget-deeplink://',
        ],
        config: {
          screens: {
            WidgetScreen: 'WidgetScreen'
          },
        }
      }}>
      <MyStack />
    </NavigationContainer>
  );
}