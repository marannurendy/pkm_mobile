import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, Modal, FlatList, SafeAreaView, TouchableWithoutFeedback, ScrollView, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import { Card, Divider } from 'react-native-elements';
import SignatureScreen from "react-native-signature-canvas";
import { Button } from 'react-native-elements';

import db from '../../database/Database'

const window = Dimensions.get('window');

const Perjanjian = ({route}) => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
    let [aoName, setAoName] = useState();
    let [menuShow, setMenuShow] = useState(0);
    let [menuToggle, setMenuToggle] = useState(false);
    let [data, setData] = useState([]);
    let [dataNasabah, setDataNasabah] = useState(route.params.data);
    let [postPencairan, setPostPencairan] = useState();
    const [modalVisibleAO, setModalVisibleAO] = useState(false);
    const [modalVisibleNasabah, setModalVisibleNasabah] = useState(false);
    const [signatureAO, setSignatureAO] = useState();
    const [signatureNasabah, setSignatureNasabah] = useState();
    moment.locale('id');
    var hariIni = moment(new Date()).format('DD-MM-YYYY')

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

    const submitHandler = () => {
        console.log(postPencairan)
        navigation.navigate("FinalPencairan", {data: dataNasabah, postPencairan: postPencairan})
    }

    function ModalSignAO(text, onOK){

        const ref = useRef();

        const handleOK = (signature) => {
            setSignatureAO(signature)
            setModalVisibleAO(!modalVisibleAO);
            setPostPencairan({...postPencairan, "TTD_KC":signature})
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
            setPostPencairan({...postPencairan, "TTD_Nasabah":signature})
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
                visible={modalVisibleAO}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleAO(!modalVisibleAO);
                }}
            >
                {ModalSignAO()}
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

            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView>
                        <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Perjanjian Pembiayaan</Text>
                            <Text style={{fontSize: 14}}>Perjanjian Pembiayaan ini dibuat dan ditandatangani di {<Text style={{fontSize: 14, color:"#0645AD"}}>Jakarta </Text>} 
                            pada tanggal {<Text style={{fontSize: 14, color:"#0645AD"}}>{hariIni}</Text>}  oleh dan antara:{"\n"}{"\n"}
                            1. PT. Permodalan Nasional Madani, berkedudukan 
                            dan berkantor pusat di Jakarta, dalam hal ini diwakili oleh 
                            {<Text style={{fontSize: 14, color:"#0645AD"}}>{" "+aoName}</Text>} selaku Kepala Cabang/SAO Mekaar, selanjutnya 
                            disebut PNM.{"\n"}{"\n"}
                            2. <Text style={{fontSize: 14, color:"#0645AD"}}>{dataNasabah.Nama_Prospek} </Text> 
                            bertempat Tinggal <Text style={{fontSize: 14, color:"#0645AD"}}>{dataNasabah.Alamat_Domisili}, </Text> 
                            KTP No. <Text style={{fontSize: 14, color:"#0645AD"}}>{dataNasabah.Nomor_Identitas}</Text>,
                            selanjutnya disebut Nasabah.{"\n"}{"\n"}
                            Nasabah dengan persetujuan penjamin, yaitu <Text style={{fontSize: 14, color:"#0645AD"}}>{dataNasabah.Nama_Penjamin}</Text>, 
                            sebagaimana dalam permohonan pembiayaan, telah 
                            menerima fasilitas pembiayaan dari PNM 
                            dengan ketentuan sebagai berikut:{"\n"}
                            a. Jumlah Pembiayaan            :  <Text style={{fontSize: 14, color:"#0645AD"}}>{dataNasabah.Jumlah_Pinjaman}</Text> {"\n"}
                            b. Jenis Pembiayaan                 :  <Text style={{fontSize: 14, color:"#0645AD"}}>{dataNasabah.Jenis_Pembiayaan}</Text> {"\n"}
                            c. Jasa                                             :  <Text style={{fontSize: 14, color:"#0645AD"}}>{dataNasabah.Jasa}</Text> {"\n"}
                            d. Jangka Waktu                         :  <Text style={{fontSize: 14, color:"#0645AD"}}>{(parseInt(dataNasabah.Jumlah_Pinjaman) + parseInt(dataNasabah.Jasa)) / parseInt(dataNasabah.Angsuran_Per_Minggu)} Minggu</Text> {"\n"}
                            e. Angsuran per Minggu          :  <Text style={{fontSize: 14, color:"#0645AD"}}>{dataNasabah.Angsuran_Per_Minggu}</Text> {"\n"}{"\n"}

                            Kewajiban Nasabah{"\n"}
                            a. Hadir tepat waktu dalam pertemuan Kelompok{"\n"}
                            b. Membayar angsuran Mingguan sesuai kewajiban{"\n"}
                            c. Menggunakan pembiayaan ini untuk Modal Usaha{"\n"}
                            d. Hasil usaha untuk kesejahteraan bangsa{"\n"}
                            e. Bertanggung jawab bersama, bila ada nasabah dalam
                                kelompok yang tidak memenuhi kewajiban{"\n"}
                            f. Mematuhi, menerima semua keputusan/peraturan yang
                            berlaku di PNM{"\n"}
                            g. Menyetujui penggunaan Dana Titipan dan/atau Uang
                                Pertanggungjawaban oleh PNM sebagai pelunasan
                                apabila timbul tunggakan pinjaman.{"\n"}
                            h. Menyetujui pengelolaan uang titipan sukarela dan/atau
                                Uang Pertanggungjawaban dalam jangka waktu tertentu
                                dilakukan oleh PNM apabila karena sebab apapun,
                                nasabah/ahli waris nasabah tidak dapat ditemui/menolak
                                pengembalian.{"\n"}
                            i. Menyetujui segala konsekuensi biaya yang timbul terkait
                            dengan pengelolaan uang titipan sukarela dan/atau Uang
                            Pertanggungjawaban sebagai dimaksud pada huruf h.{"\n"}{"\n"}
                            Kewajiban PNM{"\n"}
                            a. Memberikan pembiayaan Modal Usaha{"\n"}
                            b. Mengembalikan Dana Titipan dan Uang
                                Pertanggungjawaban setelah melunasi pinjaman{"\n"}
                            c. Menginformasikan sisa Dana Titipan dan Uang
                            Pertanggungjawaban setelah dikurangi tunggakan
                            pinjaman yang timbul.{"\n"}{"\n"}
                            
                            Setiap perselisihan akan diselesaikan secara musyawarah
                            mufakat dan para pihak sepakat memilih domisili hokum
                            dan kantor panitera Pengadilan Negeri di seluruh wilayah
                            Hukum Negara Indonesia. Perjanjian ini telah disesuaikan
                            dengan ketentuan peraturan perundang-undangan termasuk
                            peraturan Otoritas Jasa Keuangan.</Text>
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
                                    <Text style={{ fontWeight: 'bold' }}>Tanda Tangan KC/SAO(*)</Text>
                                    <View style={{borderWidth: 1, marginVertical: 5, borderRadius: 10}}>
                                        <Button 
                                            icon={ <FontAwesome5 name="signature" size={15} color="white" style={{marginHorizontal: 10}} />} 
                                            title= {signatureAO === undefined ? "Add Signature" : "Change Signature" }  
                                            buttonStyle= {{margin: 10, backgroundColor: signatureAO === undefined ? '#2196F3' : '#ff6347'}}
                                            onPress={() => setModalVisibleAO(!modalVisibleAO)}
                                        />
                                        <Card.Image source={{uri: signatureAO}} style={{margin: 10}} />
                                    </View>
                                    <Text style={{ fontWeight: 'bold' }}>{aoName}</Text>
                                </View>
                            </Card>
                            <View style={{alignItems: 'center', marginBottom: 20, marginTop: 20}}>
                                <Button
                                    title="SIMPAN"
                                    onPress={() => submitHandler()}
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

export default Perjanjian

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