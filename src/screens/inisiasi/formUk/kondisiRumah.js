import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from './styles';
import { RadioButton } from 'react-native-paper';
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

const InisiasiFormUKKondisiRumah = ({ route }) => {
    const { groupName, namaNasabah } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [openLuasBangunan, setOpenLuasBangunan] = useState(false);
    const [valueLuasBangunan, setValueLuasBangunan] = useState(null);
    const [itemsLuasBangunan, setItemsLuasBangunan] = useState([{ label: 'Luas', value: '1' }]);
    const [openKondisiBangunan, setOpenKondisiBangunan] = useState(false);
    const [valueKondisiBangunan, setValueKondisiBangunan] = useState(null);
    const [itemsKondisiBangunan, setItemsKondisiBangunan] = useState([{ label: 'Modern', value: '1' }]);
    const [openJenisAtap, setOpenJenisAtap] = useState(false);
    const [valueJenisAtap, setValueJenisAtap] = useState(null);
    const [itemsJenisAtap, setItemsJenisAtap] = useState([{ label: 'Beton', value: '1' }]);
    const [openDinding, setOpenDinding] = useState(false);
    const [valueDinding, setValueDinding] = useState(null);
    const [itemsDinding, setItemsDinding] = useState([{ label: 'Beton', value: '1' }]);
    const [openLantai, setOpenLantai] = useState(false);
    const [valueLantai, setValueLantai] = useState(null);
    const [itemsLantai, setItemsLantai] = useState([{ label: 'Keramik', value: '1' }]);
    const [valueAksesAirBersih, setValueAksesAirBersih] = useState(true);
    const [valueKamarMandi, setValueKamarMandi] = useState(true);

    useEffect(() => {
        setInfo();
        getUKKondisiRumah();
    }, [])

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

    const getUKKondisiRumah = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_KondisiRumah WHERE nama_lengkap = '` + namaNasabah + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_KondisiRumah length:', dataLength);
                    if (dataLength > 0) {
                        
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data:', data);
                        if (data.luas_Bangunan !== null && typeof data.luas_Bangunan !== 'undefined') setValueLuasBangunan(data.luas_Bangunan);
                        if (data.kondisi_Bangunan !== null && typeof data.kondisi_Bangunan !== 'undefined') setValueKondisiBangunan(data.kondisi_Bangunan);
                        if (data.jenis_Atap !== null && typeof data.jenis_Atap !== 'undefined') setValueJenisAtap(data.jenis_Atap);
                        if (data.dinding !== null && typeof data.dinding !== 'undefined') setValueDinding(data.dinding);
                        if (data.lantai !== null && typeof data.lantai !== 'undefined') setValueLantai(data.lantai);
                        if (data.sanitasi_Akses_AirBersih !== null && typeof data.sanitasi_Akses_AirBersih !== 'undefined') setValueAksesAirBersih(data.sanitasi_Akses_AirBersih === 'true' ? true : false);
                        if (data.sanitasi_KamarMandi !== null && typeof data.sanitasi_KamarMandi !== 'undefined') setValueKamarMandi(data.sanitasi_KamarMandi === 'true' ? true : false);
                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_KondisiRumah error:', error.message);
                })
            }
        )
    }

    const doSubmitDraft = () => {
        if (__DEV__) console.log('doSubmitDraft loaded');
        if (__DEV__) console.log('doSubmitDraft valueLuasBangunan:', valueLuasBangunan);
        if (__DEV__) console.log('doSubmitDraft valueKondisiBangunan:', valueKondisiBangunan);
        if (__DEV__) console.log('doSubmitDraft valueJenisAtap:', valueJenisAtap);
        if (__DEV__) console.log('doSubmitDraft valueDinding:', valueDinding);
        if (__DEV__) console.log('doSubmitDraft valueLantai:', valueLantai);
        if (__DEV__) console.log('doSubmitDraft valueAksesAirBersih:', valueAksesAirBersih);
        if (__DEV__) console.log('doSubmitDraft valueKamarMandi:', valueKamarMandi);

        const find = 'SELECT * FROM Table_UK_KondisiRumah WHERE nama_lengkap = "'+ namaNasabah +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_KondisiRumah (nama_lengkap, luas_Bangunan, kondisi_Bangunan, jenis_Atap, dinding, lantai, sanitasi_Akses_AirBersih, sanitasi_KamarMandi) values ("' + namaNasabah + '","' + valueLuasBangunan + '","' + valueKondisiBangunan + '","' + valueJenisAtap + '","' + valueDinding + '","' + valueLantai + '","' + valueAksesAirBersih + '","' + valueKamarMandi + '")';
                    } else {
                        query = 'UPDATE Table_UK_KondisiRumah SET luas_Bangunan = "' + valueLuasBangunan + '", kondisi_Bangunan = "' + valueKondisiBangunan + '", jenis_Atap = "' + valueJenisAtap + '", dinding = "' + valueDinding + '", lantai = "' + valueLantai + '", sanitasi_Akses_AirBersih = "' + valueAksesAirBersih + '", sanitasi_KamarMandi = "' + valueKamarMandi + '" WHERE nama_lengkap = "' + namaNasabah + '"';
                    }

                    if (__DEV__) console.log('doSubmitDraft db.transaction insert/update query:', query);

                    db.transaction(
                        tx => {
                            tx.executeSql(query);
                        }, function(error) {
                            if (__DEV__) console.log('doSubmitDraft db.transaction insert/update error:', error.message);
                        },function() {
                            if (__DEV__) console.log('doSubmitDraft db.transaction insert/update success');

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
                        }
                    );
                }, function(error) {
                    if (__DEV__) console.log('doSubmitDraft db.transaction find error:', error.message);
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

    const renderFormLuasBangunan = () => (
        <View style={styles.MT8}>
            <Text>Luas Bangunan (*)</Text>
            <DropDownPicker
                open={openLuasBangunan}
                value={valueLuasBangunan}
                items={itemsLuasBangunan}
                setOpen={setOpenLuasBangunan}
                setValue={setValueLuasBangunan}
                setItems={setItemsLuasBangunan}
                placeholder='Pilih Luas Bangunan'
                onChangeValue={() => null}
                zIndex={10000}
            />
        </View>
    )

    const renderFormKondisiBangunan = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Bangunan (*)</Text>
            <DropDownPicker
                open={openKondisiBangunan}
                value={valueKondisiBangunan}
                items={itemsKondisiBangunan}
                setOpen={setOpenKondisiBangunan}
                setValue={setValueKondisiBangunan}
                setItems={setItemsKondisiBangunan}
                placeholder='Pilih Kondisi Bangunan'
                onChangeValue={() => null}
                zIndex={9000}
            />
        </View>
    )

    const renderFormJenisAtap = () => (
        <View style={styles.MT8}>
            <Text>Jenis Atap (*)</Text>
            <DropDownPicker
                open={openJenisAtap}
                value={valueJenisAtap}
                items={itemsJenisAtap}
                setOpen={setOpenJenisAtap}
                setValue={setValueJenisAtap}
                setItems={setItemsJenisAtap}
                placeholder='Pilih Jenis Atap'
                onChangeValue={() => null}
                zIndex={8000}
            />
        </View>
    )

    const renderFormDinding = () => (
        <View style={styles.MT8}>
            <Text>Dinding (*)</Text>
            <DropDownPicker
                open={openDinding}
                value={valueDinding}
                items={itemsDinding}
                setOpen={setOpenDinding}
                setValue={setValueDinding}
                setItems={setItemsDinding}
                placeholder='Pilih Dinding'
                onChangeValue={() => null}
                zIndex={7000}
            />
        </View>
    )

    const renderFormLantai = () => (
        <View style={styles.MT8}>
            <Text>Lantai (*)</Text>
            <DropDownPicker
                open={openLantai}
                value={valueLantai}
                items={itemsLantai}
                setOpen={setOpenLantai}
                setValue={setValueLantai}
                setItems={setItemsLantai}
                placeholder='Pilih Lantai'
                onChangeValue={() => null}
                zIndex={6000}
            />
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
                    <Text>Save Draft</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderButtonSimpan = () => (
        <View style={styles.P16}>
            <TouchableOpacity
                onPress={() => null}
            >
                <View style={styles.buttonSubmitContainer}>
                    <Text style={styles.buttonSubmitText}>SIMPAN</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderSpace = () => (
        <View style={styles.spaceGray} />
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
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

export default InisiasiFormUKKondisiRumah;
