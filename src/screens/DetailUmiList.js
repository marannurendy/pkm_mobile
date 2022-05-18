import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Dimensions, Image, ImageBackground, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button, Card } from 'react-native-elements'
import { showMessage } from "react-native-flash-message"


export default function DetailUmiList({route}) {

    const dimension = Dimensions.get('screen')
    const getByid = "http://devumicornerpnm.pnm.co.id/listUmi/"

    const { id } = route.params

    const [data, setData] = useState()
    const [isLoading, setLoading] = useState(true)
    const [status, setStatus] = useState("ON_PROGRESS")
    const [transactionId, setTransactionId] = useState()
    const [executorId, setExecutorId] = useState()
    const [executorName, setExecutorName] = useState()
    const [executorPhoneNumber, setExecutorPhoneNumber] = useState()
    const [executionBusinessUnitId, setExecutionBusinessUnitId] = useState()
    const [executionBusinessUnitName, setExecutionBusinessUnitName] = useState()
    const [loading, setLoadingSet] = useState(false)

    const navigation = useNavigation()

    useEffect(() => {
        FetchDatabyid()
        FetchLoginData()
    }, [])

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

    async function FetchLoginData() {
        AsyncStorage.getItem('userData', (error, result) => {
            const dt = JSON.parse(result);

            setExecutorId(dt.nip)
            setExecutorName(dt.AOname)
            setExecutionBusinessUnitId(dt.kodeCabang)
            setExecutionBusinessUnitName(dt.namaCabang)
        })
    }

    async function FetchDatabyid() {
        const getid = await route.params
        console.log(getByid+getid.id)
        try{
            await fetch(getByid+getid.id, {
                method: 'GET',
                headers: {
                    Accept:
                        'application/json',
                        'Content-Type': 'application/json'
                    },
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                setData(responseJson.data)
                setTransactionId(responseJson.data.transactionID)
                // setExecutorId(responseJson.data.PickByNIP)
                // setExecutorName(responseJson.data.PickByNama)
                setExecutorPhoneNumber(responseJson.data.PickByHP)
                // setExecutionBusinessUnitId(responseJson.data.PickByBranchID)
                // setExecutionBusinessUnitName(responseJson.data.PickByBranchName)
                setLoading(false)
                // setUrl(responseJson.data.webviewUrl)
            })
        }catch(error){
            console.log(error)
            setLoading(false)
        }
    }

    const submitHandler = () => {
        // console.log("yang ini "+BaseApi+ApiType)
        // const BaseApi = "http://devumicornerpnm.pnm.co.id"
        // var ApiType = "/referral-update"

        try{
            setLoadingSet(true)
                // return fetch("http://devumicornerpnm.pnm.co.id/referral-update", {
                    return fetch("http://devumicornerpnm.pnm.co.id/referral-update", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                                'Content-Type': 'application/json',
                                'Apikey': 'QlJJUE5NSmF5YVNlbGFsdQ=='
                        },
                    body: JSON.stringify({
                        status: status,
                        transactionId: transactionId,
                        executorId: executorId,
                        executorName: executorName,
                        executorPhoneNumber: executorPhoneNumber,
                        executionBusinessUnitId: executionBusinessUnitId,
                        executionBusinessUnitName: executionBusinessUnitName,
                    })
                })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if(responseJson.responseCode === "0201") {
                    flashNotification("Success", "Data berhasil di proses", "#ffbf47", "#fff")
                    setLoadingSet(false)
                    navigation.navigate('UmiList')
                }else{
                    flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat", "#ff6347", "#fff")
                    setLoadingSet(false)
                }
                // setData(responseJson)
                // setUrl(responseJson.data.webviewUrl)
                // setLoadingSet(true)
            })
        }catch(error){
            flashNotification("Alert", error + "Try again later", "#ff6347", "#fff")
            setLoadingSet(false)
        }
    }

  return (   
    <View style={{width: dimension.width, height: dimension.height, flex: 1}}>       
    <ImageBackground source={require("../images/backtestMenu.png")} style={styles.image}>
    
    {isLoading ? (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color="#00ff00" />
        </View>
    ) : (

        <View style={{flex: 1}}>
        <Card wrapperStyle={{padding: 10}}>
        <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View>
                    <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom: 20}}>{data.name.toUpperCase()}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text>Jumlah Pinjaman : </Text>
                        <View>
                            <Text>{parseInt(data.loanLimit)}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text>Status Pengajuan : </Text>
                        <View>
                            <Text>{data.StatusTransaksi}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Image source={require("../images/mekaar.png")} style={{width: dimension.width/4, height: dimension.height/25}} />
                </View>
            </View>
        </View>
        </Card>

        <ScrollView>

        <View style={{margin: 20}}>
            <View>
                <View style={{padding: 5}}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, color: "#545454"}}>Data Nasabah</Text>
                </View>
                <View style={{borderWidth: 2, padding: 5, borderRadius: 5}}>
                    <View style={{margin: 5}}>
                        <Text style={{fontSize: 13, color: "#545454"}}>Form Data Diri sesuai dengan Kartu Tanda Penduduk (KTP).</Text>
                    </View>
                    <View style={styles.formBring}>
                        <Text style={{ padding: 5 }}>NIK</Text>
                        <View style={styles.formContainer}>
                            <TextInput editable={false} value={data.nik}   style={{ paddingHorizontal: 10, fontSize: 15, color: "#545454" }}/>
                        </View>
                    </View>

                    <View style={styles.formBring}>
                        <Text style={{ padding: 5 }}>Nama</Text>
                        <View style={{marginHorizontal: 10, borderRadius: 5, backgroundColor: '#fff'}}>
                            <View style={styles.formBring}>
                                <View style={{backgroundColor: "#FFF", borderRadius: 10, borderColor: '#545454', borderBottomWidth: 0.5}}>
                                    <TextInput editable={false} value={data.name.toUpperCase()} placeholder="Nama Lengkap" style={{ paddingHorizontal: 10, fontSize: 18, color: "#545454", fontWeight: 'bold' }}/>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.formBring}>
                        <Text style={{ padding: 5 }}>Jenis Kelamin</Text>
                        <View style={styles.formContainer}>
                            <TextInput editable={false} value={data.gender === 'f' ? 'Perempuan' : 'Laki laki'} placeholder="Nama Lengkap" style={{ paddingHorizontal: 10, fontSize: 15, color: "#545454" }}/>
                        </View>
                        
                    </View>

                    <View style={styles.formBring}>
                        <Text style={{ padding: 5 }}>Tanggal Lahir</Text>
                        <View style={styles.formContainer}>
                            <TextInput editable={false} value={data.burthDate} placeholder="Nama Lengkap" style={{ paddingHorizontal: 10, fontSize: 15, color: "#545454" }}/>
                        </View>
                    </View>
                </View>

                <View style={{marginTop: 30}}>
                    <View style={{padding: 5}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20, color: "#545454"}}>Alamat Lengkap</Text>
                    </View>
                    <View style={{borderWidth: 2, padding: 5, borderRadius: 5}}>
                        <View style={{margin: 5}}>
                            <Text style={{fontSize: 13, color: "#545454"}}>Form Alamat berikut sesuai dengan Kartu Tanda Penduduk (KTP).</Text>
                        </View>

                        <View style={styles.formBring}>
                            <Text style={{ padding: 5 }}>Alamat Lengkap</Text>
                            <View style={styles.formContainer}>
                                <TextInput editable={false} value={data.address} placeholder="RT" style={{ paddingHorizontal: 5, fontSize: 15, color: "#545454" }}/>
                            </View>
                        </View>

                        <View style={styles.formBring}>
                            <Text style={{ padding: 5 }}>RT/RW</Text>
                            <View style={{backgroundColor: "#FFF", borderRadius: 10, borderColor: '#545454', borderWidth: 1.5, margin: 5, borderColor: '#5D92E1', width: dimension.width/4}}>
                                <TextInput editable={false} value={data.rtRw} placeholder="RT" style={{ paddingHorizontal: 5, fontSize: 15, color: "#545454" }}/>
                            </View>
                        </View>

                        <View style={styles.formBring}>
                            <Text style={{ padding: 5 }}>Provinsi</Text>
                            <View style={styles.formContainer}>
                                <TextInput editable={false} value={data.province} placeholder="RT" style={{ paddingHorizontal: 5, fontSize: 15, color: "#545454" }}/>
                            </View>
                        </View>

                        <View style={styles.formBring}>
                            <Text style={{ padding: 5 }}>Kecamatan</Text>
                            <View style={styles.formContainer}>
                                <TextInput editable={false} value={data.village} placeholder="RT" style={{ paddingHorizontal: 5, fontSize: 15, color: "#545454" }}/>
                            </View>
                        </View>

                        <View style={styles.formBring}>
                            <Text style={{ padding: 5 }}>Kelurahan</Text>
                            <View style={styles.formContainer}>
                                <TextInput editable={false} value={data.district} placeholder="RT" style={{ paddingHorizontal: 5, fontSize: 15, color: "#545454" }}/>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{marginTop: 30}}>
                    <View style={{padding: 5}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20, color: "#545454"}}>Contact Person</Text>
                    </View>
                    <View style={{borderWidth: 2, padding: 5, borderRadius: 5}}>
                        <View style={styles.formBring}>
                            <Text style={{ padding: 5 }}>No. HP</Text>
                            <View style={styles.formContainer}>
                                <TextInput editable={false} value={data.phoneNumber} placeholder="No. HP" style={{ paddingHorizontal: 5, fontSize: 15, color: "#545454" }} />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{marginTop: 10, marginBottom: 25}}>
                    <View style={{padding: 5}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20, color: "#545454"}}>Latar Belakang Nasabah</Text>
                    </View>
                    <View style={{borderWidth: 2, padding: 5, borderRadius: 5}}>

                        <View style={styles.formBring}>
                            <Text style={{ padding: 5 }}>Pendidikan</Text>
                            <View style={styles.formContainer}>
                                <TextInput editable={false} value={data.educatiuon} placeholder="Motivasi" style={{ paddingHorizontal: 20, fontSize: 15, color: "#545454" }}/>
                            </View>
                        </View>

                        <View style={styles.formBring}>
                            <Text style={{ padding: 5 }}>Pekerjaan</Text>
                            <View style={styles.formContainer}>
                                <TextInput editable={false} value={data.businessType} placeholder="Motivasi" style={{ paddingHorizontal: 20, fontSize: 15, color: "#545454" }}/>
                            </View>
                        </View>

                    </View>
                </View>
                
            </View>
                {(data.StatusTransaksi === 'BEING_REGISTERED') ? (
                    <View style={{ alignItems: 'center'}}>
                        <View>
                            <Button 
                                onPress={() => submitHandler()}
                                // onPress={() => submitHandler()}
                                title="PROSES" 
                                raised={true} 
                                buttonStyle={{width: dimension.width/2}}

                                />
                        </View>
                    </View>
                ) : (
                    <View></View>
                )}
            </View>
        </ScrollView>
        </View>
    )}
        </ImageBackground>
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
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    // paddingVertical: 5,
    // borderWidth: 1,
    borderColor: '#545454',
    borderWidth: 1.5,
    margin: 5,
    borderColor: '#5D92E1'
  },
  formDisable: {
    backgroundColor: "#A9A9A9",
    borderRadius: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#A9A9A9',
  },
  formBring: {
    paddingBottom: 10,
  },
  phoneInput: {
    // borderColor: '#ddd',
    // borderWidth: 2,
    // borderRadius: 2,
    padding: 16
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
})