import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, ScrollView, StyleSheet, Dimensions, Button, Image, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from './styles';
import db from '../../../database/Database';

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

const InisiasiFormUKTandaTanganPermohonan = ({ route }) => {
    const { groupName, namaNasabah } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [openProdukPembiayaan, setOpenProdukPembiayaan] = useState(false);
    const [valueProdukPembiayaan, setValueProdukPembiayaan] = useState(null);
    const [itemsProdukPembiayaan, setItemsProdukPembiayaan] = useState([{ label: 'S125', value: '1' }]);
    const [valueJumlahPembiayaanYangDiajukan, setValueJumlahPembiayaanYangDiajukan] = useState('');
    const [valueJangkaWaktu, setValueJangkaWaktu] = useState('');
    const [openFrekuensiPembiayaan, setOpenFrekuensiPembiayaan] = useState(false);
    const [valueFrekuensiPembiayaan, setValueFrekuensiPembiayaan] = useState(null);
    const [itemsFrekuensiPembiayaan, setItemsFrekuensiPembiayaan] = useState([{ label: 'Mingguan', value: '1' }]);
    const [valueTandaTanganNasabah, setValueTandaTanganNasabah] = useState(null);
    const [valueTandaTanganSuamiPenjamin, setValueTandaTanganSuamiPenjamin] = useState(null);
    const [valueTandaTanganKetuaSubKemlompok, setValueTandaTanganKetuaSubKemlompok] = useState(null);
    const [valueTandaTanganKetuaKelompok, setValueTandaTanganKetuaKemlompok] = useState(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [submmitted, setSubmmitted] = useState(false);

    useEffect(() => {
        setInfo();
        getUKPermohonanPembiayaan();
    }, [])

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

    const getUKPermohonanPembiayaan = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_PermohonanPembiayaan WHERE nama_lengkap = '` + namaNasabah + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_PermohonanPembiayaan length:', dataLength);
                    if (dataLength > 0) {
                        
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data:', data);
                        if (data.produk_Pembiayaan !== null && typeof data.produk_Pembiayaan !== 'undefined') setValueProdukPembiayaan(data.produk_Pembiayaan);
                        if (data.jumlah_Pembiayaan_Diajukan !== null && typeof data.jumlah_Pembiayaan_Diajukan !== 'undefined') setValueJumlahPembiayaanYangDiajukan(data.jumlah_Pembiayaan_Diajukan);
                        if (data.jangka_Waktu !== null && typeof data.jangka_Waktu !== 'undefined') setValueJangkaWaktu(data.jangka_Waktu);
                        if (data.frekuensi_Pembiayaan !== null && typeof data.frekuensi_Pembiayaan !== 'undefined') setValueFrekuensiPembiayaan(data.frekuensi_Pembiayaan);
                        if (data.tanda_Tangan_Nasabah !== null && typeof data.tanda_Tangan_Nasabah !== 'undefined') setValueTandaTanganNasabah(data.tanda_Tangan_Nasabah);
                        if (data.tanda_Tangan_SuamiPenjamin !== null && typeof data.tanda_Tangan_SuamiPenjamin !== 'undefined') setValueTandaTanganSuamiPenjamin(data.tanda_Tangan_SuamiPenjamin);
                        if (data.tanda_Tangan_Ketua_SubKelompok !== null && typeof data.tanda_Tangan_Ketua_SubKelompok !== 'undefined') setValueTandaTanganKetuaSubKemlompok(data.tanda_Tangan_Ketua_SubKelompok);
                        if (data.tanda_Tangan_Ketua_Kelompok !== null && typeof data.tanda_Tangan_Ketua_Kelompok !== 'undefined') setValueTandaTanganKetuaKemlompok(data.tanda_Tangan_Ketua_Kelompok);
                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_PermohonanPembiayaan error:', error.message);
                })
            }
        )
    }

    const doSubmitDraft = () => {
        if (__DEV__) console.log('doSubmitDraft loaded');
        if (__DEV__) console.log('doSubmitDraft valueProdukPembiayaan:', valueProdukPembiayaan);
        if (__DEV__) console.log('doSubmitDraft valueJumlahPembiayaanYangDiajukan:', valueJumlahPembiayaanYangDiajukan);
        if (__DEV__) console.log('doSubmitDraft valueJangkaWaktu:', valueJangkaWaktu);
        if (__DEV__) console.log('doSubmitDraft valueFrekuensiPembiayaan:', valueFrekuensiPembiayaan);
        if (__DEV__) console.log('doSubmitDraft valueTandaTanganNasabah:', valueTandaTanganNasabah);
        if (__DEV__) console.log('doSubmitDraft valueTandaTanganSuamiPenjamin:', valueTandaTanganSuamiPenjamin);
        if (__DEV__) console.log('doSubmitDraft valueTandaTanganKetuaSubKemlompok:', valueTandaTanganKetuaSubKemlompok);
        if (__DEV__) console.log('doSubmitDraft valueTandaTanganKetuaKelompok:', valueTandaTanganKetuaKelompok);

        if (submmitted) return true;

        setSubmmitted(true);
        const find = 'SELECT * FROM Table_UK_PermohonanPembiayaan WHERE nama_lengkap = "'+ namaNasabah +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_PermohonanPembiayaan (nama_lengkap, produk_Pembiayaan, jumlah_Pembiayaan_Diajukan, jangka_Waktu, frekuensi_Pembiayaan, tanda_Tangan_Nasabah, tanda_Tangan_SuamiPenjamin, tanda_Tangan_Ketua_SubKelompok, tanda_Tangan_Ketua_Kelompok) values ("' + namaNasabah + '","' + valueProdukPembiayaan + '","' + valueJumlahPembiayaanYangDiajukan + '","' + valueJangkaWaktu + '","' + valueFrekuensiPembiayaan + '","' + valueTandaTanganNasabah + '","' + valueTandaTanganSuamiPenjamin + '","' + valueTandaTanganKetuaSubKemlompok + '","' + valueTandaTanganKetuaKelompok + '")';
                    } else {
                        query = 'UPDATE Table_UK_PermohonanPembiayaan SET produk_Pembiayaan = "' + valueProdukPembiayaan + '", jumlah_Pembiayaan_Diajukan = "' + valueJumlahPembiayaanYangDiajukan + '", jangka_Waktu = "' + valueJangkaWaktu + '", frekuensi_Pembiayaan = "' + valueFrekuensiPembiayaan + '", tanda_Tangan_Nasabah = "' + valueTandaTanganNasabah + '", tanda_Tangan_SuamiPenjamin = "' + valueTandaTanganSuamiPenjamin + '", tanda_Tangan_Ketua_SubKelompok = "' + valueTandaTanganKetuaSubKemlompok + '", tanda_Tangan_Ketua_Kelompok = "' + valueTandaTanganKetuaKelompok + '" WHERE nama_lengkap = "' + namaNasabah + '"';
                    }

                    if (__DEV__) console.log('doSubmitDraft db.transaction insert/update query:', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitDraft db.transaction insert/update error:', error.message);
                            setSubmmitted(false);
                        },function() {
                            if (__DEV__) console.log('doSubmitDraft db.transaction insert/update success');
                            setSubmmitted(false);
                            ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                            if (__DEV__) {
                                db.transaction(
                                    tx => {
                                        tx.executeSql("SELECT * FROM Table_UK_PermohonanPembiayaan", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_PermohonanPembiayaan RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_PermohonanPembiayaan ERROR:', error);
                                    }, function() {}
                                );
                            }
                        }
                    );
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDraft db.transaction find error:', error.message);
                    setSubmmitted(false);
                })
            }
        );
    }

    const doSubmitSave = () => {
        if (__DEV__) console.log('doSubmitSave loaded');

        if (!valueTandaTanganNasabah || typeof valueTandaTanganNasabah === 'undefined' || valueTandaTanganNasabah === '' || valueTandaTanganNasabah === 'null') return alert('Tanda Tangan Nasabah (*) tidak boleh kosong');
        if (!valueTandaTanganSuamiPenjamin || typeof valueTandaTanganSuamiPenjamin === 'undefined' || valueTandaTanganSuamiPenjamin === '' || valueTandaTanganSuamiPenjamin === 'null') return alert('Tanda Tangan Suami/Penjamin (*) tidak boleh kosong');
        if (!valueTandaTanganKetuaSubKemlompok || typeof valueTandaTanganKetuaSubKemlompok === 'undefined' || valueTandaTanganKetuaSubKemlompok === '' || valueTandaTanganKetuaSubKemlompok === 'null') return alert('Tanda Tangan Ketua Sub Kelompok (*) tidak boleh kosong');
        if (!valueTandaTanganKetuaKelompok || typeof valueTandaTanganKetuaKelompok === 'undefined' || valueTandaTanganKetuaKelompok === '' || valueTandaTanganKetuaKelompok === 'null') return alert('Tanda Tangan Kelompok (*) tidak boleh kosong');

        if (submmitted) return true;

        setSubmmitted(true);
        const find = 'SELECT * FROM Table_UK_Master WHERE namaNasabah = "'+ namaNasabah +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        alert('UK Master not found');
                        navigation.goBack();
                        return;
                    }

                    query = 'UPDATE Table_UK_Master SET status = "6" WHERE namaNasabah = "' + namaNasabah + '"';

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
                            setSubmmitted(false);
                            alert('Berhasil');
                            navigation.goBack();
                        }
                    );
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction find error:', error.message);
                    setSubmmitted(false);
                })
            }
        );
    }

    const onSelectSign = (key, data) => {
        if (__DEV__) console.log('onSelectSign loaded');
        if (__DEV__) console.log('onSelectSign key:', key);
        if (__DEV__) console.log('onSelectSign data:', data);

        if (key === 'tandaTanganNasabah') return setValueTandaTanganNasabah(data);
        if (key === 'tandaTanganSuamiPenjamin') return setValueTandaTanganSuamiPenjamin(data);
        if (key === 'tandaTanganKetuaSubKemlompok') return setValueTandaTanganKetuaSubKemlompok(data);
        if (key === 'tandaTanganKetuaKemlompok') return setValueTandaTanganKetuaKemlompok(data);
    };

    const renderHeader = () => (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.replace('UjiKelayakan', { groupName: groupName })} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>UJI KELAYAKAN</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerBoxImageBackground}>
                <ImageBackground source={images.banner} style={styles.headerImageBackground} imageStyle={{ borderRadius: 20 }}>
                    <Text style={[styles.headerText, { fontSize: 30 }]}>Form Uji Kelayakan</Text>
                    <Text style={[styles.headerText, { fontSize: 20 }]}>{groupName}</Text>
                    <Text style={[styles.headerText, { fontSize: 15 }]}>{namaNasabah}</Text>
                    <Text style={[styles.headerText, { fontSize: 15 }]}>{currentDate}</Text>
                </ImageBackground>
            </View>
        </>
    )

    const renderFormSiklusPembiayaan = () => (
        <View style={stylesheet.siklusContainer}>
            <Text style={styles.FS18}>SIKLUS PEMBIAYAAN</Text>
            <Text style={styles.FWBold}>Pertama</Text>
        </View>
    )

    const renderFormProdukPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Produk Pembiayaan</Text>
            <DropDownPicker
                open={openProdukPembiayaan}
                value={valueProdukPembiayaan}
                items={itemsProdukPembiayaan}
                setOpen={setOpenProdukPembiayaan}
                setValue={setValueProdukPembiayaan}
                setItems={setItemsProdukPembiayaan}
                placeholder='Pilih Produk Pembiayaan'
                onChangeValue={() => null}
            />
        </View>
    )

    const renderFormJumlahPembiayaanYangDiajukan = () => (
        <View style={styles.MT8}>
            <Text>Jumlah Pembiayaan Yang Diajukan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueJumlahPembiayaanYangDiajukan} 
                        onChangeText={(text) => setValueJumlahPembiayaanYangDiajukan(text)}
                        placeholder='3000000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormJangkaWaktu = () => (
        <View style={styles.MT8}>
            <Text>Jangka Waktu</Text>
            <View style={[styles.textInputContainer]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueJangkaWaktu} 
                        onChangeText={(text) => setValueJangkaWaktu(text)}
                        placeholder='25'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormFrekuensiPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Frekuensi Pembiayaan</Text>
            <DropDownPicker
                open={openFrekuensiPembiayaan}
                value={valueFrekuensiPembiayaan}
                items={itemsFrekuensiPembiayaan}
                setOpen={setOpenFrekuensiPembiayaan}
                setValue={setValueFrekuensiPembiayaan}
                setItems={setItemsFrekuensiPembiayaan}
                placeholder='Frekuensi Pembiayaan'
                onChangeValue={() => null}
            />
        </View>
    )

    const renderFormTandaTanganNasabah = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Nasabah (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganNasabah && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganNasabah }}
                    />
                )}
                <Text style={[styles.note, { color: 'red', marginLeft: 0 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganNasabah', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTandaTanganSuamiPenjamin = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Suami/Penjamin (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganSuamiPenjamin && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganSuamiPenjamin }}
                    />
                )}
                <Text style={[styles.note, { color: 'red', marginLeft: 0 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganSuamiPenjamin', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTandaTanganKetuaSubKelompok = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Ketua Sub Kelompok (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganKetuaSubKemlompok && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganKetuaSubKemlompok }}
                    />
                )}
                <Text style={[styles.note, { color: 'red', marginLeft: 0 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganKetuaSubKemlompok', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTandaTanganKetuaKelompok = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Ketua Kelompok (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganKetuaKelompok && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganKetuaKelompok }}
                    />
                )}
                <Text style={[styles.note, { color: 'red', marginLeft: 0 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganKetuaKemlompok', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderFormSiklusPembiayaan()}
            {renderFormProdukPembiayaan()}
            {renderFormJumlahPembiayaanYangDiajukan()}
            {renderFormJangkaWaktu()}
            {renderFormFrekuensiPembiayaan()}
            {renderFormTandaTanganNasabah()}
            {renderFormTandaTanganSuamiPenjamin()}
            {renderFormTandaTanganKetuaSubKelompok()}
            {renderFormTandaTanganKetuaKelompok()}
            {renderButtonSaveDraft()}
        </View>
    )

    const renderButtonSaveDraft = () => (
        <View style={styles.buttonContainer}>
            <View style={styles.F1} />
            <TouchableOpacity
                onPress={() => doSubmitDraft()}
            >
                <View style={styles.button}>
                    <Text>Save Draft</Text>
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
                    <Text style={styles.buttonSubmitText}>SIMPAN</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>Produk Pembiayaan</Text>
            <ScrollView scrollEnabled={scrollEnabled}>
                {renderForm()}
                {renderButtonSimpan()}
            </ScrollView>
        </View>
    )

    return(
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
        </View>
    )
}

const stylesheet = StyleSheet.create({
    siklusContainer: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        width: 200
    },
    boxTTD: {
        borderRadius: 6,
        borderWidth: 1
    }
});

export default InisiasiFormUKTandaTanganPermohonan;
