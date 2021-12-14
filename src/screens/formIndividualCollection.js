import React, { createRef, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, ScrollView, Alert, ToastAndroid, PermissionsAndroid, Modal, Pressable, ActivityIndicator, ImageBackground, KeyboardAvoidingView} from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import CurrencyInput from 'react-native-currency-input';
import SignatureCapture from 'react-native-signature-capture';
// import { Select } from 'native-base';
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/id';
// import Geolocation from '@react-native-community/geolocation';
import BottomSheet from 'reanimated-bottom-sheet';
import db from '../database/Database';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import SignatureScreen from "react-native-signature-canvas";
import { showMessage } from "react-native-flash-message"
import NetInfo, { useNetInfo } from '@react-native-community/netinfo'
import { DefaultTheme } from 'react-native-paper';
import { style } from 'styled-system';
// import { KeyboardAvoidingView } from 'native-base';

const window = Dimensions.get('window');

export default function FormIndividualCollection({route}) {
    const [angsuran, setAngsuran] = useState()
    const [setoran, setSetoran] = useState()
    const [tarikan, setTarikan] = useState()
    const [ketuaKelompok, setKetuaKelompok] = useState()
    const [branchID, setBranchid] = useState()
    const [namaCabang, setNamaCabang] = useState()
    const [Username, setUsername] = useState()
    const [AOname, setAoName] = useState()
    const [titipan, setTitipan] = useState()
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisibleAO, setModalVisibleAO] = useState(false)
    const [signatureKetua, setSignatureKetua] = useState()
    const [signatureAO, setSignatureAO] = useState()
    const [longitude, setLongitude] = useState()
    const [latitude, setLatitude] = useState()
    const [loading, setLoading] = useState(false)

    let [totaldetail, setTotaldetail] = useState()
    let [totalAngsuran, setTotalAngsuran] = useState()
    let [totalSetoran, setTotalSetoran] = useState()
    let [totalTitipan, setTotalTitipan] = useState()

    let [groupDetail, setGroupDetail] = useState()
    let [groupID, setGroupID] = useState()
    let [meetingDay, setMeetingDay] = useState()
    let [meetingTime, setMeetingTime] = useState()

    let [clientDetail, setClientDetail] = useState()

    let [memberList, setMemberList] = useState([])

    let [currentDate, setCurrentDate] = useState()

    let [isLoaded, setLoaded] = useState(false)

    const { clientid, groupid } = route.params;
    const netInfo = useNetInfo()
    const btmsheet = createRef()
    const btmsheets = btmsheet.current

    const dimension = Dimensions.get('window');


    const navigation = useNavigation()

    useEffect(() => {
        setLoading(true)
        getData()
    }, [])

    const getData = async () => {

        var query = `SELECT * FROM PAR_AccountList WHERE ClientID = '` + clientid + `'`
        var detQuery = `SELECT DISTINCT * FROM GroupList WHERE GroupID = '` + groupid + `'`

        const GetGroupDetail = (detQuery) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(detQuery, [], (tx, results) => {
                            resolve (results.rows.item(0))
                        })
                    },function(error) {
                        reject(error)
                    }
                )
            } catch( error ) {
                reject(error)
            }
        }))

        const GetClientDetail = (query) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(query, [], (tx, results) => {
                            resolve (results.rows.item(0))
                        })
                    },function(error) {
                        reject(error)
                    }
                )
            } catch( error ) {
                reject(error)
            }
        }))

        const GroupDetail = await GetGroupDetail(detQuery)
        const ClientDetail = await GetClientDetail(query)

        const tanggal = await AsyncStorage.getItem('TransactionDate')

        setGroupDetail(GroupDetail)
        setClientDetail(ClientDetail)
        setCurrentDate(tanggal)
        setAngsuran(ClientDetail.ODAmount)

        AsyncStorage.getItem('userData', (error, result) => {
            const data = JSON.parse(result);
            setBranchid(data.kodeCabang)
            setNamaCabang(data.namaCabang)
            setUsername(data.userName)
            setAoName(data.AOname)
        })

        setLoaded(true)
        setLoading(false)
    }

    const flashNotification = (title, message, backgroundColor, color) => {
        showMessage({
            message: title,
            description: message,
            type: "info",
            duration: 4500,
            statusBarHeight: 20,
            backgroundColor: backgroundColor,
            color: color,
            titleStyle: {fontWeight: 'bold', fontSize: 20}
        });
      }

    const renderContent = () => (
        <KeyboardAvoidingView enabled={true} style={{ backgroundColor: '#CCCCC4', padding: 16, height: 450,}}>
            {/* <View style={{borderTopWidth: 4, marginBottom: 5, width: 50, borderRadius: 50, alignSelf: 'center', borderColor: '#51534E'}} /> */}
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={() => submitHandler()} style={{ paddingHorizontal: 35, paddingVertical: 5, borderRadius: 10, backgroundColor: '#08847C' }}>
                    <Text style={{ fontSize: 20, color: '#FFF', fontWeight: 'bold' }}>SUBMIT</Text>
                </TouchableOpacity>
            </View>

            <View style={{marginTop: 50 }}>
                <Text style={{color: '#51534E', fontSize: 15, marginBottom: 10, fontWeight: 'bold'}}>Ringkasan Transaksi</Text>
                <View style={{borderWidth: 1.5, borderColor: '#fff', borderRadius: 10}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10, backgroundColor: '#fff', paddingLeft: 10, borderRadius: 10}}>
                        <Text style={{ color: 'black', fontSize: 16, padding: 5, flex: 2, fontWeight: 'bold' }}>Total Setoran :</Text>
                        <CurrencyInput
                            value={totalSetoran}
                            prefix="Rp "
                            delimiter=","
                            separator="."
                            precision={0}
                            editable= {false}
                            style={{
                                color: 'black',
                                fontSize: 16,
                                flex: 4
                            }}
                        />
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10, backgroundColor: '#fff', paddingLeft: 10, borderRadius: 10}}>
                        <Text style={{ color: 'black', fontSize: 16, padding: 5, flex: 2, fontWeight: 'bold' }}>Total Angsuran :</Text>
                        <CurrencyInput
                            value={totalAngsuran}
                            prefix="Rp "
                            delimiter=","
                            separator="."
                            precision={0}
                            editable= {false}
                            style={{
                                color: 'black',
                                fontSize: 16,
                                flex: 4
                            }}
                        />
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10, backgroundColor: '#fff', paddingLeft: 10, borderRadius: 10}}>
                        <Text style={{ color: 'black', fontSize: 16, padding: 5, flex: 2, fontWeight: 'bold' }}>Total Titipan :</Text>
                        <CurrencyInput
                            value={totalTitipan}
                            prefix="Rp "
                            delimiter=","
                            separator="."
                            precision={0}
                            editable= {false}
                            style={{
                                color: 'black',
                                fontSize: 16,
                                flex: 4
                            }}
                        />
                    </View>
                </View>
            </View>
            
        </KeyboardAvoidingView>
      );
    
    const submitHandler = () => {

        let queryUpdate = `UPDATE PAR_AccountList SET 
            jumlahbayar = '` + angsuran + `', 
            status = '` + 1 + `',
            AoSign = '` + signatureAO + `',
            NasabahSign = '` + signatureKetua + `'
            WHERE ClientID = '` + clientid + `'`

        if(angsuran === undefined || angsuran === null || angsuran === 0) {
            flashNotification("Form Invalid", "Transaksi belum diisi", "#ff6347", "#fff")
        }else if(signatureKetua === undefined || signatureKetua === null || signatureKetua === 0) {
            flashNotification("Form Invalid", "Nasabah belum melakukan tanda tangan", "#ff6347", "#fff")
        }else if(signatureAO === undefined || signatureAO === null || signatureAO === 0) {
            flashNotification("Form Invalid", "Account Officer belum melakukan tanda tangan", "#ff6347", "#fff")
        }else{
            Alert.alert(
                "Caution !",
                "Apakah anda yakin menyetujui transaksi ini ?",
                [
                    {
                        text: "Batal",
                    },
                    {
                        text: "Setuju",
                        onPress: () => {
                            db.transaction(
                                tx => {
                                    tx.executeSql(queryUpdate)
                                }, function(error) {
                                    console.log(error)
                                }, function() {
                                    Alert.alert(
                                        "Berhasil !",
                                        "Transaksi berhasil di lakukan",
                                        [
                                            {
                                                text: "Ok",
                                                onPress: () => {
                                                    navigation.goBack()
                                                }
                                            }
                                        ]
                                    )
                                }
                            )
                        }
                    },
                ]
            )
        }
    }
    
    function ModalSign(text, onOK){

        const ref = useRef();

        const handleOK = (signature) => {
            setSignatureKetua(signature)
            setModalVisible(!modalVisible);
        }

        const handleEmpty = () => {
            alert("Silahkan isi Tandatangan terlebih dahulu")
        };

        const handleClear = () => {
            console.log("clear success!");
        };

        const backButton = () => {
            console.log("crap")
            setModalVisible(!modalVisible)
        }

        return(
            <View style={{flex: 1}}>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={() => {setModalVisible(!modalVisible)}} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, alignSelf: 'flex-start', margin: 20}}>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                        <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>PKM Signature</Text>
                    </TouchableOpacity>
                    <Text style={{ alignSelf: 'center', margin: 20, fontSize: 18, fontWeight: 'bold' }}>Tanda Tangan Nasabah</Text>
                    <SignatureScreen
                        ref={ref}
                        onOK={handleOK}
                        onEmpty={handleEmpty}
                        onClear={handleClear}
                        descriptionText={text}
                    />
                </View>
            </View>
            </View>            
        )
    }

    function ModalSignAO(text, onOK){

        const ref = useRef();

        const handleOK = (signature) => {
            setSignatureAO(signature)
            setModalVisibleAO(!modalVisibleAO);
        }

        const handleEmpty = () => {
            alert("Silahkan isi Tandatangan terlebih dahulu")
        };

        const handleClear = () => {
            console.log("clear success!");
        };

        // const handleEnd = () => {
        //     ref.current.readSignature();
        // };

        return(
            <View style={{flex: 1}}>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, alignSelf: 'flex-start', margin: 20}}>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                            <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>PKM Signature</Text>
                        </TouchableOpacity>
                        <Text style={{ alignSelf: 'center', margin: 20, fontSize: 18, fontWeight: 'bold' }}>Tanda Tangan Account Officer</Text>
                    <SignatureScreen
                        ref={ref}
                        onOK={handleOK}
                        onEmpty={handleEmpty}
                        onClear={handleClear}
                        descriptionText={text}
                    />
                </View>
            </View>
            </View>            
        )
    }

    return(
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                {ModalSign()}
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleAO}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleAO(!modalVisibleAO);
                }}
            >
                {ModalSignAO()}
            </Modal>

            <View
            style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 40,
                alignItems: "center",
                paddingHorizontal: 20,
            }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>Form Penagihan</Text>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 20, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../assets/Image/Banner.png")} blurRadius={1} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                    {isLoaded ? 
                        <View>
                            <Text numberOfLines={2} style={{marginHorizontal: 35, fontSize: 25, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{groupDetail.GroupName}</Text>
                            <Text style={{marginHorizontal: 35, fontSize: 15, fontWeight: 'bold', color: '#FFF'}}>{groupDetail.OurBranchID} - {groupDetail.GroupID}</Text>
                            <View style={{flexDirection: 'row', width: dimension.width/2.5, marginHorizontal: 35, marginTop: 10, borderRadius: 5, backgroundColor: '#FAFAF8', padding: 5}}>
                                <FontAwesome5 name="calendar-alt" size={15} color="#2e2e2e" style={{marginRight: 10}} />
                                <Text style={{fontWeight: 'bold', marginRight: 10}}>{currentDate}</Text>
                                <Text style={{fontWeight: 'bold'}}>{moment().format('LT')}</Text>
                            </View>
                        </View>
                    :
                        <View style={{alignItems: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FFF'}}>Mohon Tunggu...</Text>
                        </View>
                    }
                </ImageBackground>
            </View>

            <ScrollView style={{marginTop: 20, marginHorizontal: 10}} contentContainerStyle={{paddingBottom: 50}}>
                <Card>
                    <Card.Title>
                            <Text style={{fontSize: 18}}>Form Tanda Tangan Penagihan</Text>
                    </Card.Title>

                    <Card.Divider />
                    <View style={{ marginBottom: 20 }}>
                        {isLoaded ?
                            <View>
                                <View style={{ flexDirection: 'row', borderWidth: 1, justifyContent: 'space-between', padding: 5, alignItems: 'center', borderRadius: 10 }}>
                                    <Text style={{ flex: 2 }}>Nama Nasabaha</Text>
                                    <Text numberOfLines={1} style={{ flex: 4 }}>{clientDetail.ClientName}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', borderWidth: 1, justifyContent: 'space-between', padding: 5, alignItems: 'center', marginVertical: 10, borderRadius: 10 }}>
                                    <Text style={{ flex: 2 }}>Id Nasabah</Text>
                                    <Text style={{ flex: 4 }}>{clientDetail.ClientID}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', borderWidth: 1, justifyContent: 'space-between', padding: 5, alignItems: 'center', borderRadius: 10 }}>
                                    <Text style={{ flex: 2 }}>Jumlah Angsuran</Text>
                                    <CurrencyInput
                                        value={clientDetail.ODAmount}
                                        prefix="Rp "
                                        delimiter=","
                                        separator="."
                                        precision={0}
                                        editable= {false}
                                        style={{
                                            color: 'black',
                                            fontSize: 16,
                                            flex: 4
                                        }}
                                    />
                                </View>
                            </View>
                        :
                            <View style={{alignItems: 'center'}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#2e2e2e'}}>Mohon Tunggu...</Text>
                            </View>
                        }
                    </View>

                    <Card.Divider />

                        <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ flex: 3, fontSize: 17, fontWeight: 'bold' }}>Angsuran</Text>
                            <CurrencyInput
                                onChangeValue={(text) => setAngsuran(text)}
                                onTouchStart={() => console.log()}
                                value={angsuran}
                                prefix="Rp "
                                delimiter=","
                                separator="."
                                precision={0}
                                editable= {true}
                                style={{
                                    color: 'black',
                                    fontSize: 16,
                                    flex: 4,
                                    borderWidth: 1,
                                    padding: 5,
                                    borderRadius: 10,
                                    paddingHorizontal: 10
                                }}
                            />
                        </View>

                    <Card.Divider />

                    <View style={{marginBottom: 10}}>
                        <Text style={{ fontWeight: 'bold' }}>Tanda Tangan Nasabah</Text>
                        <View style={{borderWidth: 1, marginVertical: 5, borderRadius: 10}}>
                            <Button 
                                icon={ <FontAwesome5 name="signature" size={15} color="white" style={{marginHorizontal: 10}} />} 
                                title= {signatureKetua === undefined ? "Add Signature" : "Change Signature" }  
                                buttonStyle={{margin: 10, backgroundColor: signatureKetua === undefined ? '#2196F3' : '#ff6347'}}
                                onPress={() => setModalVisible(!modalVisible)}
                            />
                            <Card.Image source={{uri: signatureKetua}} style={{margin: 10}} />
                        </View>
                    </View>

                    <View style={{marginBottom: 10}}>
                        <Text style={{ fontWeight: 'bold' }}>Tanda Tangan Account Officer</Text>
                        <View style={{borderWidth: 1, marginVertical: 5, borderRadius: 10}}>
                            <Button 
                                icon={ <FontAwesome5 name="signature" size={15} color="white" style={{marginHorizontal: 10}} />} 
                                title= {signatureAO === undefined ? "Add Signature" : "Change Signature" }  
                                buttonStyle= {{margin: 10, backgroundColor: signatureAO === undefined ? '#2196F3' : '#ff6347'}}
                                onPress={() => setModalVisibleAO(!modalVisible)}
                            />
                            <Card.Image source={{uri: signatureAO}} style={{margin: 10}} />
                        </View>
                    </View>
                    

                </Card>

            </ScrollView>

            <BottomSheet
                ref={btmsheet}
                snapPoints={[450, 100, 60]}
                initialSnap={2}
                borderRadius={20}
                renderContent={renderContent}
            />

                {/* {visible &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                } */}
        </View>
    )

}

