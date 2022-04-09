import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, ScrollView, ActivityIndicator, FlatList, TouchableOpacity, Image, ImageBackground, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Divider } from 'react-native-paper'
import { Get_UmiList } from '../../dataconfig'

export default function UmiList() {

    const win = Dimensions.get('window')
    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    const [url, setUrl] = useState()
    const [data, setData] = useState([])
    const [refreshing, setRefreshVal] = useState(false);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetchData()
    }, [])
    
    async function fetchData() {
        const datauser = await AsyncStorage.getItem('userData', (error, result) => {
            return JSON.parse(result);
        })

        const dt = JSON.parse(datauser)

        try{
            await fetch(Get_UmiList, {
                method: 'POST',
                headers: {
                    Accept:
                        'application/json',
                        'Content-Type': 'application/json'
                    },
                body: JSON.stringify({
                    branchid : dt.kodeCabang,
                    username: dt.userName, 
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.responseCode)

                if(responseJson.responseCode === '0200') {
                    if(responseJson.data > 0) {
                        setData(responseJson)
                    }else{
                        Alert.alert(
                            "Caution",
                            "Daftar nasabah kosong"
                        )
                    }
                }else{
                    Alert.alert(
                        "Error",
                        "Error get data",
                        [
                            { text: "OK", onPress: () => {navigation.goBack()} }
                        ],
                    )
                }
                // setUrl(responseJson.data.webviewUrl)
                setLoading(false)
            })
        }catch(error){
            console.log(error)
        }
    }

    let _onRefresh = () => {
        setRefreshVal(true)
        setTimeout(() => {
            setRefreshVal(false)
            fetchData()
        }, 3000);
    }; 

    const renderItem = ({ item }) => (
        <Item data={item} />    
    )

    const Item = ({ data }) => (
        <TouchableOpacity onPress={() => navigation.navigate("DetailUmiList", {id: data.transactionID})}>
            <View style={{ backgroundColor: '#fff', margin: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, borderWidth: 3, padding: 10, borderColor: '#5D92E1' }}>
                <ListNasabah nik={data.nik} nama={data.name} branchid={data.PickByBranchID} branch={data.PickByBranchName} transactionid={data.transactionID} status={data.StatusTransaksi} />
            </View>
        </TouchableOpacity>
    )

    const ListNasabah = ({ nik, nama, branchid, branch, transactionID, status }) => {
        return(
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center' }}>
                                        
                    <View style={{ flexDirection: 'column' }}> 
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, backgroundColor: '#5D92E1', borderRadius: 10, padding: 5 }}>
                            <MaterialCommunityIcons name="account-multiple" color={'white'} size={26} />
                            <View style={{ width: dimension.width/1.35, flexDirection: 'column' }}>
                                <Text style={ styles.groupList }>{nama}</Text>
                                <Text style={{ fontSize: 13, paddingLeft: 10, color: '#fff' }}>{nik}</Text>
                            </View> 
                        </View>

                        <Divider />

                        <View style={{ padding: 5 , paddingTop: 10}}>
                            <Text style={{ fontSize: 13, paddingLeft: 10 }}>Cabang: {branch}</Text>
                            <Text style={{ fontSize: 13, paddingLeft: 10 }}>Kode Cabang: {branchid}</Text>
                            <Text style={{ fontSize: 13, paddingLeft: 10 }}>Status Transaksi: {status}</Text>
                        </View>
                    </View>
                </View>                                            
            </View>
        )
      }

  return (
      <View style={{width: dimension.width, height: dimension.height, flex: 1}}>
        <ImageBackground source={require("../images/backtestMenu.png")} style={styles.image}>

        <View>
            <Image source={require('../images/SenyuM-2.png')} style={{width:dimension.width/3, height:dimension.height/14, margin: 10}} resizeMode= 'contain' />
        </View>

        <View style={{alignItems: 'center', marginTop: 5}}>
            <View style={{paddingHorizontal: 70, paddingVertical: 5, borderRadius: 20, backgroundColor: '#FF7700'}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>DAFTAR NASABAH</Text>
            </View>
            
        </View>

        <SafeAreaView style={{flex: 1}}>
            {isLoading ? <Text>Loading...</Text> : 
                ( <View style={{ justifyContent:  'space-between'}}>
                    <FlatList
                        contentContainerStyle={styles.listStyle}
                        refreshing={refreshing}
                        onRefresh={() => _onRefresh()}
                        data={data.data}
                        keyExtractor={(item, index) => index.toString()}
                        enabledGestureInteraction={true}
                        onEndReachedThreshold={0.1}
                        // onEndReached={() => handleEndReach()}
                        renderItem={renderItem}

                    /> 
                </View>
                )
            }
        </SafeAreaView >

            {/* {loading &&
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            }  */}
        </ImageBackground>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMenu: {
    alignItems: "center",
    justifyContent: "center",
    height: 66,
    width: 66,
    borderRadius: 50,
    backgroundColor: "#fff200",
  },
  rightlogoMenu: {
    alignItems: "center",
    justifyContent: "center",
    height: 66,
    width: 66,
    borderRadius: 50,
    backgroundColor: "#bb32fe",
    marginLeft: 22,
  },
  menuContainer: {
    alignItems: 'center',
    width: 150
  },
  formBring: {
    paddingBottom: 10
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#545454',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
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
listStyle: {
    margin: 5
},
groupList: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10,
    flexWrap: 'wrap',
    flex: 3,
    color: '#fff'
},
})
