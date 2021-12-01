import React, { createRef, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, ScrollView, Alert, ToastAndroid, PermissionsAndroid, Modal, Pressable, TouchableOpacity, ActivityIndicator} from 'react-native';
import { Card, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import CurrencyInput from 'react-native-currency-input';
import SignatureCapture from 'react-native-signature-capture';
import { Picker } from 'native-base';
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

const window = Dimensions.get('window');

function DetailKelompok(props) {
    moment.locale('id');
    var hariIni = moment().format('LLLL')

  return(
      <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="account-group" color='black' size={25} />
                        <Text style={{ paddingLeft: 20,fontSize: 15, width: window.width/1.27 }}>{props.kodeCabang} - {props.namaCabang}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="account-multiple" color='black' size={25} />
                        <Text style={{ paddingLeft: 20,fontSize: 15, width: window.width/1.27 }}>{props.idkelompok} - {props.namakelompok}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="calendar-multiselect" color='black' size={25} />
                        <Text style={{ paddingLeft: 20, fontSize: 15, width: window.width/1.27 }}>{hariIni}</Text>
                    </View>
      </View>
  )
}

export default function SignNew({route}) {
    const [angsuran, setAngsuran] = useState()
    const [setoran, setSetoran] = useState()
    const [tarikan, setTarikan] = useState()
    const [groupID, setGroupID] = useState()
    const [meetingDay, setMeetingDay] = useState()
    const [meetingTime, setMeetingTime] = useState()
    const [ketuaKelompok, setKetuaKelompok] = useState()
    const [branchID, setBranchid] = useState()
    const [namaCabang, setNamaCabang] = useState()
    const [Username, setUsername] = useState()
    const [AOname, setAoName] = useState()
    const [groupDetail, setGroupDetail] = useState([])
    const [memberList, setMemberList] = useState([])
    const [titipan, setTitipan] = useState()
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisibleAO, setModalVisibleAO] = useState(false)
    const [totaldetail, setTotaldetail] = useState()
    const [signatureKetua, setSignatureKetua] = useState()
    const [signatureAO, setSignatureAO] = useState()
    const [longitude, setLongitude] = useState()
    const [latitude, setLatitude] = useState()
    const [loading, setLoading] = useState(false)

    const { id, username } = route.params;
    const netInfo = useNetInfo()
    const btmsheet = React.createRef()
    const btmsheets = btmsheet.current

    const navigation = useNavigation()

    useEffect(() => {
        setLoading(true)
        getData()
    }, [])

    const getData = () => {
        var query = 'SELECT DISTINCT * FROM Totalpkm WHERE GroupID = ';
        query = query + "'" + id + "'" + ";";
        var detQuery = 'SELECT DISTINCT * FROM GroupList WHERE GroupID = ';
        detQuery = detQuery + "'" + id + "'" + ";";
        var listMember = 'SELECT ClientID, ClientName FROM AccountList WHERE GroupID = ';
        listMember = listMember + id

        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    // console.log(dataLength)

                    var arrayHelper = []
                    var data = ''
                    for(let d = 0; d < 1; d++) {
                        data = results.rows.item(d);
                        arrayHelper.push(results.rows.item(d));
                    }
                    // console.log("this"+data.TotalAngsuran)
                    try{
                        setTotaldetail(arrayHelper)
                        setAngsuran(data.TotalAngsuran)
                        setSetoran(data.TotalSetoran)
                        setTitipan(data.TotalTitipan)
                    }catch(error){
                        console.log(error)
                    } 
                }),

                tx.executeSql(detQuery, [], (tx, results) => {
                    let datalength = results.rows.length

                    let helperArray = [];
                    for(let a = 0; a < datalength; a++) {
                        var data = results.rows.item(a);
                        helperArray.push(results.rows.item(a));
                    }
                    // console.log(helperArray)
                    setGroupDetail(helperArray)
                    setGroupID(data.GroupID)
                    setMeetingDay(data.MeetingDay)
                    setMeetingTime(data.MeetingTime)
                    
                }),

                tx.executeSql(listMember, [], (tx, results) => {
                    let datalength = results.rows.length

                    var helperArray = []
                    for(let q = 0; q < datalength; q++) {
                        helperArray.push(results.rows.item(q));
                    }

                    setMemberList(helperArray)
                })

            },function(error) {
                console.log('Transaction ERROR: ' + error.message);
            }, function() {
                setLoading(false)
                console.log("hey " + angsuran);
            }
        )

        AsyncStorage.getItem('userData', (error, result) => {
            const data = JSON.parse(result);
            setBranchid(data.kodeCabang)
            setNamaCabang(data.namaCabang)
            setUsername(data.userName)
            setAoName(data.AOname)
        })
    }

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

    const renderContent = () => (
        <View style={{ backgroundColor: '#0D67B2', padding: 16, height: 450,}}>
            <Button 
                icon={ <Icon name="arrow-right" size={15} color="white" style={{margin: 10}} />} 
                title="SUBMIT" 
                buttonStyle={{margin: 10}}
                onPress={() => submitHandler()}
            />

            <View style={{marginTop: 20}}>
                <Text style={{color: '#fff', fontSize: 15, marginBottom: 10, fontWeight: 'bold'}}>Ringkasan Transaksi</Text>
                <View style={{borderWidth: 1.5, borderColor: '#fff', borderRadius: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10, backgroundColor: '#fff', paddingLeft: 10, borderRadius: 10}}>
                        <Text style={{ color: 'black', fontSize: 16 }}>Total Setoran :</Text>
                        <View>
                            <CurrencyInput
                                value={setoran}
                                unit="Rp "
                                delimiter=","
                                separator="."
                                precision={0}
                                editable= {false}
                                style={{
                                    color: 'black',
                                    fontSize: 16,
                                }}
                            />
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10, backgroundColor: '#fff', paddingLeft: 10, borderRadius: 10}}>
                        <Text style={{ color: 'black', fontSize: 16 }}>Total Angsuran :</Text>
                        <View>
                            <CurrencyInput
                                value={angsuran}
                                unit="Rp "
                                delimiter=","
                                separator="."
                                precision={0}
                                editable= {false}
                                style={{
                                    color: 'black',
                                    fontSize: 16,
                                }}
                            />
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10, backgroundColor: '#fff', paddingLeft: 10, borderRadius: 10}}>
                        <Text style={{ color: 'black', fontSize: 16 }}>Total Titipan :</Text>
                        <View>
                            <CurrencyInput
                                value={titipan}
                                unit="Rp "
                                delimiter=","
                                separator="."
                                precision={0}
                                editable= {false}
                                style={{
                                    color: 'black',
                                    fontSize: 16,
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
            
        </View>
      );
    
    const submitHandler = () => {

        const requestLocationPermission = async () => {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  title: 'Location Access Required',
                  message: 'PKM Mobile membutuhkan izin untuk mengakses lokasi anda',
                },
            );
              
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getOneTimeLocation();
              }else{
                var a = 'notFound'
                var b = 'notFound'
                
                submitData(a, b)
              }
        }

        const getOneTimeLocation = () => {
            // console.log("this up")
            // Geolocation.getCurrentPosition(info => {
            //     var a = info.coords.longitude
            //     var b = info.coords.latitude

            //     submitData(a, b)
            // });
            
        }

        const submitData = (a, b) => {
            // console.log(a)
            const btmsheets = btmsheet.current
            if((ketuaKelompok === undefined || ketuaKelompok === '') || (signatureKetua === undefined || signatureKetua === '') || (signatureAO === undefined || signatureAO === '')){
                if((signatureKetua === undefined || signatureKetua === '') || (signatureAO === undefined || signatureAO === '')) {
                    flashNotification("Form Invalid", "Semua Tandatangan harus di isi", "#ff6347", "#fff")
                    console.log("hey")
                }else if(ketuaKelompok === undefined || ketuaKelompok === ''){
                    flashNotification("Form Invalid", "Silahkan pilih nama ketua kelompok", "#ff6347", "#fff")
                    console.log("ho")
                }
            }else{
                btmsheets.snapTo(0)
                var query =`UPDATE Totalpkm 
                                SET TtdKetuaKelompok = "` + signatureKetua.replace('data:image/png;base64,','') + `",
                                TtdAccountOfficer = "` + signatureAO.replace('data:image/png;base64,','') + `",
                                IDKetuaKelompok =  "` + ketuaKelompok + `", 
                                userName = "`+ username + `",
                                longitude = "`+ a + `",
                                latitude = "`+ b + `" 
                                WHERE GroupID = "`+ id + `"`
                                
                Alert.alert(
                    "Attention !",
                    "Apa anda yakin menyetujui semua transaksi ?",
                    [
                      {
                        text: "Batal",
                        style: "cancel"
                      },
                      { text: "OK", onPress: () => {
                            btmsheets.snapTo(2)
                            setLoading(true)
                            try{
                                db.transaction(
                                    tx => {
                                        tx.executeSql(query)
                                    },function(error) {
                                        alert("FATAL ERROR ! : " + error.message)
                                        setLoading(false)
                                    }, function() {
                                        setLoading(false)
                                        Alert.alert(
                                            "Sukses",
                                            "Jumlah angsuran yang diterima telah disetujui bersama",
                                            [
                                                { text: "OK", onPress: () => navigation.navigate("Menu", {groupid: id}) }
                                            ],
                                            { cancelable: false }
                                        );
                                    }
                                )
                            }catch(error){
                                alert("FATAL ERROR ! : " + error.message)
                                setLoading(false)
                            }
                      } }
                    ]
                  );
            }
        }

        if(netInfo.isConnected === false) {
            var a = 'notFound'
            var b = 'notFound'
            submitData(a, b)
            console.log("hey")
        }else if(netInfo.isConnected === true){
            requestLocationPermission()
            // submitData()
        }

        // console.log(netInfo.isConnected)


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

        const handleEnd = () => {
            ref.current.readSignature();
        };


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
                    <SignatureScreen
                        ref={ref}
                        onEnd={handleEnd}
                        onOK={handleOK}
                        onEmpty={handleEmpty}
                        onClear={handleClear}
                        autoClear={true}
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

        const handleEnd = () => {
            ref.current.readSignature();
        };

        return(
            <View style={{flex: 1}}>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{flexDirection: 'row', backgroundColor: '#0D67B2', alignItems: 'center'}}>
                        <View style={{alignItems: 'center', flex: 1,backgroundColor: '#0D67B2', padding: 10, flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => {setModalVisibleAO(!modalVisibleAO)}}>
                                <Icon name="arrow-left" size={15} color="white" style={{margin: 10}} />
                            </TouchableOpacity>
                            <View style={{alignSelf: 'center', marginHorizontal: 20}}>
                                <Text style={{fontWeight: 'bold', fontSize: 18, color: '#fff'}}>Tanda Tangan Account Officer</Text>
                            </View>
                            
                        </View>
                    </View>
                    <SignatureScreen
                        ref={ref}
                        onEnd={handleEnd}
                        onOK={handleOK}
                        onEmpty={handleEmpty}
                        onClear={handleClear}
                        autoClear={true}
                        descriptionText={text}
                    />
                </View>
            </View>
            </View>            
        )
    }

    return(
        <View style={styles.headerWrapper}>
            <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = 'transparent' translucent={true}/>
            {/* <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = '#0D67B2' translucent={true}/> */}
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
            <View style={styles.headerCardContainer}>
                <View style={styles.groupDetailWrapper}>
                    {groupDetail.map((item, index) => (
                        <DetailKelompok key={index} idkelompok={item.GroupID} namakelompok={item.GroupName} kodeCabang={branchID} namaCabang={namaCabang} />
                    ))}
                </View>
            </View>

            <ScrollView contentContainerStyle={{paddingBottom: 110}}>
                <Card>
                    <Card.Title>
                            <Text style={{fontSize: 18}}>SIGNATURE FORM</Text>
                    </Card.Title>
                    <Card.Divider />

                    <View style={{marginBottom: 10}}>
                        <View>
                            <Text style={{ fontSize: 13, fontStyle: 'italic' }}>*Pilih Nama Ketua Kelompok</Text>
                        </View>
                        <View style={{ borderWidth: 1 }}>
                            <Picker
                                selectedValue={ketuaKelompok}
                                style={{height: 35}}
                                onValueChange={(itemValue, itemIndex) => setKetuaKelompok(itemValue)
                            }>
                                <Picker.Item label='Silahkan Pilih' />
                                {memberList.map((item, index) => (
                                    <Picker.Item label={item.ClientName} value={item.ClientID} key={index} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View style={{marginBottom: 10}}>
                        <Text>Tanda Tangan Ketua Kelompok</Text>
                        <View style={{borderWidth: 1, marginVertical: 5}}>
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
                        <Text>Tanda Tangan Account Officer</Text>
                        <View style={{borderWidth: 1, marginVertical: 5}}>
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
                snapPoints={[450, 200, 100]}
                initialSnap={2}
                borderRadius={10}
                renderContent={renderContent}
            />

            {loading &&
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            }
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