const styles = StyleSheet.create({
    wrapper: {
        padding: 15,
    },
    textTitle: {
        textAlign: 'center'
    },
    headerWrapper:{
        flex: 1,
    },
    headerCardContainer: {
        backgroundColor: '#0D67B2',
        height: window.height/5,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        padding: 15
    },
    groupDetailWrapper: {
        backgroundColor: '#fff',
        height: window.height/7,
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center'
    },
    DetailTextStyle: {
        fontSize: 15
    },
    accountContainer: {
        backgroundColor: '#E6E6E6',
        borderRadius: 20,
        borderRadius: 10,
        height: window.height/18,
        width: window.width/1.2,
        paddingLeft: 10,
        padding: 5
    },
    RadioStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    Detailtitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    currencyInput: {
        borderWidth: 1,
        borderRadius: 10,
        paddingTop: 0,
        height: window.height/18,
        width: window.width/3.0
    },
    currrencyContainer: {
        alignItems: 'flex-end'
    },
    deviderStyle: {
        borderBottomColor: 'black',
        borderBottomWidth: 0.7,
        width: window.width/1.5,
        padding: 10,
    },
    paymentStyle: {
        fontSize: 16
    },
    totalDepoStyle: {
        borderBottomWidth: 1,
        height: window.height/18,
        width: window.width/3.0
    },
    buttomBarWrapper: {
        backgroundColor: '#0D67B2',
        height: window.height/5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    totalCollectStyle: {
        height: window.height/18,
        width: window.width/3.0
    },
    totalSetoranStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,

    },
    totalAngsuranStyle: {
        flexDirection: 'row',
        paddingLeft: 10,
        height: 30,
    },
    submitButtonContainer: {
        elevation: 8,
        borderRadius: 5,
        backgroundColor: "#28b358",
        height: window.height/20,
        width: window.width/3.7,
        justifyContent: 'center'
    },
    signature: {
        height: window.height/4,
        flex: 1
      },
      buttonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        margin: 10,
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // height: window.height
      },
      modalView: {
        backgroundColor: "#ECE9E4",
        // borderRadius: 5,
        // alignItems: "center",
        // shadowColor: "#000",
        height: window.height,
        width: window.width,
        // shadowOffset: {
        //   width: 0,
        //   height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        textAlign: "center"
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