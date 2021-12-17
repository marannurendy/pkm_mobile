import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, Modal, FlatList, SafeAreaView, TouchableWithoutFeedback, ScrollView, Image } from 'react-native'
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

const AkadWakalah = ({route}) => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
    let [aoName, setAoName] = useState();
    let [menuShow, setMenuShow] = useState(0);
    let [menuToggle, setMenuToggle] = useState(false);
    let [data, setData] = useState([]);
    let [akadmenu, setakadmenu] = useState(0);
    let [dataNasabah, setDataNasabah] = useState();
    const [keyword, setKeyword] = useState('');
    const [modalVisibleAO, setModalVisibleAO] = useState(false);
    const [modalVisibleNasabah, setModalVisibleNasabah] = useState(false);
    const [signatureAO, setSignatureAO] = useState();
    const [signatureNasabah, setSignatureNasabah] = useState();

    useEffect(() => {
        setDataNasabah(route.params.data)
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
        getSosialisasiDatabase();

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

    const getSosialisasiDatabase = () => {
        if (__DEV__) console.log('getSosialisasiDatabase loaded');
        if (__DEV__) console.log('getSosialisasiDatabase keyword:', keyword);

        let query = 'SELECT lokasiSosialisasi, COUNT(namaCalonNasabah) as jumlahNasabah FROM Sosialisasi_Database WHERE lokasiSosialisasi LIKE "%'+ keyword +'%" GROUP BY lokasiSosialisasi';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('getSosialisasiDatabase results:', results.rows);
                    let dataLength = results.rows.length
                    var ah = []
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({'groupName' : data.lokasiSosialisasi, 'Nomor': '08-09-2021'});
                    }
                    setData([{'groupName' :'Vina binti Supardi', 'Nomor': '900900102/3000000/25'}]);
                })
            }
        )
    }
    
    // Simpan Handler
    const submitHandler = () => {
        navigation.navigate("FinalPencairan", {data: dataNasabah})
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
            {akadmenu == 0 ?(
            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView>
                        <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Akad Wakalah </Text>
                            <Image style={{width: '100%', height: 75, resizeMode : 'contain', marginBottom: 10 }} 
                            source={bismillah}/>
                            <Text style={{fontSize: 14}}>Pada hari ini :{"\n"}
                            {<Text style={{fontSize: 14, color:"#0645AD"}}>Kamis{"\n"}</Text>}
                            Tanggal : {"\n"}{<Text style={{fontSize: 14, color:"#0645AD"}}>01/07/2021{"\n"}</Text>}
                            PNM memberikan kuasa kepada nasabah untuk membeli
                                    barang-barang berupa (terlampir):</Text>
                            <TextInput 
                                placeholder={"Wadah, Tepung Terigu dll"} 
                                style={{flex: 1, padding: 5, borderRadius:3, borderWidth:1, marginBottom:5, marginTop:5}}
                                // onChangeText={(value) => {
                                //     searchHandler(value, memberList)
                                // }}
                                returnKeyType="done"
                            />
                            <Text style={{fontSize: 14}}>Seharga (harga beli){"\n"}
                            Rp. 2.000.000{"\n"}
                            Terbilang{"\n"}
                            Dua juta rupiah{"\n"}
                            sesuai dengan kebutuhannya. Kuasa ini diberikan dengan
                            hak subtitusi. PNM dan Nasabah dengan ini menyatakan
                            sepakat atas hak dan kewajiban dalam akad ini. Akad ini
                            merupakan satu kesatuan dengan Akad Murabahah dan
                            Akad Wadiah Nasabah yang bersangkutan. Hal-hal yang
                            belum Lengkap dan belum jelas akan dibicarakan dan
                            dibahas secara musyawarah dan kekeluargaan.</Text>
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
                                    <Text style={{ fontWeight: 'bold' }}>{route.params.data.kelName}</Text>
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
                                    onPress={() => setakadmenu(1)}
                                    buttonStyle={{backgroundColor: '#003049', width: dimension.width/2}}
                                    titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
            ) : (
                <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView>
                        <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Akad Murabahah </Text>
                            <Image style={{width: '100%', height: 75, resizeMode : 'contain', marginBottom: 10 }} 
                            source={bismillah}/>
                            <Text style={{fontSize: 14}}>Akad Murabahah ini dibuat dan ditandatangani di {<Text style={{fontSize: 14, color:"#0645AD"}}>Jakarta </Text>} 
                            pada tanggal {<Text style={{fontSize: 14, color:"#0645AD"}}>14 Juni 2021</Text>}  oleh dan antara:{"\n"}{"\n"}
                            1. PT. Permodalan Nasional Madani, berkedudukan 
                            dan berkantor pusat di Jakarta, dalam hal ini diwakili oleh 
                            Istiqomah selaku Kepala Cabang/SAO Mekaar, selanjutnya 
                            disebut PNM.{"\n"}{"\n"}
                            2. Sri Rahayu bertempat Tinggal di JL. Mamalia Raya Gang
                            Kelinci No. 4, RT 04 RW 10, KTP No. 3674000100020003,
                            selanjutnya disebut Nasabah.{"\n"}{"\n"}
                            Nasabah dengan perseyujuan penjamin, yaitu Ahmad Sanusi, 
                            sebagaimana dalam permohonan pembiayaan, telah 
                            menerima fasilitas pembiayaan Murabahah dari PNM 
                            dengan ketentuan sebagai berikut:{"\n"}
                            a. Harga Beli Barang                : 3.000.000 {"\n"}
                            b. Margin                                   : 250.000 {"\n"}
                            c. Harga Jual Barang               : 3.250.000 {"\n"}
                            d. Jangka Waktu                      : 25 Minggu {"\n"}
                            e. Angsuran per Minggu          : 150.000 {"\n"}{"\n"}

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
            )}
            
        </View>
    )
}

export default AkadWakalah

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