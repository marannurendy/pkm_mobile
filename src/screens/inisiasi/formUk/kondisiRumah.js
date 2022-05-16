import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, ScrollView, ToastAndroid, ActivityIndicator, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from './styles';
import { RadioButton } from 'react-native-paper';
import db from '../../../database/Database';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Picker } from '@react-native-picker/picker';
import { Camera } from 'expo-camera'

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const dataPilihan = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' }
];
const withTextInput = dimension.width - (20 * 4) + 8;

const InisiasiFormUKKondisiRumah = ({ route }) => {
    const uniqueNumber = (new Date().getTime()).toString(36);
    const { id, groupName, namaNasabah, screenState, statusSosialisasi } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [openLuasBangunan, setOpenLuasBangunan] = useState(false);
    const [valueLuasBangunan, setValueLuasBangunan] = useState(null);
    const [itemsLuasBangunan, setItemsLuasBangunan] = useState([]);
    const [openKondisiBangunan, setOpenKondisiBangunan] = useState(false);
    const [valueKondisiBangunan, setValueKondisiBangunan] = useState(null);
    const [itemsKondisiBangunan, setItemsKondisiBangunan] = useState([]);
    const [openJenisAtap, setOpenJenisAtap] = useState(false);
    const [valueJenisAtap, setValueJenisAtap] = useState(null);
    const [itemsJenisAtap, setItemsJenisAtap] = useState([]);
    const [openDinding, setOpenDinding] = useState(false);
    const [valueDinding, setValueDinding] = useState(null);
    const [itemsDinding, setItemsDinding] = useState([]);
    const [openLantai, setOpenLantai] = useState(false);
    const [valueLantai, setValueLantai] = useState(null);
    const [itemsLantai, setItemsLantai] = useState([]);
    const [valueAksesAirBersih, setValueAksesAirBersih] = useState(true);
    const [valueKamarMandi, setValueKamarMandi] = useState(true);
    const [submmitted, setSubmmitted] = useState(false);
    const [dataDwellingCondition, setDataDwellingCondition] = useState([]);
    const [loading, setLoading] = useState(false)
    const [buttonCam, setButtonCam] = useState(false)
    const camera = useRef(null)
    const [fotoRumah, setFotoRumah] = useState(undefined)
    const [key_fotoRumah, setKey_fotoRumah] = useState(`formUK_KondisiRumah_${uniqueNumber}_${namaNasabah.replace(/\s+/g, '')}`);
    const [cameraShow, setCameraShow] = useState(0)
    const [fotoRAB, setFotoRAB] = useState(undefined)
    const [key_fotoRAB, setKey_fotoRAB] = useState(`formUK_KondisiRAB_${uniqueNumber}_${namaNasabah.replace(/\s+/g, '')}`);
    const [cameraShowRAB, setCameraShowRAB] = useState(0)
    const [idProduk, setIdProduk] = useState(null)
    

    useEffect(() => {
        setInfo();
        getStorageDwellingCondition();
        getUKKondisiRumah();
    }, []);

    const setInfo = async () => {
        const getNamaProduk = await AsyncStorage.getItem('NamaProduk')
        console.log('getNamaProduk ==========>',getNamaProduk)
        alert('getNamaProduk ==========>',getNamaProduk)
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        const getNamaProduk = await AsyncStorage.getItem('NamaProduk')
        getNamaProduk == null ? await AsyncStorage.setItem('NamaProduk', '') : getNamaProduk
        setIdProduk(getNamaProduk)
        setCurrentDate(tanggal)
    }

    const getUKKondisiRumah = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_KondisiRumah WHERE idSosialisasiDatabase = '` + id + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_KondisiRumah length:', dataLength);
                    if (dataLength > 0) {
                        
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data:', data);

                        const setLuasBangunan = () => {
                            if (__DEV__) console.log('setLuasBangunan loaded');
                            return new Promise((resolve, reject) => {
                                if (data.luas_Bangunan !== null && typeof data.luas_Bangunan !== 'undefined') {
                                    setTimeout(() => {
                                        setValueLuasBangunan(data.luas_Bangunan);
                                        return resolve('next');
                                    }, 1000);
                                }
                                return resolve('next');
                            });
                        }

                        const setKondisiBangunan = () => {
                            if (__DEV__) console.log('setKondisiBangunan loaded');
                            return new Promise((resolve, reject) => {
                                if (data.kondisi_Bangunan !== null && typeof data.kondisi_Bangunan !== 'undefined') {
                                    setTimeout(() => {
                                        setValueKondisiBangunan(data.kondisi_Bangunan);
                                        return resolve('next');
                                    }, 1500);
                                }
                                return resolve('next');
                            });
                        }

                        const setJenisAtap = () => {
                            if (__DEV__) console.log('setJenisAtap loaded');
                            return new Promise((resolve, reject) => {
                                if (data.jenis_Atap !== null && typeof data.jenis_Atap !== 'undefined') {
                                    setTimeout(() => {
                                        setValueJenisAtap(data.jenis_Atap);
                                        return resolve('next');
                                    }, 2000);
                                }
                                return resolve('next');
                            });
                        }

                        const setDinding = () => {
                            if (__DEV__) console.log('setDinding loaded');
                            return new Promise((resolve, reject) => {
                                if (data.dinding !== null && typeof data.dinding !== 'undefined') {
                                    setTimeout(() => {
                                        setValueDinding(data.dinding);
                                        return resolve('next');
                                    }, 2500);
                                }
                                return resolve('next');
                            });
                        }

                        const setLantai = () => {
                            if (__DEV__) console.log('setDinding loaded');
                            return new Promise((resolve, reject) => {
                                if (data.lantai !== null && typeof data.lantai !== 'undefined') {
                                    setTimeout(() => {
                                        setValueLantai(data.lantai);
                                        return resolve('next');
                                    }, 3000);
                                }
                                return resolve('next');
                            });
                        }

                        const setRumah = () => {
                            if (__DEV__) console.log('setFotoRumah');
                            return new Promise((resolve, reject) => {
                                if (data.foto_rumah !== null && typeof data.foto_rumah !== 'undefined') {
                                    setTimeout(() => {
                                        setFotoRumah(data.foto_rumah);
                                        return resolve('next');
                                    }, 3500);
                                }
                                return resolve('next');
                            });
                        }

                        const setRumahRAB = () => {
                            if (__DEV__) console.log('setRumahRAB');
                            return new Promise((resolve, reject) => {
                                if (data.foto_rumah_rab !== null && typeof data.foto_rumah_rab !== 'undefined') {
                                    setTimeout(() => {
                                        setFotoRAB(data.foto_rumah_rab);
                                        return resolve('next');
                                    }, 4000);
                                }
                                return resolve('next');
                            });
                        }


                        Promise.all([setLuasBangunan(), setKondisiBangunan(), setJenisAtap(), setDinding(), setLantai(), setRumah(), setRumahRAB()]).then((response) => {
                            if (data.sanitasi_Akses_AirBersih !== null && typeof data.sanitasi_Akses_AirBersih !== 'undefined') setValueAksesAirBersih(data.sanitasi_Akses_AirBersih === 'true' ? true : false);
                            if (data.sanitasi_KamarMandi !== null && typeof data.sanitasi_KamarMandi !== 'undefined') setValueKamarMandi(data.sanitasi_KamarMandi === 'true' ? true : false);
                        });
                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_KondisiRumah error:', error.message);
                })
            }
        )
    }

    const getStorageDwellingCondition = async () => {
        if (__DEV__) console.log('getStorageDwellingCondition loaded');

        try {
            const response = await AsyncStorage.getItem('DwellingCondition');
            if (response !== null) {
                const responseJSON = JSON.parse(response);
                if (responseJSON.length > 0 ?? false) {
                    setDataDwellingCondition(responseJSON);
                    return;
                }
            }
            setDataDwellingCondition([]);
        } catch (error) {
            setDataDwellingCondition([]);
        }
    }

    const doSubmitDraft = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('doSubmitDraft loaded');
        if (__DEV__) console.log('doSubmitDraft valueLuasBangunan:', valueLuasBangunan);
        if (__DEV__) console.log('doSubmitDraft valueKondisiBangunan:', valueKondisiBangunan);
        if (__DEV__) console.log('doSubmitDraft valueJenisAtap:', valueJenisAtap);
        if (__DEV__) console.log('doSubmitDraft valueDinding:', valueDinding);
        if (__DEV__) console.log('doSubmitDraft valueLantai:', valueLantai);
        if (__DEV__) console.log('doSubmitDraft valueAksesAirBersih:', valueAksesAirBersih);
        if (__DEV__) console.log('doSubmitDraft valueKamarMandi:', valueKamarMandi);

        const find = 'SELECT * FROM Table_UK_KondisiRumah WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], async (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);
                    const fotoRumahBase64 = await AsyncStorage.getItem(key_fotoRumah)
                    const fotoRumahRABBase64 = await AsyncStorage.getItem(key_fotoRAB)
                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_KondisiRumah (nama_lengkap, luas_Bangunan, kondisi_Bangunan, jenis_Atap, dinding, lantai, sanitasi_Akses_AirBersih, sanitasi_KamarMandi, idSosialisasiDatabase, foto_rumah, foto_rumah_rab) values ("' + namaNasabah + '","' + valueLuasBangunan + '","' + valueKondisiBangunan + '","' + valueJenisAtap + '","' + valueDinding + '","' + valueLantai + '","' + valueAksesAirBersih + '","' + valueKamarMandi + '","' + id + '","' + fotoRumahBase64 + '","' + fotoRumahRABBase64 + '" )';
                    } else {
                        query = 'UPDATE Table_UK_KondisiRumah SET luas_Bangunan = "' + valueLuasBangunan + '", kondisi_Bangunan = "' + valueKondisiBangunan + '", jenis_Atap = "' + valueJenisAtap + '", dinding = "' + valueDinding + '", lantai = "' + valueLantai + '", sanitasi_Akses_AirBersih = "' + valueAksesAirBersih + '", sanitasi_KamarMandi = "' + valueKamarMandi + '", foto_rumah = "' + fotoRumahBase64 + '", foto_rumah_rab = "' + fotoRumahRABBase64 + '" WHERE idSosialisasiDatabase = "' + id + '"';
                    }

                    if (__DEV__) console.log('doSubmitDraft db.transaction insert/update query:', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitDraft db.transaction insert/update error:', error.message);
                            return resolve(true);
                        },function() {
                            if (__DEV__) console.log('doSubmitDraft db.transaction insert/update success');
                            if (source !== 'submit') ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                            if (__DEV__) {
                                db.transaction(
                                    tx => {
                                        tx.executeSql("SELECT * FROM Table_UK_KondisiRumah", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_KondisiRumah RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_KondisiRumah ERROR:', error);
                                    }, function() {}
                                );
                            }
                            return resolve(true);
                        }
                    );
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDraft db.transaction find error:', error.message);
                    return resolve(true);
                })
            }
        );
    })

    const doSubmitSave = async () => {
        if (__DEV__) console.log('doSubmitSave loaded');

        if (!valueLuasBangunan || typeof valueLuasBangunan === 'undefined' || valueLuasBangunan === '' || valueLuasBangunan === 'null') return alert('Luas Bangunan (*) tidak boleh kosong');
        if (!valueKondisiBangunan || typeof valueKondisiBangunan === 'undefined' || valueKondisiBangunan ==='' || valueKondisiBangunan === 'null') return alert('Kondisi Bangunan (*) tidak boleh kosong');
        if (!valueJenisAtap || typeof valueJenisAtap === 'undefined' || valueJenisAtap ==='' || valueJenisAtap === 'null') return alert('Jenis Atap (*) tidak boleh kosong');
        if (!valueDinding || typeof valueDinding === 'undefined' || valueDinding ==='' || valueDinding === 'null') return alert('Dinding (*) tidak boleh kosong');
        if (!valueLantai || typeof valueLantai === 'undefined' || valueLantai ==='' || valueLantai === 'null') return alert('Lantai (*) tidak boleh kosong');
        if (!fotoRumah || typeof fotoRumah === 'undefined' || fotoRumah ==='' || fotoRumah === 'null') return alert('Foto Rumah (*) tidak boleh kosong');

        if (submmitted) return true;

        setSubmmitted(true);

        await doSubmitDraft('submit');

        const find = 'SELECT * FROM Table_UK_Master WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    if (dataLengthFind === 0) {
                        alert('UK Master not found');
                        navigation.goBack();
                        return;
                    }

                    if (screenState === 2) {
                        let query = 'UPDATE Table_UK_Master SET status = "3" WHERE idSosialisasiDatabase = "' + id + '"';
                        if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update query:', query);

                        db.transaction(
                            tx => {
                                tx.executeSql(query);
                            }, function(error) {
                                if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update error:', error.message);
                                setSubmmitted(false);
                            },function() {
                                if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update success');
                                
                                if (__DEV__) {
                                    db.transaction(
                                        tx => {
                                            tx.executeSql("SELECT * FROM Table_UK_Master", [], (tx, results) => {
                                                if (__DEV__) console.log('SELECT * FROM Table_UK_Master RESPONSE:', results.rows);
                                            })
                                        }, function(error) {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_Master ERROR:', error);
                                        }, function() {}
                                    );
                                }
                            }
                        );
                    }

                    setSubmmitted(false);
                    alert('Berhasil');
                    navigation.goBack();
                    
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction find error:', error.message);
                    setSubmmitted(false);
                })
            }
        );
    }

    const renderHeader = () => (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('Inisiasi')}>
                    <View style={{ flexDirection: 'row', alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, paddingHorizontal: 8 }}>
                        <MaterialCommunityIcons name="home" size={30} color="#2e2e2e" />
                        <Text>INISIASI</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.headerBoxImageBackground}>
                <ImageBackground source={images.banner} style={styles.headerImageBackground} imageStyle={{ borderRadius: 20 }}>
                    <Text style={[styles.headerText, { fontSize: 30 }]}>Form Uji Kelayakan</Text>
                    <Text style={[styles.headerText, { fontSize: 20 }]}>{groupName}</Text>
                    <Text style={[styles.headerText, { fontSize: 15 }]}>{namaNasabah}</Text>
                    <Text style={[styles.headerText, { fontSize: 15 }]}>{currentDate}</Text>
                    {/* <Text style={[styles.headerText, { fontSize: 15 }]}>{id}</Text> */}
                </ImageBackground>
            </View>
        </>
    )

    const renderFormLuasBangunan = () => (
        <View style={styles.MT8}>
            <Text>Luas Bangunan (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueLuasBangunan}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValueLuasBangunan(itemValue)}
                >
                    <Picker.Item label={'-- Pilih --'} value={null} />
                    {dataDwellingCondition.filter(data => data.category === 'Luas Bangunan').map((x, i) => <Picker.Item key={i} label={x.categoryDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKondisiBangunan = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Bangunan (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKondisiBangunan}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValueKondisiBangunan(itemValue)}
                >
                    <Picker.Item label={'-- Pilih --'} value={null} />
                    {dataDwellingCondition.filter(data => data.category === 'Kondisi Bangunan').map((x, i) => <Picker.Item key={i} label={x.categoryDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormJenisAtap = () => (
        <View style={styles.MT8}>
            <Text>Jenis Atap (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueJenisAtap}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValueJenisAtap(itemValue)}
                >
                    <Picker.Item label={'-- Pilih --'} value={null} />
                    {dataDwellingCondition.filter(data => data.category === 'Jenis Atap').map((x, i) => <Picker.Item key={i} label={x.categoryDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormDinding = () => (
        <View style={styles.MT8}>
            <Text>Dinding (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueDinding}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValueDinding(itemValue)}
                >
                    <Picker.Item label={'-- Pilih --'} value={null} />
                    {dataDwellingCondition.filter(data => data.category === 'Dinding').map((x, i) => <Picker.Item key={i} label={x.categoryDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormLantai = () => (
        <View style={styles.MT8}>
            <Text>Lantai (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueLantai}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValueLantai(itemValue)}
                >
                    <Picker.Item label={'-- Pilih --'} value={null} />
                    {dataDwellingCondition.filter(data => data.category === 'Lantai').map((x, i) => <Picker.Item key={i} label={x.categoryDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormSanitasi = () => (
        <View style={styles.MT8}>
            <Text style={[styles.FS18, styles.MB16]}>SANITASI</Text>
            <View style={styles.MT8}>
                <Text>Ada Akses Mendapat Air Bersih</Text>
                <RadioButton.Group onValueChange={newValue => setValueAksesAirBersih(newValue)} value={valueAksesAirBersih}>
                    <View style={[styles.FDRow]}>
                        <View style={[styles.F1, styles.FDRow, { alignItems: 'center' }]}>
                            <RadioButton value={true} />
                            <Text>Ya</Text>
                        </View>
                        <View style={[styles.F1, styles.FDRow, { alignItems: 'center' }]}>
                            <RadioButton value={false} />
                            <Text>Tidak</Text>
                        </View>
                    </View>
                </RadioButton.Group>
            </View>
            <View style={styles.MT16}>
                <Text>Ada Kamar Mandi/Toilet Milik Sendiri</Text>
                <RadioButton.Group onValueChange={newValue => setValueKamarMandi(newValue)} value={valueKamarMandi}>
                    <View style={[styles.FDRow]}>
                        <View style={[styles.F1, styles.FDRow, { alignItems: 'center' }]}>
                            <RadioButton value={true} />
                            <Text>Ya</Text>
                        </View>
                        <View style={[styles.F1, styles.FDRow, { alignItems: 'center' }]}>
                            <RadioButton value={false} />
                            <Text>Tidak</Text>
                        </View>
                    </View>
                </RadioButton.Group>
            </View>
        </View>
    )

    const renderButtonSaveDraft = () => (
        <View style={styles.buttonContainer}>
            <View style={styles.F1} />
            <TouchableOpacity
                onPress={() => doSubmitDraft()}
            >
                <View style={styles.button}>
                    <Text style={{ color: 'white' }}>Save Draft</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderButtonSimpan = () => (
        <View style={styles.P16}>
            <TouchableOpacity
                onPress={() => doSubmitSave()}
            >
                <View style={styles.buttonSubmitContainer}>
                    <Text style={styles.buttonSubmitText}>SUBMIT</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderSpace = () => (
        <View style={styles.spaceGray} />
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {idProduk < 3 ? null : renderFormRAB()}
            {renderFormRumah()}
            {renderFormLuasBangunan()}
            {renderFormKondisiBangunan()}
            {renderFormJenisAtap()}
            {renderFormDinding()}
            {renderFormLantai()}
            {renderButtonSaveDraft()}
            {renderSpace()}
            {renderFormSanitasi()}
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>Kondisi Rumah</Text>
            {/* <Text>{JSON.stringify(dataDwellingCondition)}</Text> */}
            <ScrollView>
                {renderForm()}
                {renderButtonSimpan()}
            </ScrollView>
        </View>
    )

    const renderFormRumah = () => (
        <View style={styles.MT8}>
            <Text>{statusSosialisasi === '3' ? 'Kondisi Sebelum Renovasi (*)' : 'Foto Rumah (Tampak Luar) (*)'}</Text>
            <TouchableOpacity onPress={async () => {
                setCameraShow(1)
            }}>
                <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 2, borderRadius: 10}}>
                    {fotoRumah === undefined ? (
                        <View style={{ alignItems:'center', justifyContent: 'center', flex: 1 }}>
                            <FontAwesome5 name={'camera-retro'} size={80} color='#737A82' />
                        </View>
                    ) : (
                        <Image source={{ uri: fotoRumah }} style={{height: dimension.width/2, borderRadius: 10}}/>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderFormRAB = () => (
        <View style={styles.MT8}>
            <Text>Rencana Anggaran Biaya (*)</Text>
            <TouchableOpacity onPress={async () => {
                setCameraShowRAB(1)
            }}>
                <View style={{borderWidth: 1, height: dimension.width/2, marginLeft: 2, borderRadius: 10}}>
                    {fotoRAB === undefined ? (
                        <View style={{ alignItems:'center', justifyContent: 'center', flex: 1 }}>
                            <FontAwesome5 name={'camera-retro'} size={80} color='#737A82' />
                        </View>
                    ) : (
                        <Image source={{ uri: fotoRAB }} style={{height: dimension.width/2, borderRadius: 10}}/>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderCameraRumah = () => (
        <View style={{flex:1,marginTop: 60, borderRadius: 20, backgroundColor: '#FFF', marginBottom: 60}}>
            {fotoRumah == undefined ? (
                <Camera 
                    ref={camera}
                    style={{flex: 1, height: '80%'}}
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
                            onPress={async() => {await takePicture('rumah')}
                        }>
                            <Text style={{ fontSize: 14 }}> Ambil Foto Rumah </Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            ) : (
            <View style={{flex:1}}>
                <Image source={{ uri: fotoRumah }} style={{flex:1}}/>
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
                        <Text style={{ fontSize: 14, color: '#FFF' }}> Kembali </Text>
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
                        onPress={() => {setFotoRumah(undefined)}
                    }>
                        <Text style={{ fontSize: 14 }}> Ambil lagi Foto Rumah </Text>
                    </TouchableOpacity>
                </View>
            </View>
            )}
        </View>
    )

    const renderCameraRAB = () => (
        <View style={{flex:1,marginTop: 60, borderRadius: 20, backgroundColor: '#FFF', marginBottom: 60}}>
            {fotoRAB == undefined ? (
                <Camera 
                    ref={camera}
                    style={{flex: 1, height: '80%'}}
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
                            onPress={() => setCameraShowRAB(0)
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
                            onPress={async() => {await takePicture('rab')}
                        }>
                            <Text style={{ fontSize: 14 }}> Ambil Foto RAB </Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            ) : (
            <View style={{flex:1}}>
                <Image source={{ uri: fotoRumah }} style={{flex:1}}/>
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
                        onPress={() => setCameraShowRAB(0)
                    }>
                        <Text style={{ fontSize: 14, color: '#FFF' }}> Kembali </Text>
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
                        onPress={() => {setFotoRAB(undefined)}
                    }>
                        <Text style={{ fontSize: 14 }}> Ambil lagi Foto RAB </Text>
                    </TouchableOpacity>
                </View>
            </View>
            )}
        </View>
    )

    const savePictureBase64 = (key, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                await AsyncStorage.setItem(key, data)
                const getAsyncStorage = await AsyncStorage.getItem(key)
                if (getAsyncStorage) {
                    resolve(getAsyncStorage)
                } else {
                    resolve(null)
                }
            } catch (error) {
                resolve(null)
            }
        })
    }

    const takePicture = async (source) => {
        if (__DEV__) console.log('takePicture loaded');
        if (__DEV__) console.log('takePicture source:', source);

        try {
            setLoading(true)
            setButtonCam(true)
            const options = { quality: 0.3, base64: true };
            let getPicture = await camera.current.takePictureAsync(options)
            setLoading(false);
            setButtonCam(false);
            if (source === 'rumah') {
                await savePictureBase64(key_fotoRumah, 'data:image/jpeg;base64,' + getPicture.base64)
                setFotoRumah(getPicture.uri);
                setCameraShow(0)
            } else {
                await savePictureBase64(key_fotoRAB, 'data:image/jpeg;base64,' + getPicture.base64)
                setFotoRAB(getPicture.uri);
                setCameraShowRAB(0)
            }
        } catch (error) {console.log(error)}
    };

    const renderContainer = () => {
        if (cameraShow === 1) {
            return renderCameraRumah()
        }
        if (cameraShowRAB === 1) {
            return renderCameraRAB()
        }

        return (
            <View style={styles.mainContainer}>
                {renderHeader()}
                {renderBody()}  
            </View>
        )
    }

    return(
        <View style={styles.mainContainer}> 
            {renderContainer()}
        </View>
    )
}

export default InisiasiFormUKKondisiRumah;
