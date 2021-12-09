import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, ScrollView, StyleSheet, Dimensions, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from './styles';
import { RadioButton } from 'react-native-paper';
import db from '../../../database/Database';
import { Picker } from '@react-native-picker/picker';

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

const ProdukPembiayaan = ({ route }) => {
    const { groupName, namaNasabah } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [openJenisPembiayaan, setOpenJenisPembiayaan] = useState(false);
    const [valueJenisPembiayaan, setValueJenisPembiayaan] = useState(null);
    const [itemsJenisPembiayaan, setItemsJenisPembiayaan] = useState([{ label: '-- Pilih --', value: null }]);
    const [openNamaProduk, setOpenNamaProduk] = useState(false);
    const [valueNamaProduk, setValueNamaProduk] = useState(null);
    const [itemsNamaProduk, setItemsNamaProduk] = useState([{ label: '-- Pilih --', value: null }]);
    const [openProdukPembiayaan, setOpenProdukPembiayaan] = useState(false);
    const [valueProdukPembiayaan, setValueProdukPembiayaan] = useState(null);
    const [itemsProdukPembiayaan, setItemsProdukPembiayaan] = useState([{ label: '-- Pilih --', value: null }]);
    const [openJumlahPinjaman, setOpenJumlahPinjaman] = useState(false);
    const [valueJumlahPinjaman, setValueJumlahPinjaman] = useState(null);
    const [itemsJumlahPinjaman, setItemsJumlahPinjaman] = useState([{ label: '-- Pilih --', value: null }]);
    const [openKategoriTujuanPembiayaan, setOpenKategoriTujuanPembiayaan] = useState(false);
    const [valueKategoriTujuanPembiayaan, setValueKategoriTujuanPembiayaan] = useState(null);
    const [itemsKategoriTujuanPembiayaan, setItemsKategoriTujuanPembiayaan] = useState([{ label: 'Modal Usaha', value: '1' }, { label: '-- Pilih --', value: null }]);
    const [openTujuanPembiayaan, setOpenTujuanPembiayaan] = useState(false);
    const [valueTujuanPembiayaan, setValueTujuanPembiayaan] = useState(null);
    const [itemsTujuanPembiayaan, setItemsTujuanPembiayaan] = useState([{ label: 'Modal Usaha', value: '1' }, { label: '-- Pilih --', value: null }]);
    const [openTypePencairan, setOpenTypePencairan] = useState(false);
    const [valueTypePencairan, setValueTypePencairan] = useState(null);
    const [itemsTypePencairan, setItemsTypePencairan] = useState([{ label: '-- Pilih --', value: null }]);
    const [openFrekuensiPembayaran, setOpenFrekuensiPembayaran] = useState(false);
    const [valueFrekuensiPembayaran, setValueFrekuensiPembayaran] = useState(null);
    const [itemsFrekuensiPembayaran, setItemsFrekuensiPembayaran] = useState([{ label: 'Mingguan', value: '1' }, { label: '-- Pilih --', value: null }]);
    const [valueTermPembiayaan, setValueTermPembiayaan] = useState(null);
    const [valueNamaBank, setValueNamaBank] = useState('');
    const [valueNoRekening, setValueNoRekening] = useState('');
    const [valuePemilikRekening, setValuePemilikRekening] = useState('');
    const [valueRekeningBank, setValueRekeningBank] = useState(false);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [selectedProdukPembiayaan, setSelectedProdukPembiayaan] = useState(null);
    const [submmitted, setSubmmitted] = useState(false);

    useEffect(() => {
        setInfo();
        getUKProdukPembiayaan();
        getStorageJenisPembiayaan();
        getStorageTipePencairan();
    }, [])

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

    const getUKProdukPembiayaan = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_ProdukPembiayaan WHERE nama_lengkap = '` + namaNasabah + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_ProdukPembiayaan length:', dataLength);
                    if (dataLength > 0) {
                        
                        let data = results.rows.item(0);
                        // if (__DEV__) console.log('tx.executeSql data:', data);
                        // if (data.jenis_Pembiayaan !== null && typeof data.jenis_Pembiayaan !== 'undefined') setValueJenisPembiayaan(data.jenis_Pembiayaan);
                        // if (data.nama_Produk !== null && typeof data.nama_Produk !== 'undefined') setValueNamaProduk(data.nama_Produk);
                        // if (data.produk_Pembiayaan !== null && typeof data.produk_Pembiayaan !== 'undefined') setValueProdukPembiayaan(data.produk_Pembiayaan);
                        // if (data.jumlah_Pinjaman !== null && typeof data.jumlah_Pinjaman !== 'undefined') setValueJumlahPinjaman(data.jumlah_Pinjaman);
                        // if (data.term_Pembiayaan !== null && typeof data.term_Pembiayaan !== 'undefined') setValueTermPembiayaan(data.term_Pembiayaan);
                        // if (data.kategori_Tujuan_Pembiayaan !== null && typeof data.kategori_Tujuan_Pembiayaan !== 'undefined') setValueKategoriTujuanPembiayaan(data.kategori_Tujuan_Pembiayaan);
                        // if (data.tujuan_Pembiayaan !== null && typeof data.tujuan_Pembiayaan !== 'undefined') setValueTujuanPembiayaan(data.tujuan_Pembiayaan);
                        // if (data.type_Pencairan !== null && typeof data.type_Pencairan !== 'undefined') setValueTypePencairan(data.type_Pencairan);
                        // if (data.frekuensi_Pembayaran !== null && typeof data.frekuensi_Pembayaran !== 'undefined') setValueFrekuensiPembayaran(data.frekuensi_Pembayaran);
                        // if (data.status_Rekening_Bank !== null && typeof data.status_Rekening_Bank !== 'undefined') setValueRekeningBank(data.status_Rekening_Bank === 'true' ? true : false);
                        // if (data.nama_Bank !== null && typeof data.nama_Bank !== 'undefined') setValueNamaBank(data.nama_Bank);
                        // if (data.no_Rekening !== null && typeof data.no_Rekening !== 'undefined') setValueNoRekening(data.no_Rekening);
                        // if (data.pemilik_Rekening !== null && typeof data.pemilik_Rekening !== 'undefined') setValuePemilikRekening(data.pemilik_Rekening);
                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_ProdukPembiayaan error:', error.message);
                })
            }
        )
    }

    const getStorageProduk = async () => {
        if (__DEV__) console.log('getStorageProduk loaded');
        if (__DEV__) console.log('getStorageProduk valueJenisPembiayaan:', valueJenisPembiayaan);

        try {
            const response = await AsyncStorage.getItem('Product');
            if (response !== null) {
                const responseJSON = JSON.parse(response);
                if (responseJSON.length > 0 ?? false) {
                    let isRegular = "0";
                    if (valueJenisPembiayaan === '1') isRegular = '1';
                    var responseFiltered = responseJSON.filter(data => data.isReguler === isRegular).map((data, i) => {
                        return { label: data.productName.trim(), value: data.id, interest: data.interest, isReguler: data.isReguler, isSyariah: data.isSyariah, maxPlafond: data.maxPlafond, minPlafond: data.minPlafond, paymentTerm: data.paymentTerm };
                    }) ?? [];
                    responseFiltered.push({ label: '-- Pilih --', value: null });
                    if (__DEV__) console.log('getStorageProduk responseFiltered:', responseFiltered);
                    setItemsProdukPembiayaan(responseFiltered);
                    return;
                }
            }
            setItemsProdukPembiayaan([]);
        } catch (error) {
            setItemsProdukPembiayaan([]);
        }
    }

    const getStorageJenisPembiayaan = async () => {
        if (__DEV__) console.log('getStorageJenisPembiayaan loaded');

        try {
            const response = await AsyncStorage.getItem('JenisPembiayaan');
            if (response !== null) {
                const responseJSON = JSON.parse(response);
                if (responseJSON.length > 0 ?? false) {
                    var responseFiltered = responseJSON.map((data, i) => {
                        return { label: data.namajenispembiayaan, value: data.id };
                    }) ?? [];
                    responseFiltered.push({ label: '-- Pilih --', value: null });
                    if (__DEV__) console.log('getStorageJenisPembiayaan responseFiltered:', responseFiltered);
                    setItemsJenisPembiayaan(responseFiltered);
                    return;
                }
            }
            setItemsJenisPembiayaan([]);
        } catch (error) {
            setItemsJenisPembiayaan([]);
        }
    }

    const getStorageTipePencairan = async () => {
        if (__DEV__) console.log('getStorageTipePencairan loaded');

        try {
            const response = await AsyncStorage.getItem('TransFund');
            if (response !== null) {
                const responseJSON = JSON.parse(response);
                if (responseJSON.length > 0 ?? false) {
                    var responseFiltered = responseJSON.map((data, i) => {
                        return { label: data.transfundDetail, value: data.id };
                    }) ?? [];
                    responseFiltered.push({ label: '-- Pilih --', value: null });
                    if (__DEV__) console.log('getStorageTipePencairan responseFiltered:', responseFiltered);
                    setItemsTypePencairan(responseFiltered);
                    return;
                }
            }
            setItemsTypePencairan([]);
        } catch (error) {
            setItemsTypePencairan([]);
        }
    }

    const getStorageNamaProduk = async () => {
        if (__DEV__) console.log('getStorageNamaProduk loaded');

        const responseFiltered = [{ label: 'Mekaar', value: '1' },{ label: 'Mekaar Plus', value: '2' },{ label: '-- Pilih --', value: null }];
        setItemsNamaProduk(responseFiltered);
    }

    const generateJumlahPinjaman = (data) => {
        if (__DEV__) console.log('generateJumlahPinjaman loaded');
        if (__DEV__) console.log('generateJumlahPinjaman data:', data);

        if (data === null) {
            return (
                <Picker.Item label={'-- Pilih --'} value={null} />
            )
        }

        const kelipatan = 500000;
        const min = parseInt(data.minPlafond);
        const max = parseInt(data.maxPlafond);
        const bag = max / kelipatan;
        let datas = [];
        let total = min;
        for (var i = 0; i < bag; i++) {
            if (total <= max) {
                const data = { label: `${total}`, value: `${total}` };
                datas.push(data);
                total += kelipatan;
            }
        }
        datas.push({ label: '-- Pilih --', value: null });

        return datas.map((x) => <Picker.Item label={x.label} value={x.value} />);
    }

    const doSubmitDraft = () => {
        if (__DEV__) console.log('doSubmitDraft loaded');
        if (__DEV__) console.log('doSubmitDraft valueJenisPembiayaan:', valueJenisPembiayaan);
        if (__DEV__) console.log('doSubmitDraft valueNamaProduk:', valueNamaProduk);
        if (__DEV__) console.log('doSubmitDraft valueProdukPembiayaan:', valueProdukPembiayaan);
        if (__DEV__) console.log('doSubmitDraft valueJumlahPinjaman:', valueJumlahPinjaman);
        if (__DEV__) console.log('doSubmitDraft valueTermPembiayaan:', valueTermPembiayaan);
        if (__DEV__) console.log('doSubmitDraft valueKategoriTujuanPembiayaan:', valueKategoriTujuanPembiayaan);
        if (__DEV__) console.log('doSubmitDraft valueTujuanPembiayaan:', valueTujuanPembiayaan);
        if (__DEV__) console.log('doSubmitDraft valueTypePencairan:', valueTypePencairan);
        if (__DEV__) console.log('doSubmitDraft valueFrekuensiPembayaran:', valueFrekuensiPembayaran);
        if (__DEV__) console.log('doSubmitDraft valueRekeningBank:', valueRekeningBank);
        if (__DEV__) console.log('doSubmitDraft valueNamaBank:', valueNamaBank);
        if (__DEV__) console.log('doSubmitDraft valueNoRekening:', valueNoRekening);
        if (__DEV__) console.log('doSubmitDraft valuePemilikRekening:', valuePemilikRekening);

        if (submmitted) return true;

        setSubmmitted(true);
        const find = 'SELECT * FROM Table_UK_ProdukPembiayaan WHERE nama_lengkap = "'+ namaNasabah +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_ProdukPembiayaan (nama_lengkap, jenis_Pembiayaan, nama_Produk, produk_Pembiayaan, jumlah_Pinjaman, term_Pembiayaan, kategori_Tujuan_Pembiayaan, tujuan_Pembiayaan, type_Pencairan, frekuensi_Pembayaran, status_Rekening_Bank, nama_Bank, no_Rekening, pemilik_Rekening) values ("' + namaNasabah + '","' + valueJenisPembiayaan + '","' + valueNamaProduk + '","' + valueProdukPembiayaan + '","' + valueJumlahPinjaman + '","' + valueTermPembiayaan + '","' + valueKategoriTujuanPembiayaan + '","' + valueTujuanPembiayaan + '","' + valueTypePencairan + '","' + valueFrekuensiPembayaran + '","' + valueRekeningBank + '","' + valueNamaBank + '","' + valueNoRekening + '","' + valuePemilikRekening + '")';
                    } else {
                        query = 'UPDATE Table_UK_ProdukPembiayaan SET jenis_Pembiayaan = "' + valueJenisPembiayaan + '", nama_Produk = "' + valueNamaProduk + '", produk_Pembiayaan = "' + valueProdukPembiayaan + '", jumlah_Pinjaman = "' + valueJumlahPinjaman + '", term_Pembiayaan = "' + valueTermPembiayaan + '", kategori_Tujuan_Pembiayaan = "' + valueKategoriTujuanPembiayaan + '", tujuan_Pembiayaan = "' + valueTujuanPembiayaan + '", type_Pencairan = "' + valueTypePencairan + '", frekuensi_Pembayaran = "' + valueFrekuensiPembayaran + '", status_Rekening_Bank = "' + valueRekeningBank + '", nama_Bank = "' + valueNamaBank + '", no_Rekening = "' + valueNoRekening + '", pemilik_Rekening = "' + valuePemilikRekening + '" WHERE nama_lengkap = "' + namaNasabah + '"';
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
                                        tx.executeSql("SELECT * FROM Table_UK_ProdukPembiayaan", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_ProdukPembiayaan RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_ProdukPembiayaan ERROR:', error);
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

                    query = 'UPDATE Table_UK_Master SET status = "2" WHERE namaNasabah = "' + namaNasabah + '"';

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

    const renderFormJenisPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Jenis Pembiayaan</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueJenisPembiayaan}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => {
                        setValueJenisPembiayaan(itemValue);
                        setTimeout(() => {
                            getStorageNamaProduk();
                        }, 600);
                    }}
                >
                    {itemsJenisPembiayaan.map((x, i) => <Picker.Item label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormNamaProduk = () => (
        <View style={styles.MT8}>
            <Text>Nama Produk</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueNamaProduk}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => {
                        setValueNamaProduk(itemValue);
                        setTimeout(() => {
                            getStorageProduk();
                        }, 600);
                    }}
                >
                    {itemsNamaProduk.map((x, i) => <Picker.Item label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormProdukPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Produk Pembiayaan</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueProdukPembiayaan}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => {
                        setValueProdukPembiayaan(itemValue);
                        setSelectedProdukPembiayaan(itemsProdukPembiayaan[itemIndex]);
                        setValueTermPembiayaan(itemsProdukPembiayaan[itemIndex].paymentTerm);
                    }}
                >
                    {itemsProdukPembiayaan.map((x, i) => <Picker.Item label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormJumlahPinjaman = () => (
        <View style={styles.MT8}>
            <Text>Jumlah Pinjaman</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueJumlahPinjaman}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValueJumlahPinjaman(itemValue)}
                >
                    {generateJumlahPinjaman(selectedProdukPembiayaan)}
                </Picker>
            </View>
        </View>
    )

    const renderFormTermPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Term Pembiayaan</Text>
            <View style={styles.textInputContainer}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueTermPembiayaan} 
                        onChangeText={(text) => setValueTermPembiayaan(text)} 
                        keyboardType='numeric'
                        placeholder="0" 
                        style={styles.F1}
                    />
                </View>
                <View>
                    <FontAwesome5 name={'id-badge'} size={18} />
                </View>
            </View>
        </View>
    )

    const renderFormKategoriTujuanPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Kategori Tujuan Pembiayaan</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKategoriTujuanPembiayaan}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValueKategoriTujuanPembiayaan(itemValue)}
                >
                    {itemsKategoriTujuanPembiayaan.map((x, i) => <Picker.Item label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormTujuanPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Tujuan Pembiayaan</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueTujuanPembiayaan}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValueTujuanPembiayaan(itemValue)}
                >
                    {itemsTujuanPembiayaan.map((x, i) => <Picker.Item label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormTypePencairan = () => (
        <View style={styles.MT8}>
            <Text>Type Pencairan</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueTypePencairan}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValueTypePencairan(itemValue)}
                >
                    {itemsTypePencairan.map((x, i) => <Picker.Item label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormFrekuensiPembayaran = () => (
        <View style={styles.MT8}>
            <Text>Frekuensi Pembayaran</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueFrekuensiPembayaran}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValueFrekuensiPembayaran(itemValue)}
                >
                    {itemsFrekuensiPembayaran.map((x, i) => <Picker.Item label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormRekeningBank = () => (
        <View style={styles.MT8}>
            <Text style={{ width: 100 }}>Rekening Bank</Text>
            <RadioButton.Group onValueChange={newValue => setValueRekeningBank(newValue)} value={valueRekeningBank}>
                <View style={[styles.FDRow]}>
                    <View style={[styles.F1, styles.FDRow, { alignItems: 'center' }]}>
                        <RadioButton value={true} />
                        <Text>Ada</Text>
                    </View>
                    <View style={[styles.F1, styles.FDRow, { alignItems: 'center' }]}>
                        <RadioButton value={false} />
                        <Text>Tidak Ada</Text>
                    </View>
                </View>
            </RadioButton.Group>
        </View>
    )

    const renderFormNamaBank = () => valueRekeningBank && (
        <View style={styles.formContainerText}>
            <Text style={{ width: 100 }}>Nama Bank</Text>
            <View style={[styles.textInputContainer, styles.ML8]}>
                <TextInput 
                    value={valueNamaBank} 
                    onChangeText={(text) => setValueNamaBank(text)}
                    placeholder="" 
                    style={styles.F1}
                />
            </View>
        </View>
    )

    const renderFormNoRekening = () => valueRekeningBank && (
        <View style={styles.formContainerText}>
            <Text style={{ width: 100 }}>No. Rekening</Text>
            <View style={[styles.textInputContainer, styles.ML8]}>
                <TextInput 
                    value={valueNoRekening} 
                    onChangeText={(text) => setValueNoRekening(text)}
                    placeholder="" 
                    style={styles.F1}
                />
            </View>
        </View>
    )

    const renderFormPemilikRekening = () => valueRekeningBank && (
        <View style={styles.formContainerText}>
            <Text style={{ width: 100 }}>Pemilik Rekening</Text>
            <View style={[styles.textInputContainer, styles.ML8]}>
                <TextInput 
                    value={valuePemilikRekening} 
                    onChangeText={(text) => setValuePemilikRekening(text)}
                    placeholder="" 
                    style={styles.F1}
                />
            </View>
        </View>
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderFormSiklusPembiayaan()}
            {renderFormJenisPembiayaan()}
            {renderFormNamaProduk()}
            {renderFormProdukPembiayaan()}
            {renderFormJumlahPinjaman()}
            {renderFormTermPembiayaan()}
            {renderFormKategoriTujuanPembiayaan()}
            {renderFormTujuanPembiayaan()}
            {renderFormTypePencairan()}
            {renderFormFrekuensiPembayaran()}
            {renderFormRekeningBank()}
            {renderFormNamaBank()}
            {renderFormNoRekening()}
            {renderFormPemilikRekening()}
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
    }
});

export default ProdukPembiayaan;
