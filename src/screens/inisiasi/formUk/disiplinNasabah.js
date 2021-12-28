import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, ScrollView, ToastAndroid, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';
import db from '../../../database/Database';
import { Picker } from '@react-native-picker/picker';

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const withTextInput = dimension.width - (20 * 4) + 8;

const InisiasiFormUKDisiplinNasabah = ({ route }) => {
    const { id, groupName, namaNasabah, screenState } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [valueKehadiranPKM, setValueKehadiranPKM] = useState(null);
    const [itemsKehadiranPKM, setItemsKehadiranPKM] = useState([{ label: '100% H', value: '1' },{ label: '1-5x TH', value: '2' }, { label: '6-10x TH', value: '3' }, { label: '11-15x TH', value: '4' }, { label: '>16x TH', value: '5' }]);
    const [valueAngsuranPadaSaatPKM, setValueAngsuranPadaSaatPKM] = useState(null);
    const [itemsAngsuranPadaSaatPKM, setItemsAngsuranPadaSaatPKM] = useState([{ label: '100% Bayar', value: '1' },{ label: '1x Tanggung Renteng', value: '2' }, { label: '2x Tanggung Renteng', value: '3' }, { label: '3x Tanggung Renteng', value: '4' }, { label: 'Tanggung Renteng >= 4', value: '5' }]);
    const [submmitted, setSubmmitted] = useState(false);
    
    useEffect(() => {
        setInfo();
        getUKDisiplinNasabah();
    }, [])

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

    const getUKDisiplinNasabah = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_DisipinNasabah WHERE idSosialisasiDatabase = '` + id + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_DisipinNasabah length:', dataLength);
                    if (dataLength > 0) {
                        
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data:', data);
                        if (data.kehadiran_pkm !== null && typeof data.kehadiran_pkm !== 'undefined') setValueKehadiranPKM(data.kehadiran_pkm);
                        if (data.angsuran_pada_saat_pkm !== null && typeof data.angsuran_pada_saat_pkm !== 'undefined') setValueAngsuranPadaSaatPKM(data.angsuran_pada_saat_pkm);
                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_DisipinNasabah error:', error.message);
                })
            }
        )
    }

    const doSubmitDraft = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('doSubmitDraft loaded');
        if (__DEV__) console.log('doSubmitDraft valueKehadiranPKM:', valueKehadiranPKM);
        if (__DEV__) console.log('doSubmitDraft valueAngsuranPadaSaatPKM:', valueAngsuranPadaSaatPKM);

        const find = 'SELECT * FROM Table_UK_DisipinNasabah WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_DisipinNasabah (nama_lengkap, kehadiran_pkm, angsuran_pada_saat_pkm, idSosialisasiDatabase) values ("' + namaNasabah + '","' + valueKehadiranPKM + '","' + valueAngsuranPadaSaatPKM + '","' + id + '")';
                    } else {
                        query = 'UPDATE Table_UK_DisipinNasabah SET kehadiran_pkm = "' + valueKehadiranPKM + '", angsuran_pada_saat_pkm = "' + valueAngsuranPadaSaatPKM + '" WHERE idSosialisasiDatabase = "' + id + '"';
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
                                        tx.executeSql("SELECT * FROM Table_UK_DisipinNasabah", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_DisipinNasabah RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_DisipinNasabah ERROR:', error);
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

        if (!valueKehadiranPKM || typeof valueKehadiranPKM === 'undefined' || valueKehadiranPKM === '' || valueKehadiranPKM === 'null') return alert('Kehadiran PKM (*) tidak boleh kosong');
        if (!valueAngsuranPadaSaatPKM || typeof valueAngsuranPadaSaatPKM === 'undefined' || valueAngsuranPadaSaatPKM ==='' || valueAngsuranPadaSaatPKM === 'null') return alert('Angsuran Pada Saat PKM (*) tidak boleh kosong');

        if (submmitted) return true;

        setSubmmitted(true);

        await doSubmitDraft('submit');

        setSubmmitted(false);
        alert('Berhasil');
        AsyncStorage.setItem('isFormUKDisiplinNasabahDone', '1');
        navigation.goBack();
    }

    const renderFormAngsuranPadaSaatPKM = () => (
        <View style={styles.MT8}>
            <Text>Angsuran Pada Saat PKM (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueAngsuranPadaSaatPKM}
                    onValueChange={(itemValue, itemIndex) => setValueAngsuranPadaSaatPKM(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsAngsuranPadaSaatPKM.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKehadiranPKM = () => (
        <View style={styles.MT8}>
            <Text>Kehadiran PKM (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueKehadiranPKM}
                    onValueChange={(itemValue, itemIndex) => setValueKehadiranPKM(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKehadiranPKM.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderButtonSaveDraft = () =>  (
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

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderFormKehadiranPKM()}
            {renderFormAngsuranPadaSaatPKM()}
        </View>
    )

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

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>Disiplin Nasabah</Text>
            <ScrollView>
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

export default InisiasiFormUKDisiplinNasabah;
