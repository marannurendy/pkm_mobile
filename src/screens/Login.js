import React, { useEffect, useState } from 'react';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, ImageBackground, TextInput, StyleSheet, StatusBar, ToastAndroid, Dimensions, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import base64 from 'react-native-base64';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import {ApiSync, VERSION} from "../../dataconfig/index";
import NetInfo, { useNetInfo } from '@react-native-community/netinfo'
import { showMessage } from "react-native-flash-message"

const window = Dimensions.get('window')

export default function Login() {
  const [uname, setUname] = useState("")
  const [passwd, setPasswd] = useState("")
  const [secure, setSecure] = useState(true)
  const [loading, setLoading] = useState(false)
  const loginApi = ApiSync

  const netInfo = useNetInfo();

  const navigation = useNavigation();

  const onReloadReset = () => {
    textInput.clear()
    setPasswd("")
  }

  useEffect(() => {
    // console.log(netInfo.isConnected)
    const unsubscribe = navigation.addListener('focus', () => {
      onReloadReset()
    });

    AsyncStorage.getItem('userData', (error, result) => {
      const dt = JSON.parse(result);

      if(dt != null) {
        navigation.navigate('FrontHome')
      }else{
        navigation.navigate('Login')
      }
            
    })
    return unsubscribe;
  })

  const flashNotification = (title, message, backgroundColor, color) => {
    showMessage({
        message: title,
        description: message,
        type: "info",
        duration: 3500,
        statusBarHeight: 20,
        backgroundColor: backgroundColor,
        color: color
    });
  }


  const onPressHandler = () => {
    setLoading(true)

    if(uname == "") {
      // ToastAndroid.show('Masukkan username', ToastAndroid.SHORT);
      flashNotification("Alert", "Silahkan masukkan Username anda", "#ff6347", "#fff")
      setLoading(false)
    }else{
      if(passwd == "" && uname != "") {
        flashNotification("Alert", "Silahkan masukkan Password anda", "#ff6347", "#fff")
        setLoading(false)
      }else{

          if(netInfo.isConnected === false) {
              flashNotification("Network Error", "Pastikan anda terhubung dengan internet", "#ff6347", "#fff")
              setLoading(false)
          }else if(netInfo.isConnected === true) {
            console.log(loginApi + "AuthLogin");
            const uri = loginApi + "AuthLogin";
            const body = {
              username: uname,
              password: passwd,
              apk_version: VERSION
            };
              fetch(uri, {
                  method: 'POST',
                  headers: {
                      'Accept' : 'application/json',
                      'Content-Type' : 'application/json',     
                  },
                  body: JSON.stringify(body)
              })
              .then((response) => response.json())
              .then((responseJson) => {

                console.log(responseJson)
                  if(responseJson.status === "200") {
                    console.log("disini")
                    console.log(responseJson.data.jabatan)
                    flashNotification("Sukses!", 'Pesan : '+responseJson.message, "#1F8327", "#fff")
                      let data = {
                          kodeCabang: responseJson.data.unitKerja,
                          nip: responseJson.data.nip,
                          namaCabang: responseJson.data.branchName,
                          userName: responseJson.data.userName,
                          password: responseJson.data.password,
                          AOname: responseJson.data.nama,
                          noVirtualAccount: responseJson?.data?.vaNumber ?? null
                      }

                      AsyncStorage.setItem('token', responseJson.token).then((response) => {
                        console.log('AsyncStorage.setItem.token success:', responseJson.token)
                      });
                      
                      if(responseJson.data.jabatan === 'Kepala Cabang Mekaar' || responseJson.data.jabatan === 'Pj Kepala Cabang Mekaar') {
                        AsyncStorage.setItem('roleUser', 'KC') 
                        // AsyncStorage.setItem('SyncBy', JSON.stringify(dataLogin)) 
                        setLoading(false)
                        AsyncStorage.setItem('userData', JSON.stringify(data))
                        navigation.replace('FrontHome')
                      }else if(responseJson.data.jabatan === 'Senior Account Officer'){
                        AsyncStorage.setItem('roleUser', 'SAO')
                        // AsyncStorage.setItem('SyncBy', JSON.stringify(dataLogin)) 
                        setLoading(false)
                        AsyncStorage.setItem('userData', JSON.stringify(data))
                        navigation.replace('FrontHome')
                      }else if(responseJson.data.jabatan === 'Account Officer'){
                        AsyncStorage.setItem('roleUser', 'AO')
                        // AsyncStorage.setItem('SyncBy', JSON.stringify(dataLogin)) 
                        setLoading(false)
                        AsyncStorage.setItem('userData', JSON.stringify(data))
                        navigation.replace('FrontHome')
                      }else{
                        flashNotification("Alert", 'Gagal Login : Jabatan anda tidak memiliki akses', "#ff6347", "#fff")
                        setLoading(false) 
                      }
            
                  }else{
                      flashNotification("Alert", 'Gagal Login : '+responseJson.message, "#ff6347", "#fff")
                      setLoading(false)
                  }
              })
              .then(() => {
                console.log("this")
              })
              .catch((error) => {
                  flashNotification("Alert", 'Error : '+error, "#ff6347", "#fff")
                  console.log(error)
                  setLoading(false)
                  return false;
              })
          }
      }   
    }
  }

  const renderVersion = () => (
      <View style={{ marginVertical: 32 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{`version pkm_mobile-${VERSION}`}</Text>
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }} onPress={() => navigation.navigate('NetworkLogging')}>Network Logger</Text>
      </View>
  )

      return (
        <View>
        <ImageBackground
          source={require("../images/LoginUtama.png")}
          style={styles.background}
        >
          <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent={true} />

  
          <View style={styles.inputFlex}>
          {/* <Text>Type: {netInfo.type}</Text> */}
          {/* <Text>Is Connected? {netInfo.isConnected.toString()}</Text> */}
            <View style={styles.SectionStyle}>
              <TextInput 
                ref={input => { textInput = input }}
                placeholder="Username"
                placeholderTextColor="black" 
                style={styles.inputUsername}
                onChangeText={
                  (text) => setUname(text)
                }
              />
              <MaterialCommunityIcons
                style={{ alignSelf: 'center' }}
                name={"face-woman"}
                size={30} color='black'
              />
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                ref={input => { textInput = input }}
                placeholder="Password"
                placeholderTextColor="black"
                style={styles.inputPassword}
                secureTextEntry={secure}
                onChangeText={
                  (text) => setPasswd(text)
                }
              />
              <MaterialCommunityIcons
                style={{ alignSelf: 'center' }}
                name={secure == true ? "eye-outline" : 'eye-off-outline'}
                size={30} color='black'
                onPress={() => setSecure(secure == true ? false : true)}
              />
            </View>

            <View>
              <TouchableOpacity
              style={styles.loginButtonContainer} 
              // onPress={() => this.props.navigation.navigate('Home')}
              onPress={() => onPressHandler()}
              >
                  <Text style={styles.loginButtonText}>
                      LOGIN
                  </Text>
              </TouchableOpacity>

              {renderVersion()}
            </View>
          </View>

          {loading &&
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#00ff00" />
            </View>
          } 
        </ImageBackground>
        </View>
      );
  }
  
  const styles = StyleSheet.create({
    background: {
      width: "100%",
      height: "100%"
    },
    logostyle: {
      height: 85,
      width: 280,
    },
    container: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 80,
    },
    inputFlex: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 5,
      flex: 1,
      flexDirection: 'column',
      top: window.height/10
    },
    inputUsername: {
      paddingHorizontal: 20,
      fontSize: 15,
      color: "black",
      fontWeight: 'bold',
      width: window.width/1.7,
    },
    inputPassword: {
      paddingHorizontal: 20,
      fontSize: 15,
      color: "black",
      fontWeight: 'bold',
      width: window.width/1.7,
    },
    userIcon: {
      height: 50,
      width: 50,
    },
    SectionStyle: {
      flexDirection: 'row',
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 20,
      height: 50,
      margin: 10,
      width: 300,
      justifyContent: 'space-evenly'
    },
    loginButtonContainer: {
      elevation: 8,
      borderColor: "#166cf5",
      borderRadius: 20,
      backgroundColor: "#166cf5",
      paddingVertical: 7,
      paddingHorizontal: 35,
    },
    loginButtonText: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase",
    },
    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      opacity: 0.7,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center'
    },
  })