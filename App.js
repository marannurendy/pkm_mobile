import React, { useEffect, useState } from 'react'
import AppNavigator from './src/navigations/Navigator'
import { View, Modal, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Meetingnew from './src/screens/MeetingNew'
import FlashMessage from "react-native-flash-message";
import NetInfo, { useNetInfo } from '@react-native-community/netinfo'
import { ApiSync, Get_notification } from './dataconfig/index'
// import SQLite from 'react-native-sqlite-storage';
import { useKeepAwake } from 'expo-keep-awake';

// if(__DEV__) {
//     import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
// }

export default function App() {
    useKeepAwake();
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const netInfo = useNetInfo()
  

  var pkg = require('./package.json')

//   useEffect(() => {
//         SQLite.deleteDatabase('db.db')
//   }, [])

//   const cekNotification = () => {
//       const fetchData = () => {
//         setLoading(true)
//         fetch(ApiSync + Get_notification)
//           .then((response) => response.json())
//           .then((json) => {
//             if(json.responseDescription === "success") {
//               setData(json.data)
//               setModalVisible(!modalVisible)
//             }else{
//               setLoading(false)
//               return false
//             }
//           })
//           .catch((error) => console.error(error))
//           .finally(() => setLoading(false));
//       }

//       if(netInfo.isConnected === true){
//         fetchData()
//       }
//   }

  const ModalNotification = () => {
    return(
      <View style={{flex: 1}}>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{flexDirection: 'row', backgroundColor: '#0D67B2', alignItems: 'center'}}>
                        <View style={{alignItems: 'center', flex: 1,backgroundColor: '#0D67B2', padding: 10, flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => {setModalVisible(!modalVisible)}}>
                                <Icon name="arrow-left" size={15} color="white" style={{margin: 10}} />
                            </TouchableOpacity>
                            <View style={{alignSelf: 'center', marginHorizontal: 20}}>
                                <Text style={{fontWeight: 'bold', fontSize: 18, color: '#fff'}}>Tanda Tangan Ketua Kelompok</Text>
                            </View>
                            
                        </View>
                    </View>
                </View>
            </View>
            </View> 
    )
  }

    return(
        <View style={{flex: 1}}>
            {/* <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                {ModalNotification()}
            </Modal> */}

            <AppNavigator/>
            <FlashMessage position="top" />
            {loading &&
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            } 
        </View>
        // <Meetingnew />
        // <SplashScreen />
    );
}

const styles = StyleSheet.create({
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        // height: window.height
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        // alignItems: "center",
        shadowColor: "#000",
        height: window.height,
        width: window.width,
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
})