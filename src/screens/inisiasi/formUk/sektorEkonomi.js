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

const InisiasiFormUKSektorEkonomi = ({ route }) => {
    const { id, groupName, namaNasabah, screenState, statusSosialisasi } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [valueSektorEkonomi, setValueSektorEkonomi] = useState(null);
    const [valueSubSektorEkonomi, setValueSubSektorEkonomi] = useState(null);
    const [valueJenisUsaha, setValueJenisUsaha] = useState(null);
    const [submmitted, setSubmmitted] = useState(false);
    const [dataEconomicSector, setDataEconomicSector] = useState([]);
    const [selectedSektorEkonomi, setSelectedSektorEkonomi] = useState(null);

    useEffect(() => {
        setInfo();
        getStorageEconomicSector();
        getUKSektorEkonomi();
    }, [])

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

    const getUKSektorEkonomi = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_SektorEkonomi WHERE idSosialisasiDatabase = '` + id + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_SektorEkonomi length:', dataLength);
                    if (dataLength > 0) {
                        
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data:', data);
                        
                        const setSektorEkonomi = () => {
                            if (__DEV__) console.log('setSektorEkonomi loaded');
                            return new Promise((resolve, reject) => {
                                if (data.sektor_Ekonomi !== null && typeof data.sektor_Ekonomi !== 'undefined') {
                                    setTimeout(() => {
                                        setValueSektorEkonomi(data.sektor_Ekonomi);
                                        return resolve('next');
                                    }, 1000);
                                }
                                return resolve('next');
                            });
                        }

                        const setSubSektorEkonomi = () => {
                            if (__DEV__) console.log('setSubSektorEkonomi loaded');
                            return new Promise((resolve, reject) => {
                                if (data.sub_Sektor_Ekonomi !== null && typeof data.sub_Sektor_Ekonomi !== 'undefined') {
                                    setTimeout(() => {
                                        setValueSubSektorEkonomi(data.sub_Sektor_Ekonomi);
                                        return resolve('next');
                                    }, 1500);
                                }
                                return resolve('next');
                            });
                        }

                        Promise.all([setSektorEkonomi(), setSubSektorEkonomi()]).then((response) => {
                            if (data.jenis_Usaha !== null && typeof data.jenis_Usaha !== 'undefined') setValueJenisUsaha(data.jenis_Usaha);
                        });
                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_SektorEkonomi error:', error.message);
                })
            }
        )
    }

    const getStorageEconomicSector = async () => {
        if (__DEV__) console.log('getStorageEconomicSector loaded');

        try {
            const response = await AsyncStorage.getItem('EconomicSector');
            if (response !== null) {
                const responseJSON = JSON.parse(response);
                if (responseJSON.length > 0 ?? false) {
                    setDataEconomicSector(responseJSON);
                    return;
                }
            }
            setDataEconomicSector([]);
        } catch (error) {
            setDataEconomicSector([]);
        }
    }

    const doSubmitDraft = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('doSubmitDraft loaded');
        if (__DEV__) console.log('doSubmitDraft valueSektorEkonomi:', valueSektorEkonomi);
        if (__DEV__) console.log('doSubmitDraft valueSubSektorEkonomi:', valueSubSektorEkonomi);
        if (__DEV__) console.log('doSubmitDraft valueJenisUsaha:', valueJenisUsaha);

        const find = 'SELECT * FROM Table_UK_SektorEkonomi WHERE idSosialisasiDatabase = "'+ id +'"';
        db.transaction(
            tx => {
                tx.executeSql(find, [], (txFind, resultsFind) => {
                    let dataLengthFind = resultsFind.rows.length
                    if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                    let query = '';
                    if (dataLengthFind === 0) {
                        query = 'INSERT INTO Table_UK_SektorEkonomi (nama_lengkap, sektor_Ekonomi, sub_Sektor_Ekonomi, jenis_Usaha, idSosialisasiDatabase) values ("' + namaNasabah + '","' + valueSektorEkonomi + '","' + valueSubSektorEkonomi + '","' + valueJenisUsaha + '","' + id + '")';
                    } else {
                        query = 'UPDATE Table_UK_SektorEkonomi SET sektor_Ekonomi = "' + valueSektorEkonomi + '", sub_Sektor_Ekonomi = "' + valueSubSektorEkonomi + '", jenis_Usaha = "' + valueJenisUsaha + '" WHERE idSosialisasiDatabase = "' + id + '"';
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
                                        tx.executeSql("SELECT * FROM Table_UK_SektorEkonomi", [], (tx, results) => {
                                            if (__DEV__) console.log('SELECT * FROM Table_UK_SektorEkonomi RESPONSE:', results.rows);
                                        })
                                    }, function(error) {
                                        if (__DEV__) console.log('SELECT * FROM Table_UK_SektorEkonomi ERROR:', error);
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

        if (statusSosialisasi === '3' && (!valueSektorEkonomi || typeof valueSektorEkonomi === 'undefined' || valueSektorEkonomi === '' || valueSektorEkonomi === 'null')) return alert('Sektor Ekonomi (*) tidak boleh kosong');
        if (statusSosialisasi === '3' && (!valueSubSektorEkonomi || typeof valueSubSektorEkonomi === 'undefined' || valueSubSektorEkonomi ==='' || valueSubSektorEkonomi === 'null')) return alert('Sub Sektor Ekonomi (*) tidak boleh kosong');
        if (statusSosialisasi === '3' && (!valueJenisUsaha || typeof valueJenisUsaha === 'undefined' || valueJenisUsaha ==='' || valueJenisUsaha === 'null')) return alert('Jenis Usaha (*) tidak boleh kosong');

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
                    
                    if (screenState === 3) {
                        let query = 'UPDATE Table_UK_Master SET status = "4" WHERE idSosialisasiDatabase = "' + id + '"';
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

    const generateSubSektorEkonomi = () => {
        if (__DEV__) console.log('generateSubSektorEkonomi loaded');
        
        if (!selectedSektorEkonomi && !valueSektorEkonomi) return null;
        if (!selectedSektorEkonomi && valueSektorEkonomi) {
            const selected = dataEconomicSector.filter(data => data.id === valueSektorEkonomi)[0] || null;
            return selected && dataEconomicSector.filter(data => data.economicSectorDetail === selected.economicSectorDetail).map((x, i) => <Picker.Item key={i} label={x.subSectorDetail} value={x.idSubsector} />)
        }
        
        return dataEconomicSector.filter(data => data.economicSectorDetail === selectedSektorEkonomi.economicSectorDetail).map((x, i) => <Picker.Item key={i} label={x.subSectorDetail} value={x.idSubsector} />);
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

    const renderFormSektorEkonomi = () => (
        <View style={styles.MT8}>
            <Text>Sektor Ekonomi {statusSosialisasi === '3' && '(*)'}</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueSektorEkonomi}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => {
                        console.log('item value', itemValue)
                        console.log('ini data sector ekonomi ====>', dataEconomicSector)
                        setSelectedSektorEkonomi([...new Map(dataEconomicSector.map(item => [item['economicSectorDetail'], item]).filter(item => item['idSubsector'] == itemValue)).values()][itemIndex - 1]);
                        setValueSektorEkonomi(itemValue);
                    }}
                >
                    <Picker.Item label={'-- Pilih --'} value={null} />
                    {[...new Map(dataEconomicSector.map(item => [item['economicSectorDetail'], item])).values()].map((x, i) => <Picker.Item key={i} label={x.economicSectorDetail} value={x.id} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormSubSektorEkonomi = () => (
        <View style={styles.MT8}>
            <Text>Sub Sektor Ekonomi {statusSosialisasi === '3' && '(*)'}</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valueSubSektorEkonomi}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValueSubSektorEkonomi(itemValue)}
                >
                    <Picker.Item label={'-- Pilih --'} value={null} />
                    {generateSubSektorEkonomi()}
                </Picker>
            </View>
        </View>
    )

    const renderFormJenisUsaha = () => (
        <View style={styles.MT8}>
            <Text>Jenis Usaha {statusSosialisasi === '3' && '(*)'}</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueJenisUsaha} 
                        onChangeText={(text) => setValueJenisUsaha(text)}
                        placeholder='Jual Mainan Anak-anak'
                        style={styles.F1}
                    />
                </View>
                <View />
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
