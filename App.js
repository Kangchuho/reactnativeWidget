import { View, Text, Platform, TouchableOpacity, NativeModules } from 'react-native'
import React, { useEffect, useState } from 'react'
import SharedGroupPreferences from 'react-native-shared-group-preferences'

const appGroupIdentifier = "group.com.app.together"
const { RNSharedWidget } = NativeModules;

const userData = {
  c_name: 'reddok',
  c_age: 23,
  c_email: 'reddokk@gmail.com',
}

const App = () => {

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

export default App