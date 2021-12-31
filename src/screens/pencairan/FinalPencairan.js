import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, ToastAndroid, Modal, CheckBox, SafeAreaView, TextInput, ActivityIndicator, ScrollView, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Card, Divider } from 'react-native-elements';
import SignatureScreen from "react-native-signature-canvas";
import { Checkbox } from 'react-native-paper';
import { Button } from 'react-native-elements';
import { Camera } from 'expo-camera'
import moment from 'moment'
import { currency, inputVal } from '../../utils/Functions';
import db from '../../database/Database'

const window = Dimensions.get('window');
const dimension = Dimensions.get('screen');
var uniqueNumber = (new Date().getTime()).toString(36);

const FinalPencairan = ({route}) => {

    const navigation = useNavigation()
    const camera = useRef(null)
    const [loading, setLoading] = useState(false)
    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
    let [aoName, setAoName] = useState();
    let [dataNasabah, setDataNasabah] = useState(route.params.data);
    let [postPencairan, setPostPencairan] = useState(route.params.postPencairan);
    let [buttonCam, SetButtonCam] = useState(false);
    let [fotoDataPencairan, setFotoDataPencairan] = useState();
    let [cameraShow, setCameraShow] = useState(false)
    const [keyword, setKeyword] = useState('');
    const [modalVisibleSubKel, setModalVisibleSubKel] = useState(false);
    const [modalVisibleNasabah, setModalVisibleNasabah] = useState(false);
    const [modalVisibleKetuaKel, setModalVisibleKetuaKel] = useState(false);
    const [signatureSubKel, setSignatureSubKel] = useState();
    const [signatureKetuaKel, setSignatureKetuaKel] = useState();
    const [signatureNasabah, setSignatureNasabah] = useState();
    const [statusMelakukan, setStatusMelakukan] = useState(false)
    const [hasPermission, setHasPermission] = useState(null);
    const [key_dataPencairan, setkey_dataPencairan] = useState(`foto_dataPencairan_${uniqueNumber}_${dataNasabah.Nama_Prospek.replace(/\s+/g, '')}`);
    const [key_tandaTanganNasabah2, setKey_tandaTanganNasabah2] = useState(`formUK_tandaTanganNasabah2_${uniqueNumber}_${dataNasabah.Nama_Prospek.replace(/\s+/g, '')}`);
    const [key_tandaTanganKetKel, setkey_tandaTanganKetKel] = useState(`formUK_tandaTanganKetKel_${uniqueNumber}_${dataNasabah.Nama_Prospek.replace(/\s+/g, '')}`);
    const [key_tandaTanganSubKel, setkey_tandaTanganSubKel] = useState(`formUK_tandaTanganSubKel_${uniqueNumber}_${dataNasabah.Nama_Prospek.replace(/\s+/g, '')}`);
    moment.locale('id');
    var Tanggal = moment(new Date()).format('LL')
    var hariIni = moment(new Date()).format('dddd')
    var Jam = moment(new Date()).format('HH:mm')


    useEffect(() => {
        const getUserData = () => {
            AsyncStorage.getItem('userData', (error, result) => {
                if (error) __DEV__ && console.log('userData error:', error);

                let data = JSON.parse(result);
                setBranchId(data.kodeCabang);
                setBranchName(data.namaCabang);
                setUname(data.userName);
                setAoName(data.AOname);
            });
        }

        getUserData();

        const came = async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        }

        came();
    }, []);

    const takePicture = async (type) => {
        try {
            setLoading(true)
            SetButtonCam(true)
            const options = { quality: 0.5, base64: true };
            const data = await camera.current.takePictureAsync(options)
            setFotoDataPencairan(data.uri);
            AsyncStorage.setItem(data.uri, data.base64)
            let i = statusMelakukan ? "1" : "0";
            setPostPencairan({...postPencairan, "Is_Dicairkan":i, "Foto_Pencairan":data.uri})
            setLoading(false);
            SetButtonCam(false);
        } catch (error) {}
    };

    function ModalSignKetuaKel(text, onOK){

        const ref = useRef();

        const handleOK = (signature) => {
            setSignatureKetuaKel(signature)
            setModalVisibleKetuaKel(!modalVisibleKetuaKel);
            setPostPencairan({...postPencairan, "TTD_KK":key_tandaTanganKetKel})
            AsyncStorage.setItem(key_tandaTanganKetKel, signature.split(',')[1])
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
                                <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>Pencairan Signature</Text>
                            </TouchableOpacity>
                            <Text style={{ alignSelf: 'center', margin: 20, fontSize: 18, fontWeight: 'bold' }}>Tanda Tangan Ketua Kelompok</Text>
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

    function ModalSignSubKel(text, onOK){

        const ref = useRef();

        const handleOK = (signature) => {
            setSignatureSubKel(signature)
            setModalVisibleSubKel(!modalVisibleSubKel);
            setPostPencairan({...postPencairan, "TTD_KSK":key_tandaTanganSubKel})
            AsyncStorage.setItem(key_tandaTanganSubKel, signature.split(',')[1])
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
                                <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>Pencairan Signature</Text>
                            </TouchableOpacity>
                            <Text style={{ alignSelf: 'center', margin: 20, fontSize: 18, fontWeight: 'bold' }}>Tanda Tangan Ketua Kelompok</Text>
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

    function ModalSignNasabah(text, onOK){

        const ref = useRef();

        const handleOK = (signature) => {
            setSignatureNasabah(signature)
            setModalVisibleNasabah(!modalVisibleNasabah);
            setPostPencairan({...postPencairan, "TTD_Nasabah_2":key_tandaTanganNasabah2})
            AsyncStorage.setItem(key_tandaTanganNasabah2, signature.split(',')[1])
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
                                <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>Pencairan Signature</Text>
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

    const submitHandlerCheckbox = () => {
        let i = !statusMelakukan ? "1" : "0";
        setStatusMelakukan(!statusMelakukan)
        setPostPencairan({...postPencairan, "Is_Dicairkan":i})
        //navigation.navigate("FinalPencairan", {data: dataNasabah, postPencairan: postPencairan})
    }

    const submitHandler = () => {
        if(signatureSubKel == null || signatureKetuaKel == null || signatureNasabah == null){
            ToastAndroid.show("Silahkan Isi Tanda Tangan dan Foto", ToastAndroid.SHORT);
        }else{
            navigation.replace("Siklus", {data: dataNasabah, postPencairan: postPencairan})
        }
    }

    return(
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleKetuaKel}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleKetuaKel(!modalVisibleKetuaKel);
                }}
            >
                {ModalSignKetuaKel()}
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleSubKel}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleSubKel(!modalVisibleSubKel);
                }}
            >
                {ModalSignSubKel()}
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleNasabah}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleNasabah(!modalVisibleNasabah);
                }}
            >
                {ModalSignNasabah()}
            </Modal>
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 40,
                alignItems: "center",
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity onPress={() => navigation.replace('FlowPencairan')} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('FrontHome')}>
                    <View style={{ flexDirection: 'row', alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, paddingHorizontal: 8 }}>
                        <MaterialCommunityIcons name="home" size={30} color="#2e2e2e" />
                        <Text>Home</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 30, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderRadius: 20}}>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>Pencairan</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{dataNasabah.Nama_Prospek}</Text>
                </ImageBackground>
            </View>

            {cameraShow === true ? (
                <View style={{flex: 1, marginTop: 20, borderRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF', marginBottom: 20}}>
                    {fotoDataPencairan === undefined ? (
                    <Camera 
                    ref={camera}
                    style={styles.preview}
                    type={Camera.Constants.Type.back}
                    // flashMode={Camera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel'
                    }}
                >
                    {loading &&
                        <View style={styles.loading}>
                            <ActivityIndicator size="large" color="#737A82" />
                        </View>
                    }
                    <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', top: 0 }}>
                        <TouchableOpacity 
                            style={{
                                flex: 0,
                                backgroundColor: '#EB3C27',
                                borderRadius: 5,
                                padding: 5,
                                paddingHorizontal: 5,
                                alignSelf: 'center',
                                margin: 20,
                            }} 
                            onPress={() => setCameraShow(false)
                        }>
                            <Text style={{ fontSize: 14, color: '#FFF' }}> Batal </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0 }}>
                        <TouchableOpacity 
                            disabled={ buttonCam }
                            style={{
                                flex: 0,
                                backgroundColor: buttonCam === true ? '#737A82' : '#FFF',
                                borderRadius: 5,
                                padding: 15,
                                paddingHorizontal: 20,
                                alignSelf: 'center',
                                margin: 20,
                            }} 
                            onPress={() => takePicture("FotoPencairan")
                        }>
                            <Text style={{ fontSize: 14 }}> Ambil Foto Pencairan </Text>
                        </TouchableOpacity>
                    </View>
                    </Camera>
                    ) : (
                    <View style={{ flex: 1 }}>
                        <Image source={{ uri: fotoDataPencairan }} style={styles.previewPhoto}/>
                        <View style={{ 
                            position: 'absolute', 
                            bottom: 35, 
                            left: 30, 
                            backgroundColor: 'white',
                            borderRadius: 10
                        }}>
                            <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setFotoDataPencairan(undefined)} >Batal</Text>
                        </View>
                        <View style={{ 
                            position: 'absolute', 
                            bottom: 35, 
                            right: 30, 
                            backgroundColor: 'white',
                            borderRadius: 10
                        }}>
                            <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setCameraShow(0)} >Simpan</Text>
                        </View>
                        {/* <Text style={styles.cancel} onPress={() => setFotoDataPenjamin(null)} >Cancel</Text> */}
                        {/* <Text style={styles.next} >Simpan Foto KTP</Text> */}
                    </View>
                    )} 
                </View>
                
                ) : (
                <View style={{flex: 1, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF'}}>
                    <ScrollView style={{borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                    <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Pencairan Pembiayaan </Text>
                            <Text style={{fontSize: 14}}>Saya yang bertanda Tangan dibawah ini:{"\n"}{"\n"}
                            Nama            :  {dataNasabah.Nama_Prospek}{"\n"}
                            Dengan ini menyatakan telah menerima pembiayaan
                            sebesar: <Text style={{fontSize: 14, color:"#0645AD"}}>{currency(parseInt(dataNasabah.Jumlah_Pinjaman))}</Text> rupiah, dan bersedia untuk
                            bertanggung jawab sampai pelunasan pembiayaan,
                            serta mematuhi dan menerima semua keputusan / peraturan
                            yang berlaku di PT. Permodalan Nasional Madani.{"\n"}{"\n"}

                            Hari                    :  {hariIni} {"\n"}
                            Tanggal             :  {Tanggal} {"\n"}
                            Jam                     :  {Jam} {"\n"}
                            Kelompok          :  {dataNasabah.Nama_Kelompok} {"\n"}</Text>
                            <Card>
                                <Card.Divider />
                                <View style={{marginBottom: 10}}>
                                    <Text style={{ fontWeight: 'bold' }}>Tanda Tangan Nasabah(*)</Text>
                                    <View style={{borderWidth: 1, marginVertical: 5, borderRadius: 10}}>
                                        <Button 
                                            icon={ <FontAwesome5 name="signature" size={15} color="white" style={{marginHorizontal: 10}} />} 
                                            title= {signatureNasabah === undefined ? "Add Signature" : "Change Signature" }  
                                            buttonStyle= {{margin: 10, backgroundColor: signatureNasabah === undefined ? '#2196F3' : '#ff6347'}}
                                            onPress={() => setModalVisibleNasabah(!modalVisibleNasabah)}
                                        />
                                        <Card.Image source={{uri: signatureNasabah}} style={{margin: 10}} />
                                    </View>
                                    <Text style={{ fontWeight: 'bold' }}>{dataNasabah.Nama_Prospek}</Text>
                                </View>
                                <View style={{marginBottom: 10}}>
                                    <Text style={{ fontWeight: 'bold' }}>Ketua Sub Kelompok(*)</Text>
                                    <View style={{borderWidth: 1, marginVertical: 5, borderRadius: 10}}>
                                        <Button 
                                            icon={ <FontAwesome5 name="signature" size={15} color="white" style={{marginHorizontal: 10}} />} 
                                            title= {signatureSubKel === undefined ? "Add Signature" : "Change Signature" }  
                                            buttonStyle= {{margin: 10, backgroundColor: signatureSubKel === undefined ? '#2196F3' : '#ff6347'}}
                                            onPress={() => setModalVisibleSubKel(!modalVisibleSubKel)}
                                        />
                                        <Card.Image source={{uri: signatureSubKel}} style={{margin: 10}} />
                                    </View>
                                </View>
                                <View style={{marginBottom: 10}}>
                                    <Text style={{ fontWeight: 'bold' }}>Ketua Kelompok(*)</Text>
                                    <View style={{borderWidth: 1, marginVertical: 5, borderRadius: 10}}>
                                        <Button 
                                            icon={ <FontAwesome5 name="signature" size={15} color="white" style={{marginHorizontal: 10}} />} 
                                            title= {signatureKetuaKel === undefined ? "Add Signature" : "Change Signature" }  
                                            buttonStyle= {{margin: 10, backgroundColor: signatureKetuaKel === undefined ? '#2196F3' : '#ff6347'}}
                                            onPress={() => setModalVisibleKetuaKel(!modalVisibleKetuaKel)}
                                        />
                                        <Card.Image source={{uri: signatureKetuaKel}} style={{margin: 10}} />
                                    </View>
                                </View>
                            </Card>
                        </View>

                        <View style={{margin: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Pencairan(*)</Text>
                            
                            <TouchableOpacity onPress={() => setCameraShow(true)}>
                                <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 10, borderRadius: 10}}>
                                    {fotoDataPencairan === undefined ? (
                                        <View style={{ alignItems:'center', justifyContent: 'center', flex: 1 }}>
                                            <FontAwesome5 name={'camera-retro'} size={80} color='#737A82' />
                                        </View>
                                    ) : (
                                        <Image source={{ uri: fotoDataPencairan }} style={styles.thumbnailPhoto}/>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>

                        {dataNasabah.Jenis_Pembiayaan.includes('CASH') ? ("")
                        :(<View style={{alignItems: 'center', flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
                            <Checkbox
                                status={statusMelakukan ? 'checked' : 'unchecked'}
                                onPress={() => submitHandlerCheckbox()}
                                style={styles.checkbox}
                            />
                            <Text style={styles.label}>Sudah Dicairkan</Text>
                        </View>)}
                        

                        <View style={{alignItems: 'center', marginBottom: 20, marginTop: 20}}>
                            <Button
                                title="SIMPAN"
                                onPress={() => submitHandler()}
                                buttonStyle={{backgroundColor: '#003049', width: dimension.width/2}}
                                titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                            />
                        </View>
                    
                    </ScrollView>
                </View>
            )}
        </View>
    )
}

export default FinalPencairan

const styles = StyleSheet.create({
    button: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowRadius: 10,
        shadowColor: '#003049',
        shadowOpacity: 0.3,
        shadowOffset: { height: 10 },
    },
    label: {
        margin: 8,
        fontSize:18
      },
    checkbox: {
        alignSelf: "center",
    },
    menu: {
        backgroundColor: '#003049'
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
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
      preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 20,
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    cancel: {
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: 'transparent',
        color: '#FFF',
        fontWeight: '600',
        fontSize: 17,
    },
    next: {
        position: 'absolute',
        left: 20,
        top: 20,
        backgroundColor: 'transparent',
        color: '#FFF',
        fontWeight: '600',
        fontSize: 17,
    },
    previewPhoto: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 20
    },
    thumbnailPhoto: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 5,
        borderRadius: 10
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
})