import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, Modal, CheckBox, SafeAreaView, ActivityIndicator, ScrollView, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import ActionButton from 'react-native-action-button'
import { scale, verticalScale } from 'react-native-size-matters'
import { Card, Divider } from 'react-native-elements';
import SignatureScreen from "react-native-signature-canvas";
import { Button } from 'react-native-elements';
import { Camera } from 'expo-camera'
import bismillah from '../../images/bismillah.png';

import db from '../../database/Database'

const window = Dimensions.get('window');
const dimension = Dimensions.get('screen');

const FinalPencairan = ({route}) => {

    const navigation = useNavigation()
    const camera = useRef(null)
    const [loading, setLoading] = useState(false)
    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
    let [aoName, setAoName] = useState();
    let [menuShow, setMenuShow] = useState(0);
    let [menuToggle, setMenuToggle] = useState(false);
    let [data, setData] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [modalVisibleSubKel, setModalVisibleSubKel] = useState(false);
    const [modalVisibleNasabah, setModalVisibleNasabah] = useState(false);
    const [modalVisibleKetuaKel, setModalVisibleKetuaKel] = useState(false);
    const [signatureSubKel, setSignatureSubKel] = useState();
    const [signatureKetuaKel, setSignatureKetuaKel] = useState();
    const [signatureNasabah, setSignatureNasabah] = useState();
    let [buttonCam, SetButtonCam] = useState(false);
    const [isSelected, setSelection] = useState(false);
    let [fotoDataPencairan, setFotoDataPencairan] = useState();
    const [hasPermission, setHasPermission] = useState(null);
    let [cameraShow, setCameraShow] = useState(false)
    const key_dataPenjamin = `formUK_dataPenjamin_`;

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
        //getSosialisasiDatabase();
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

    const takePicture = async (type) => {
        try {
            setLoading(true)
            SetButtonCam(true)
            const options = { quality: 0.5, base64: true };
            const data = await camera.current.takePictureAsync(options)

            if (type === "FotoPencairan") {
                AsyncStorage.setItem(key_dataPenjamin, 'data:image/jpeg;base64,' + data.base64);
                setFotoDataPencairan(data.uri);
                setLoading(false);
                SetButtonCam(false);
            }
        } catch (error) {}
    };

    function ModalSignKetuaKel(text, onOK){

        const ref = useRef();

        const handleOK = (signature) => {
            setSignatureKetuaKel(signature)
            setModalVisibleKetuaKel(!modalVisibleKetuaKel);
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
                            <View style={{flex: 1, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF'}}>
                                <ScrollView style={{borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10, justifyContent: 'space-around'}}>
                                        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Pencairan Pembiayaan </Text>
                                        <Text style={{fontSize: 14}}>Saya yang bertanda Tangan dibawah ini:{"\n"}{"\n"}
                                        Nama         :  SRI RAHAYU{"\n"}
                                        Dengan ini menyatakan telah menerima pembiayaan
                                        sebesar: 3.000.000 rupiah, dan bersedia untuk
                                        bertanggung jawab sampai pelunasan pembiayaan,
                                        serta mematuhi dan menerima semua keputusan / peraturan
                                        yang berlaku di PT. Permodalan Nasional Madani.{"\n"}{"\n"}

                                        Hari            :  Senin {"\n"}
                                        Tanggal      :  14-Juni-2021 {"\n"}
                                        Jam            :  13.24 {"\n"}
                                        Kelompok    :  Gang Kelinci {"\n"}</Text>
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
                                                <Text style={{ fontWeight: 'bold' }}>{aoName}</Text>
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
                                                <Text style={{ fontWeight: 'bold' }}>{aoName}</Text>
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


                                    <View style={{alignItems: 'center', flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
                                        <CheckBox
                                            value={isSelected}
                                            onValueChange={setSelection}
                                            style={styles.checkbox}
                                        />
                                        <Text style={styles.label}>Sudah Dicairkan</Text>
                                    </View>

                                    <View style={{alignItems: 'center', marginBottom: 20, marginTop: 20}}>
                                        <Button
                                            title="SIMPAN"
                                            onPress={() => navigation.navigate("Siklus")}
                                            buttonStyle={{backgroundColor: '#003049', width: dimension.width/2}}
                                            titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                                        />
                                    </View>
                                
                                </ScrollView>
                            </View>
                        )}

                        {/* <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Pencairan Pembiayaan </Text>
                            <Text style={{fontSize: 14}}>Saya yang bertanda Tangan dibawah ini:{"\n"}{"\n"}
                            Nama         :  SRI RAHAYU{"\n"}
                            Dengan ini menyatakan telah menerima pembiayaan
                            sebesar: 3.000.000 rupiah, dan bersedia untuk
                            bertanggung jawab sampai pelunasan pembiayaan,
                            serta mematuhi dan menerima semua keputusan / peraturan
                            yang berlaku di PT. Permodalan Nasional Madani.{"\n"}{"\n"}

                            Hari            :  Senin {"\n"}
                            Tanggal      :  14-Juni-2021 {"\n"}
                            Jam            :  13.24 {"\n"}
                            Kelompok    :  Gang Kelinci {"\n"}</Text>
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
                                    <Text style={{ fontWeight: 'bold' }}>{aoName}</Text>
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
                                    <Text style={{ fontWeight: 'bold' }}>{aoName}</Text>
                                </View>
                            </Card>
                        </View>

                        <View style={{alignItems: 'center', flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
                            <CheckBox
                                value={isSelected}
                                onValueChange={setSelection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.label}>Sudah Dicairkan</Text>
                        </View>

                        <View style={{alignItems: 'center', marginBottom: 20, marginTop: 20}}>
                            <Button
                                title="SIMPAN"
                                onPress={() => navigation.navigate("Siklus")}
                                buttonStyle={{backgroundColor: '#003049', width: dimension.width/2}}
                                titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                            />
                        </View> */}
                    {/* </ScrollView>
            </View> */}
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