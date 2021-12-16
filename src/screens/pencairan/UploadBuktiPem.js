import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, Modal, FlatList, SafeAreaView, ActivityIndicator, ScrollView, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Button } from 'react-native-elements';
import bismillah from '../../images/bismillah.png';
import { Camera } from 'expo-camera'

import db from '../../database/Database'

const window = Dimensions.get('window');

const UploadBuktiPem = () => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()
    const camera = useRef(null)
    const [loading, setLoading] = useState(false)
    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
    let [aoName, setAoName] = useState();
    let [fotoBukti1, setFotoBukti1] = useState();
    let [fotoBukti2, setFotoBukti2] = useState();
    let [fotoBukti3, setFotoBukti3] = useState();
    let [buttonCam, SetButtonCam] = useState(false);
    let [cameraShow, setCameraShow] = useState()
    const [hasPermission, setHasPermission] = useState(null);
    const key_fotoBukti1 = `formUK_dataPenjamin_`;
    const key_fotoBukti2 = `formUK_dataPenjamin_`;
    const key_fotoBukti3 = `formUK_dataPenjamin_`;

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

        // AsyncStorage.getItem('userData', (error, result) => {
        //     let dt = JSON.parse(result)

        //     setBranchId(dt.kodeCabang)
        //     setBranchName(dt.namaCabang)
        //     setUname(dt.userName)
        //     setAoName(dt.AOname)
        // })

        // let GetInisiasi = 'SELECT lokasiSosialisasi, COUNT(namaCalonNasabah) as jumlahNasabah FROM Sosialisasi_Database GROUP BY lokasiSosialisasi;'
        // db.transaction(
        //     tx => {
        //         tx.executeSql(GetInisiasi, [], (tx, results) => {
        //             console.log(JSON.stringify(results.rows._array))
        //             let dataLength = results.rows.length
        //             // console.log(dataLength)

        //             var arrayHelper = []
        //             for(let a = 0; a < dataLength; a ++) {
        //                 let data = results.rows.item(a)
        //                 arrayHelper.push({'groupName' : data.lokasiSosialisasi, 'totalnasabah': data.jumlahNasabah, 'date': '08-09-2021'})
        //                 // console.log("this")
        //                 // console.log(data.COUNT(namaCalonNasabah))
        //             }
        //             console.log(arrayHelper)
        //             setData(arrayHelper)
        //         }
        //         )
        //     }
        // )

        // AsyncStorage.getItem('DwellingCondition', (error, result) => {
        //     console.log(result)
        // })
    }, []);

    
    // Simpan Handler
    const submitHandler = () => {
        navigation.navigate("FormFP4")
    }

    const takePicture = async (type) => {
        try {
            setLoading(true)
            SetButtonCam(true)
            const options = { quality: 0.5, base64: true };
            const data = await camera.current.takePictureAsync(options)

            if (type === "Bukti1") {
                AsyncStorage.setItem(key_fotoBukti1, 'data:image/jpeg;base64,' + data.base64);
                setFotoBukti1(data.uri);
                setLoading(false);
                SetButtonCam(false);
            }else if (type === "Bukti2") {
                AsyncStorage.setItem(key_fotoBukti2, 'data:image/jpeg;base64,' + data.base64);
                setFotoBukti2(data.uri);
                setLoading(false);
                SetButtonCam(false);
            }else if (type === "Bukti3") {
                AsyncStorage.setItem(key_fotoBukti3, 'data:image/jpeg;base64,' + data.base64);
                setFotoBukti3(data.uri);
                setLoading(false);
                SetButtonCam(false);
            }
        } catch (error) {}
    };

    return(
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
            <View
            style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 10,
                alignItems: "center",
            }}
            >
                <View style={{height: dimension.height/4, marginHorizontal: 10, borderRadius: 20, marginTop: 30, flex: 1}}>
                    <ImageBackground source={require("../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover"}} imageStyle={{borderRadius: 20}}>

                        <TouchableOpacity onPress={() => navigation.replace('FrontHome')} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, margin: 20, width: dimension.width/3}}>
                            <View>
                                <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                            </View>
                            <Text style={{flex: 1, textAlign: 'center', borderRadius: 20, fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>MENU</Text>
                        </TouchableOpacity>

                        <Text numberOfLines={2} style={{fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5, marginHorizontal: 20}}>{branchName}</Text>
                        <Text numberOfLines={2} style={{fontSize: 13, fontWeight: 'bold', color: '#FFF', marginHorizontal: 20}}>{branchId} - {branchName}</Text>
                        <Text style={{fontSize: 15, fontWeight: 'bold', color: '#FFF', marginHorizontal: 20}}>{uname} - {aoName}</Text>
                    </ImageBackground>
                </View>
            </View>

            {cameraShow === 1 ? (
            <View style={{flex: 1, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF'}}>
                {fotoBukti1 === undefined ? (
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
                        onPress={() => setCameraShow(0)
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
                        onPress={() => takePicture("Bukti1")
                    }>
                        <Text style={{ fontSize: 14 }}> Ambil Foto Bukti </Text>
                    </TouchableOpacity>
                </View>
                </Camera>
                ) : (
                <View style={{ flex: 1 }}>
                    <Image source={{ uri: fotoBukti1 }} style={styles.previewPhoto}/>
                    <View style={{ 
                        position: 'absolute', 
                        bottom: 35, 
                        left: 30, 
                        backgroundColor: 'white',
                        borderRadius: 10
                    }}>
                        <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setFotoKartuIdentitas(undefined)} >Batal</Text>
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
            
            ) : cameraShow === 2 ? (
            
                <View style={{flex: 1, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF'}}>
                {fotoBukti2 === undefined ? (
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
                        onPress={() => setCameraShow(0)
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
                        onPress={() => takePicture("Bukti1")
                    }>
                        <Text style={{ fontSize: 14 }}> Ambil Foto Bukti </Text>
                    </TouchableOpacity>
                </View>
                </Camera>
                ) : (
                <View style={{ flex: 1 }}>
                    <Image source={{ uri: fotoBukti2 }} style={styles.previewPhoto}/>
                    <View style={{ 
                        position: 'absolute', 
                        bottom: 35, 
                        left: 30, 
                        backgroundColor: 'white',
                        borderRadius: 10
                    }}>
                        <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setFotoKartuIdentitas(undefined)} >Batal</Text>
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
            
            ) : cameraShow === 3 ? (
                <View style={{flex: 1, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF'}}>
                {fotoBukti3 === undefined ? (
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
                        onPress={() => setCameraShow(0)
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
                        onPress={() => takePicture("Bukti3")
                    }>
                        <Text style={{ fontSize: 14 }}> Ambil Foto Bukti </Text>
                    </TouchableOpacity>
                </View>
                </Camera>
                ) : (
                <View style={{ flex: 1 }}>
                    <Image source={{ uri: fotoBukti3 }} style={styles.previewPhoto}/>
                    <View style={{ 
                        position: 'absolute', 
                        bottom: 35, 
                        left: 30, 
                        backgroundColor: 'white',
                        borderRadius: 10
                    }}>
                        <Text style={{ marginHorizontal: 30, marginVertical: 5, fontSize: 18, fontWeight: 'bold' }} onPress={() => setFotoKartuIdentitas(undefined)} >Batal</Text>
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
            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView>
                        <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Bukti Nota Pembelian</Text>

                            <Text style={{fontSize: 14, fontWeight: 'bold'}}>Upload Nota Pembelian</Text>
                            <View style={{margin: 20}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Pencairan(*)</Text>
                                
                                <TouchableOpacity onPress={() => setCameraShow(1)}>
                                    <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 10, borderRadius: 10}}>
                                        {fotoBukti1 === undefined ? (
                                            <View style={{ alignItems:'center', justifyContent: 'center', flex: 1 }}>
                                                <FontAwesome5 name={'camera-retro'} size={80} color='#737A82' />
                                            </View>
                                        ) : (
                                            <Image source={{ uri: fotoBukti1 }} style={styles.thumbnailPhoto}/>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Text style={{fontSize: 14, fontWeight: 'bold'}}>Upload Nota Pembelian</Text>
                            <View style={{margin: 20}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Pencairan(*)</Text>
                                
                                <TouchableOpacity onPress={() => setCameraShow(2)}>
                                    <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 10, borderRadius: 10}}>
                                        {fotoBukti2 === undefined ? (
                                            <View style={{ alignItems:'center', justifyContent: 'center', flex: 1 }}>
                                                <FontAwesome5 name={'camera-retro'} size={80} color='#737A82' />
                                            </View>
                                        ) : (
                                            <Image source={{ uri: fotoBukti2 }} style={styles.thumbnailPhoto}/>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Text style={{fontSize: 14, fontWeight: 'bold'}}>Upload Nota Pembelian</Text>
                            <View style={{margin: 20}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Foto Pencairan(*)</Text>
                                
                                <TouchableOpacity onPress={() => setCameraShow(3)}>
                                    <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 10, borderRadius: 10}}>
                                        {fotoBukti3 === undefined ? (
                                            <View style={{ alignItems:'center', justifyContent: 'center', flex: 1 }}>
                                                <FontAwesome5 name={'camera-retro'} size={80} color='#737A82' />
                                            </View>
                                        ) : (
                                            <Image source={{ uri: fotoBukti3 }} style={styles.thumbnailPhoto}/>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
            )}
        </View>
    )
}

export default UploadBuktiPem

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