import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import BouncyCheckbox from "react-native-bouncy-checkbox";
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

const InisiasiFormUKSektorEkonomi = ({ route }) => {
    const { groupName, namaNasabah } = route.params;
    const navigation = useNavigation();
    const [ currentDate, setCurrentDate ] = useState();
    const [openSektorEkonomi, setOpenSektorEkonomi] = useState(false);
    const [valueSektorEkonomi, setValueSektorEkonomi] = useState(null);
    const [itemsSektorEkonomi, setItemsSektorEkonomi] = useState([{ label: 'Perdagangan', value: '1' }]);
    const [openSubSektorEkonomi, setOpenSubSektorEkonomi] = useState(false);
    const [valueSubSektorEkonomi, setValueSubSektorEkonomi] = useState(null);
    const [itemsSubSektorEkonomi, setItemsSubSektorEkonomi] = useState([{ label: 'Perdagangan Barang', value: '1' }]);
    const [openJenisUsaha, setOpenJenisUsaha] = useState(false);
    const [valueJenisUsaha, setValueJenisUsaha] = useState(null);
    const [itemsJenisUsaha, setItemsJenisUsaha] = useState([{ label: 'Jualan Mainan Anak-anak', value: '1' }]);

    useEffect(() => {
        setInfo();
        getUKSektorEkonomi();
    }, [])

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

    const getUKSektorEkonomi = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_SektorEkonomi WHERE nama_lengkap = '` + namaNasabah + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_SektorEkonomi length:', dataLength);
                    if (dataLength > 0) {
                        
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data:', data);
                        if (data.sektor_Ekonomi !== null && typeof data.sektor_Ekonomi !== 'undefined') setValueSektorEkonomi(data.sektor_Ekonomi);
                        if (data.sub_Sektor_Ekonomi !== null && typeof data.sub_Sektor_Ekonomi !== 'undefined') setValueSubSektorEkonomi(data.sub_Sektor_Ekonomi);
                        if (data.jenis_Usaha !== null && typeof data.jenis_Usaha !== 'undefined') setValueJenisUsaha(data.jenis_Usaha);
                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_SektorEkonomi error:', error.message);
                })
            }
        )
    }

    const doSubmitDraft = () => {
        if (__DEV__) console.log('doSubmitDraft loaded');
        if (__DEV__) console.log('doSubmitDraft valueSektorEkonomi:', valueSektorEkonomi);
        if (__DEV__) console.log('doSubmitDraft valueSubSektorEkonomi:', valueSubSektorEkonomi);
        if (__DEV__) console.log('doSubmitDraft valueJenisUsaha:', valueJenisUsaha);

        const find = 'SELECT * FROM Table_UK_SektorEkonomi WHERE nama_lengkap = "'+ namaNasabah +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_SektorEkonomi (nama_lengkap, sektor_Ekonomi, sub_Sektor_Ekonomi, jenis_Usaha) values ("' + namaNasabah + '","' + valueSektorEkonomi + '","' + valueSubSektorEkonomi + '","' + valueJenisUsaha + '")';
                    } else {
                        query = 'UPDATE Table_UK_SektorEkonomi SET sektor_Ekonomi = "' + valueSektorEkonomi + '", sub_Sektor_Ekonomi = "' + valueSubSektorEkonomi + '", jenis_Usaha = "' + valueJenisUsaha + '" WHERE nama_lengkap = "' + namaNasabah + '"';
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
                                        tx.executeSql("SELECT * FROM Table_UK_SektorEkonomi", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_SektorEkonomi RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_SektorEkonomi ERROR:', error);
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

    const renderFormSektorEkonomi = () => (
        <View style={styles.MT8}>
            <Text>Sektor Ekonomi (*)</Text>
            <DropDownPicker
                open={openSektorEkonomi}
                value={valueSektorEkonomi}
                items={itemsSektorEkonomi}
                setOpen={setOpenSektorEkonomi}
                setValue={setValueSektorEkonomi}
                setItems={setItemsSektorEkonomi}
                placeholder='Pilih Sektor Ekonomi'
                onChangeValue={() => null}
                zIndex={10000}
            />
        </View>
    )

    const renderFormSubSektorEkonomi = () => (
        <View style={styles.MT8}>
            <Text>Sub Sektor Ekonomi (*)</Text>
            <DropDownPicker
                open={openSubSektorEkonomi}
                value={valueSubSektorEkonomi}
                items={itemsSubSektorEkonomi}
                setOpen={setOpenSubSektorEkonomi}
                setValue={setValueSubSektorEkonomi}
                setItems={setItemsSubSektorEkonomi}
                placeholder='Pilih Sub Sektor Ekonomi'
                onChangeValue={() => null}
                zIndex={9000}
            />
        </View>
    )

    const renderFormJenisUsaha = () => (
        <View style={styles.MT8}>
            <Text>Jenis Usaha (*)</Text>
            <DropDownPicker
                open={openJenisUsaha}
                value={valueJenisUsaha}
                items={itemsJenisUsaha}
                setOpen={setOpenJenisUsaha}
                setValue={setValueJenisUsaha}
                setItems={setItemsJenisUsaha}
                placeholder='Pilih Jenis Usaha'
                onChangeValue={() => null}
                zIndex={8000}
            />
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

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderFormSektorEkonomi()}
            {renderFormSubSektorEkonomi()}
            {renderFormJenisUsaha()}
            {renderButtonSaveDraft()}
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>Sektor Ekonomi</Text>
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

export default InisiasiFormUKSektorEkonomi;
