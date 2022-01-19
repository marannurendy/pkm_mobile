import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Image, StatusBar, ToastAndroid, Dimensions, Modal, useWindowDimensions, LogBox, TextPropTypes } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo'
import { FAB } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert } from 'react-native';
import {ApiSync, Get_notification, Get_Date, ApiSyncInisiasi, ApiPkmb, ApiSyncOther} from '../../dataconfig/index'
import moment from 'moment';
import 'moment/locale/id';
import { Card, Button } from 'react-native-elements';
import RenderHtml from 'react-native-render-html'
import { scale, verticalScale } from 'react-native-size-matters'

import db from '../database/Database';
// import { Text } from 'native-base';
// import { ScrollView } from 'react-native-gesture-handler';
import { FlatList } from 'react-native';
import FrontHomeSync from './HomeSync';
const window = Dimensions.get('window');

export default function FrontHome() {
    const [cabangid, setCabangid] = useState("")
    const [namacabang, setNamacabang] = useState("")
    const [username, setUsername] = useState("")
    const [aoname, setAoname] = useState("")
    const [loading, setLoading] = useState(false)
    const [buttonstat, setButtonstat] = useState(true)
    const [buttonDis, setButtonDis] = useState(false)
    const [data, setData] = useState([])
    const [modalVisible, setModalVisible] = useState(false)

    let [isKc, setIsKc] = useState(false)
    let [isAo, setIsAo] = useState(false)
    let [isRkh, setIsRkh] = useState(false)

    const netInfo = useNetInfo()
    const apiSync = ApiSync
    const apiSyncInisiasi = ApiSyncInisiasi

    let [isSync, setIsSync] = useState(false)

    LogBox.ignoreAllLogs()

    const navigation = useNavigation()

    const pkmHandler = () => {
        navigation.navigate('Sync')
    }

    const parHandler = () => {
        // navigation.navigate('MeetingPAR', {cabangid: cabangid})
        // navigation.navigate('MeetingPAR', {cabangid: cabangid, uname: username})
        navigation.navigate('IndividualMeeting', {cabangid: cabangid, uname: username})

    }

    const itemReadyHandler = async (id, uname) => {
        console.log("shit")
        var queryCek = `SELECT * FROM GroupList WHERE OurBranchID = '` + id + `' AND syncby = '` + uname + `'`
        console.log(queryCek)
        db.transaction(
            tx => {
                tx.executeSql(queryCek, [], (tx, results) => {
                    var testLength = results.rows.length
                    // let data = results.rows.item(0)

                    console.log(results.rows.item(0))

                    // console.log("SELECT * FROM GroupList WHERE OurBranchID = '"+cabangid+"' AND syncby = '"+username+"'")
                    // console.log("testLength " + testLength)

                    if(testLength > 0) {
                        // setButtonstat(false)
                        setIsSync(true)
                        fetchData()
                    }else{
                        // setButtonstat(true)
                        setIsSync(false)
                        fetchData()
                    }
                })
            }
        )
    }

    const fetchData = () => {
        setLoading(true)
        fetch(ApiSync + Get_notification)
          .then((response) => response.json())
          .then((json) => {
            if(json.responseDescription === "success") {
                // console.log(json)
              setData(json.data)
              setModalVisible(!modalVisible)
              return false
            }else{
              setLoading(false)
            }
          })
          .catch((error) => console.error(error))
          .finally(() => {
              setLoading(false)
              return false
            });
    }

    const checkConnection = () => {
        if(netInfo.isConnected === true){
            fetchData()
            return false
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            syncData();
            // fetchData()
            // AsyncStorage.getItem('userData', (error, result) => {
            //     const dt = JSON.parse(result);
    
            //     setCabangid(dt.kodeCabang)
            //     setNamacabang(dt.namaCabang)
            //     setUsername(dt.userName)
            //     setAoname(dt.AOname)
            // })

            const roleUser = await AsyncStorage.getItem('roleUser')

            console.log(roleUser)

            if(roleUser === 'KC'){
                setIsKc(true)
            }else if(roleUser === 'AO'){
                setIsAo(true)
            }

            const syncStatus = await AsyncStorage.getItem('userData')
            
            let DetailData = JSON.parse(syncStatus)

            setCabangid(DetailData.kodeCabang)
            setNamacabang(DetailData.namaCabang)
            setUsername(DetailData.userName)
            setAoname(DetailData.AOname)

            itemReadyHandler(DetailData.kodeCabang, DetailData.userName)


        });

        

        // AsyncStorage.removeItem('SyncDate');

        // const timer = setTimeout(() => {
        //     checkConnection()
        //   }, 3600)

        return unsubscribe;
    }, []);

    const renderItem = ({ item }) => (
        <Item data={item} />    
    )

    const Item = ({ data }) => (
        <TouchableOpacity>
            <View>
                <NewsList  Id={data.Id} HeadContent={data.HeadContent} ImageUri={data.ImgUrl} MainContent={data.MainContent} />
            </View>
        </TouchableOpacity>
    )

    const NewsList = ({ Id, HeadContent, ImageUri, MainContent }) => {

        const source = {
            html: MainContent
        };

        const { width } = useWindowDimensions();

        return(
          <View>
              <Card>
                  <Card.Title style={{fontSize: 18, color: "#a2a2db", }} >{HeadContent}</Card.Title>
                  <Card.Divider />
                  <RenderHtml
                        contentWidth={width}
                        source={source}
                  />
                  
              </Card>
          </View>
        )
      }

    const ModalNotification = () => {
        return(
          <View style={{flex: 1}}>
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View>                            
                            <Image source={require('../images/notifHead.jpeg')} style={{width: window.width/1.3, height: window.height/3.5}} />
                        </View>
                        <View style={{alignItems: 'center', margin: 10, padding: 10, backgroundColor: '#b3b7fe', borderRadius: 10}}>
                            <Text style={{fontWeight: 'bold', color: '#fff'}}>Notification !</Text>
                        </View>
                        <ScrollView style={{marginVertical: 10}}>
                            {loading ? <Text>Loading...</Text> : 
                            ( <View style={{ justifyContent:  'space-between'}}>
                                <FlatList
                                    data={data}
                                    keyExtractor={(Id, index) => index.toString()}
                                    renderItem={renderItem}
                                />
                                <Button 
                                    icon={ <FontAwesome5 name="check" size={15} color="white" style={{marginHorizontal: 10}} />} 
                                    title= {"OKAY"}  
                                    buttonStyle={{margin: 10, backgroundColor: '#b3b7fe'}}
                                    onPress={() => {
                                        setModalVisible(!modalVisible)
                                        itemReadyHandler()
                                    }}
                                />
                            </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
                </View> 
        )
    }

    async function syncData() {
        moment.locale('id');
        var now = moment().format('YYYY-MM-DD');

        const syncStatus = await AsyncStorage.getItem('userData')
        let DetailData = JSON.parse(syncStatus)
        let userName = DetailData.userName

        const syncBy = await AsyncStorage.getItem('SyncBy')
        let dataRole = await JSON.parse(syncBy)
        let lengthData = 0;
        if (dataRole !== null) lengthData = dataRole.filter((x) => x.userName === userName).length || 0;

        const responseProspekMap = await AsyncStorage.getItem('ProspekMap');
        const token = await AsyncStorage.getItem('token');
        const roleUser = await AsyncStorage.getItem('roleUser');
        if (__DEV__) console.log('LogOutButton responseProspekMap:', responseProspekMap);
        if (__DEV__) console.log('ACTIONS TOKEN', token);
        if (__DEV__) console.log('ACTIONS ROLE USER', roleUser);

        AsyncStorage.getItem('SyncDate', (error, syncDate) => {
            if (syncDate !== now || lengthData === 0) {
                if (responseProspekMap && ["AO", "SAO"].includes(roleUser)) {
                    const body = {
                        "ID_Prospek": JSON.parse(responseProspekMap)
                    }
                    fetch(ApiSyncOther + 'AuthLogout', {
                        method: 'POST',
                        headers: {
                            Authorization: token,
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body)
                    })
                    .then((response) => response.json())
                    .then((responseJSON) => {
                        if (__DEV__) console.error('$post /other/AuthLogout response', body, responseJSON);
                    })
                    .catch((error) => {
                        if (__DEV__) console.log('$post /other/AuthLogout response', body, error);
                    });
                }
                setIsRkh(false);
                return;
            }

            setIsRkh(true);
        });
    }

    if (!isRkh) {
        return (
            <FrontHomeSync 
                username={username}
                cabangid={cabangid}
                // username={'AO12-90091'} /* DATA DUMMY */
                // cabangid={90091} /* DATA DUMMY */
                aoname={aoname}
                namacabang={namacabang}
                onSuccess={async () => {
                    setIsRkh(true)
                    const syncStatus = await AsyncStorage.getItem('userData')
            
                    let DetailData = JSON.parse(syncStatus)

                    setCabangid(DetailData.kodeCabang)
                    setNamacabang(DetailData.namaCabang)
                    setUsername(DetailData.userName)
                    setAoname(DetailData.AOname)

                    itemReadyHandler(DetailData.kodeCabang, DetailData.userName)
                }}
            />
        )
    }

    const renderVersion = () => (
        <View style={{ marginVertical: 8 }}>
            {/* <Text style={{ textAlign: 'center' }}>version pkm_mobile-0.0.2-002-dev @ 2021-01-19</Text> */}
            <Text style={{ textAlign: 'center' }}>version pkm_mobile-0.0.2-001-prod @ 2021-01-19</Text>
        </View>
    )

    return(
        // <View style={styles.container}>            
        <View style={{flex: 1, backgroundColor: '#0D67B2'}}>            
            {/* <ImageBackground source={require("../images/backtestMenu.png")} style={styles.image}>                 */}
            {/* <ImageBackground style={styles.image}>                 */}
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent={true} />

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

            {/* <Image source={{uri: "http://devapipkm.pnm.co.id/pkmBackofficeDev/assets/NotificationAssets/Asset1.jpeg"}}/> */}
                <View 
                    style={{
                        marginTop: scale(35),
                        paddingHorizontal: scale(15),
                        alignItems: 'flex-end'
                    }}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        {/* <View style={{ borderWidth: 2, borderRadius: 50, padding: 5, borderColor: "rgba(48,97,216,1)" }}> */}
                        <View>
                            <MaterialCommunityIcons name="menu" color={'#fff'} size={scale(25)} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{marginHorizontal: scale(15)}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold', color: '#fff'}}>Hi, {aoname}</Text>
                    <Text style={{color: '#fff'}}>{username}</Text>
                    <Text style={{color: '#fff'}}>{namacabang}</Text>
                </View>

                <View style={{flexDirection: 'row', marginHorizontal: scale(15)}}>
                    <View style={{marginTop: scale(15), flex: 4, borderRadius: scale(10), padding: scale(5), backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: scale(13), marginLeft: scale(10), fontWeight: 'bold', color: '#545851'}}>
                            STATUS
                        </Text>
                        <View style={isSync === true ? {marginLeft: scale(10), flex: 1, borderRadius: scale(10), padding: scale(5), backgroundColor: '#0CB35D'} : {marginLeft: scale(10), flex: 1, borderRadius: scale(10), padding: 5, backgroundColor: '#C73D3D'}}>
                            {isSync === true ? 
                                <Text style={{fontWeight: 'bold', textAlign: 'center', color: '#fff'}}>Berhasil Sync</Text> : 
                                <Text style={{fontWeight: 'bold', textAlign: 'center', color: '#fff'}}>Belum Sync</Text>
                            }
                        </View>
                    </View>

                    {/* <TouchableOpacity 
                        style={isSync === true ? {marginTop: scale(15), marginRight: scale(15), flex: 2, marginLeft: scale(10),borderRadius: scale(10), padding: scale(10), backgroundColor: '#CCCCC4', alignItems: 'center'} : {marginTop: scale(15), marginRight: scale(15), flex: 2, marginLeft: scale(10),borderRadius: scale(10), padding: scale(10), backgroundColor: '#0CB35D', alignItems: 'center'}}
                        // style={{marginTop: 30, marginRight: 20, flex: 2, marginLeft: 10,borderRadius: 10, padding: 10, backgroundColor: '#0CB35D', alignItems: 'center'}}
                        disabled={isSync}
                        onPress={() => syncData()}
                    >
                        <MaterialCommunityIcons name="sync" color={'#FFF'} size={30} />
                    </TouchableOpacity> */}
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, marginTop: scale(10), borderTopLeftRadius: scale(20), borderTopRightRadius: scale(20), borderBottomLeftRadius: scale(20), borderBottomRightRadius: scale(20), marginHorizontal: scale(5), backgroundColor: '#fff', marginBottom: 10}}>
                {/* <View style={{flex: 1, marginTop: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 10}}> */}
                    
                    <View style={{marginHorizontal: scale(20), marginBottom: 20, marginTop: scale(20), flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

                        {/* <Shadow></Shadow> */}

                        <TouchableOpacity disabled={isKc} style={{height: window.height/3, width: window.width/2.5, borderRadius: 20, backgroundColor: isKc === true ? '#E6E6E6' : '#fff', shadowColor: '#000',
                                shadowOffset: {
                                width: 0,
                                height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 10}} onPress={() => pkmHandler()}>
                            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                <ImageBackground resizeMode="contain"
                                    source={require("../images/PKM-2.png")}
                                    style={styles.background}
                                />
                            </View>
                        </TouchableOpacity>

                        <View style={{height: window.height/3, width: window.width/2.5, flexDirection: 'column', justifyContent: 'space-between'}}>

                            <TouchableOpacity disabled={isKc} onPress={() => navigation.navigate('IndividualCollection', {cabangid: cabangid, uname: username})} style={{height: window.height/6.5, width: window.width/2.5, borderRadius: 20, backgroundColor: isKc === true ? '#E6E6E6' : '#fff',
                                shadowColor: '#000',
                                shadowOffset: {
                                width: 0,
                                height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 10}}>
                                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                    <ImageBackground resizeMode="contain"
                                        source={require("../images/penagihan-2.png")}
                                        style={styles.background}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity disabled={isKc} style={{height: window.height/6.5, width: window.width/2.5, borderRadius: 20, backgroundColor: isKc === true ? '#E6E6E6' : '#fff',
                                shadowColor: '#000',
                                shadowOffset: {
                                width: 0,
                                height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 10}}>
                                <View style={{alignItems: 'center', justifyContent: 'center', padding: 5, flex: 1}}>
                                    <ImageBackground resizeMode="contain"
                                        source={require("../images/ludin.png")}
                                        style={styles.background}
                                    />
                                </View>
                            </TouchableOpacity>

                        </View>

                    </View>

                    <View style={{marginHorizontal: 20, marginBottom: 20, flex: 1}}>

                        <View style={{flexDirection: 'row', marginBottom: 20}}>
                            <TouchableOpacity onPress={() => navigation.navigate('Inisiasi')} style={{height: window.width/3, flex: 1, borderRadius: 20, backgroundColor: '#fff',
                                shadowColor: '#000',
                                shadowOffset: {
                                width: 0,
                                height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 10}}>
                                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                    <ImageBackground resizeMode="contain"
                                        source={require("../images/Inisiasi-2.png")}
                                        style={styles.background}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

                            <TouchableOpacity disabled={isAo} onPress={() => navigation.replace('Pencairan')} style={{height: window.height/6.5, width: window.width/2.5, borderRadius: 20, backgroundColor: isAo === true ? '#E6E6E6' : '#fff',
                                shadowColor: '#000',
                                shadowOffset: {
                                width: 0,
                                height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 10}}>
                                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                    <ImageBackground resizeMode="contain"
                                        source={require("../images/pencairan-2.png")}
                                        style={styles.background}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('UmiCornerLanding')} style={{height: window.height/6.5, width: window.width/2.5, borderRadius: 20, backgroundColor: '#fff', padding:10,
                                shadowColor: '#000',
                                shadowOffset: {
                                width: 0,
                                height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 10}}>
                                <View style={{alignItems: 'center', justifyContent: 'space-between', flex: 1}}>
                                    <ImageBackground resizeMode="contain"
                                        source={require("../images/SenyuM-2.png")}
                                        style={styles.backgroundUmi}
                                    />
                                </View>
                            </TouchableOpacity>

                        </View>

                    </View>
                    {renderVersion()}
                </ScrollView>

                {/* <View style={{margin: 20}}> */}
                    {/* <TouchableOpacity style={ styles.imageStyle } onPress={() => pkmHandler()}> */}
                    {/* <TouchableOpacity style={ styles.imageStyle }>
                        <View>
                            <Image source={require('../images/pkm.png')} style={{ width: window.width/1.5, height: window.height/5, borderRadius: 7 }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={ styles.imageStyle } onPress={() => parHandler()}>
                        <View>
                            <Image source={require('../images/pkm_individual.png')} style={{ width: window.width/1.5, height: window.height/5, borderRadius: 7 }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={ styles.imageStyle } onPress={() => navigation.navigate('UmiCornerLanding')}>
                        <View>
                            <View style={{ width: window.width/1.5, height: window.height/5, borderRadius: 7, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../images/Umi.png')} style={{width:window.width/1.5, height:window.height/14}} />
                            </View>
                        </View>
                    </TouchableOpacity> */}

                    
                {/* </View>  */}

                {/* <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center' }}>
                        <FAB
                            style={{ position: 'absolute', margin: 30, backgroundColor: '#0D67B2', borderWidth: 2, borderColor: '#fff' }}
                            large
                            icon="sync"
                            visible={buttonstat}
                            disabled={buttonDis}
                            onPress={() => syncData()}
                        />
                    </View>
                </View> */}
            {/* </ImageBackground> */}

                {loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                } 

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    bodyContainer: {
        flex: 0.7,
        justifyContent: 'space-around',
        flexDirection: 'column',
        alignItems: 'center',

    },
    menuContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    },
    imageStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
        backgroundColor: "#fff",
        borderRadius: 7
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
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
        height: window.height/1.3,
        width: window.width/1.3,
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    htmlView: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
    menuChocolate: {
        borderRadius: 20
    },
    chocoStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    background: {
        width: "100%",
        height: "100%",
    },
    backgroundUmi: {
        width: "100%",
        height: "100%",
    },
})