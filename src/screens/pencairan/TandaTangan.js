import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, ToastAndroid, Modal, FlatList, SafeAreaView, TouchableWithoutFeedback, ScrollView, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import ActionButton from 'react-native-action-button'
import { scale, verticalScale } from 'react-native-size-matters'
import { Card, Divider } from 'react-native-elements';
import SignatureScreen from "react-native-signature-canvas";
import { Button } from 'react-native-elements';
import bismillah from '../../images/bismillah.png';

import db from '../../database/Database'

const window = Dimensions.get('window');

const TandaTanganPencairan = ({route}) => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()
    var uniqueNumber = (new Date().getTime()).toString(36);
    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
    let [aoName, setAoName] = useState();
    let [menuShow, setMenuShow] = useState(0);
    let [menuToggle, setMenuToggle] = useState(false);
    let [data, setData] = useState([]);
    let [dataIDProspek, setDataIDProspek] = useState([]);
    let [NamaKelompok, setNamaKelompok] = useState(route.params.dataKelompok);
    let [idNasabah, setidNasabah] = useState();
    let [dataNasabah, setDataNasabah] = useState(route.params.data);
    const [keyword, setKeyword] = useState('');
    const [modalVisibleKetuaKel, setModalVisibleKetuaKel] = useState(false);
    const [modalVisibleNasabah, setModalVisibleNasabah] = useState(false);
    const [signatureKetuaKel, setSignatureKetuaKel] = useState();
    const [signatureNasabah, setSignatureNasabah] = useState();
    const [key_tandaTanganSAOKCLRP, setKey_tandaTanganSAOKCLRP] = useState(`formUK_tandaTanganSAOKCLRP_${uniqueNumber}_${dataNasabah}_${uniqueNumber}`);
    const [key_tandaTanganNasabahLRP, setKey_tandaTanganNasabahLRP] = useState(`formUK_tandaTanganNasabahLRP_${uniqueNumber}_${dataNasabah}_${uniqueNumber}`);

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
        getListNasabah();
        getUserData();
    }, []);

    const getListNasabah = async () => {
        let a = await AsyncStorage.getItem("Kelompok_id_Pencairan");
        if (__DEV__) console.log('getListNasabah loaded');
        if (__DEV__) console.log('getListNasabah keyword');

        let query = 'SELECT A.*, B.* FROM Table_Pencairan A LEFT JOIN ' +  
                    'Table_Pencairan_Post B on A.Kelompok_ID = B.kelompok_Id WHERE A.Kelompok_ID = "'+ a +'"';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('getListNasabah results:', results.rows.length);
                    let dataLength = results.rows.length
                    var ah = []
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({'ID_Prospek' : data.ID_Prospek});
                        console.log(data)
                    }
                    setDataIDProspek(ah)
                })
            }
        )
    }

    const getListNasabahLocal = (ah) => {
        if (__DEV__) console.log('getListNasabah loaded');
        if (__DEV__) console.log('getListNasabah keyword');
        var bah = []
        console.log(ah)
        if(ah.length > 0 && signatureKetuaKel != undefined && signatureNasabah != undefined){
            for(let i = 0; i < ah.length; i++){
                let query = 'SELECT * FROM Table_Pencairan_Post WHERE ID_Prospek = "'+ ah[i].ID_Prospek +'"';
                db.transaction(
                    tx => {
                        tx.executeSql(query, [], (tx, results) => {
                            if (__DEV__) console.log('getListNasabah results:', results.rows.length);
                            let dataLength = results.rows.length
                            for(let a = 0; a < dataLength; a++) {
                                let data = results.rows.item(a);
                                console.log(data.ID_Prospek)
                                bah.push({'ID_Prospek' : data.ID_Prospek});
                            }
                        })
                    }
                )
            }
        }else{
            ToastAndroid.show("Silahkan Isi Tanda Tangan", ToastAndroid.SHORT);
        }
    }

    const doSubmitDraft = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('ACTIONS UPDATE DATA PENCAIRAN LOCAL');
            try{
                if(dataIDProspek.length > 0){
                    for(let a = 0; a < dataIDProspek.length; a++) {
                        console.log(key_tandaTanganSAOKCLRP, key_tandaTanganNasabahLRP, dataIDProspek)
                        let query = 'UPDATE Table_Pencairan_Post SET LRP_TTD_AO = "' + key_tandaTanganSAOKCLRP + '", LRP_TTD_Nasabah = "' + key_tandaTanganNasabahLRP + '" WHERE ID_Prospek = "' + dataIDProspek[a].ID_Prospek + '"';
                        console.log(query)
                        db.transaction(
                            tx => {
                                tx.executeSql(query)
                            }, function(error) {
                                alert(error)
                            }
                        )
                    }
                    if (source !== 'submit') ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                    navigation.navigate("FlowPencairan", {kelompok_Id:dataNasabah, Open:2})
                }
            }
            catch(error){
                alert(error)
            }
    });

    function ModalSignKetuaKel(text, onOK){

        const ref = useRef();

        const handleOK = (signature) => {
            setSignatureKetuaKel(signature)
            setModalVisibleKetuaKel(!modalVisibleKetuaKel);
            AsyncStorage.setItem(key_tandaTanganSAOKCLRP, signature.split(',')[1])
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
                            <Text style={{ alignSelf: 'center', margin: 20, fontSize: 18, fontWeight: 'bold' }}>Tanda Tangan KC/SAO</Text>
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
            AsyncStorage.setItem(key_tandaTanganNasabahLRP, signature.split(',')[1])
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
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{NamaKelompok}</Text>
                </ImageBackground>
            </View>

            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView>
                        <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Tanda Tangan LRP</Text>
                            <Card>
                                <Card.Divider />
                                <View style={{marginBottom: 10}}>
                                    <Text style={{ fontWeight: 'bold' }}>Tanda Tangan {"\n"}Ketua Kelompok</Text>
                                    <View style={{borderWidth: 1, marginVertical: 5, borderRadius: 10}}>
                                        <Button 
                                            icon={ <FontAwesome5 name="signature" size={15} color="white" style={{marginHorizontal: 10}} />} 
                                            title= {signatureNasabah === undefined ? "Add Signature" : "Change Signature" }  
                                            buttonStyle= {{margin: 10, backgroundColor: signatureNasabah === undefined ? '#2196F3' : '#ff6347'}}
                                            onPress={() => setModalVisibleNasabah(!modalVisibleNasabah)}
                                        />
                                        <Card.Image source={{uri: signatureNasabah}} style={{margin: 10}} />
                                    </View>
                                    <Text style={{ fontWeight: 'bold', fontStyle:'italic', color:'#D0342C' }}>*Isi tanda tangan dengan benar</Text>
                                </View>
                                <View style={{marginBottom: 10}}>
                                    <Text style={{ fontWeight: 'bold' }}>Tanda Tangan {"\n"}Account Officer / SAO / KC</Text>
                                    <View style={{borderWidth: 1, marginVertical: 5, borderRadius: 10}}>
                                        <Button 
                                            icon={ <FontAwesome5 name="signature" size={15} color="white" style={{marginHorizontal: 10}} />} 
                                            title= {signatureKetuaKel === undefined ? "Add Signature" : "Change Signature" }  
                                            buttonStyle= {{margin: 10, backgroundColor: signatureKetuaKel === undefined ? '#2196F3' : '#ff6347'}}
                                            onPress={() => setModalVisibleKetuaKel(!modalVisibleKetuaKel)}
                                        />
                                        <Card.Image source={{uri: signatureKetuaKel}} style={{margin: 10}} />
                                    </View>
                                    <Text style={{ fontWeight: 'bold', fontStyle:'italic', color:'#D0342C' }}>*Isi tanda tangan dengan benar</Text>
                                    <Text style={{ fontWeight: 'bold' }}>{aoName}</Text>
                                </View>
                            </Card>
                            <View style={{alignItems: 'center', marginBottom: 20, marginTop: 20}}>
                                <Button
                                    title="SIMPAN"
                                    onPress={() => doSubmitDraft()}
                                    buttonStyle={{backgroundColor: '#003049', width: dimension.width/2}}
                                    titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>
    )
}

export default TandaTanganPencairan

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
})