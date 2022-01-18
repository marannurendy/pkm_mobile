import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, ToastAndroid, Alert, SafeAreaView } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { scale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { ApiSyncInisiasi } from '../../dataconfig/index'
import { getSyncData } from './../actions/sync';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import 'moment/locale/id';
import SearchListView from '../components/SearchListView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Colors } from 'react-native-paper';
import db from '../database/Database'
import { RadioButton } from 'react-native-paper';

const colors = {
    HITAM: '#000',
    PUTIH: '#FFF',
    DEFAULT: '#0D67B2'
}

export default function FrontHomeSync(props) {
    const navigation = useNavigation();
    const now = moment().format('LLLL');
    const dataFilterProspek = [
        {
            id: 1,
            title: 'Sendiri'
        },
        {
            id: 2,
            title: 'Semua'
        },
        {
            id: 3,
            title: 'Tidak'
        }
    ];

    const [selectedIndexFilterProspek, setSelectedIndexFilterProspek] = useState(1);
    const [selectedItemsProspek, setSelectedItemsProspek] = useState([]);
    const [dataProspekResponse, setDataProspekResponse] = useState([]);
    const [dataProspekLamaResponse, setDataProspekLamaResponse] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isVisibleModalSearchListView, setIsVisibleModalSearchListView] = useState(false);
    const [selectedItemsProspekLama, setSelectedItemsProspekLama] = useState([]);
    const [fetchingProspekLama, setFetchingProspekLama] = useState(false);
    const [isVisibleModalProspekLamaSearchListView, setIsVisibleModalProspekLamaSearchListView] = useState(false);
    const [valueGetMaster, setValueGetMaster] = useState(true);
    const [absentMaster, setAbsentMaster] = useState(null);
    const [religionMaster, setReligionMaster] = useState(null);
    const [livingTypeMaster, setLivingTypeMaster] = useState(null);
    const [identityTypeMaster, setIdentityTypeMaster] = useState(null);
    const [partnerJobMaster, setPartnerJobMaster] = useState(null);
    const [residenceLocationMaster, setResidenceLocationMaster] = useState(null);
    const [dwellingConditionMaster, setDwellingConditionMaster] = useState(null);
    const [pembiayaanLainMaster, setPembiayaanLainMaster] = useState(null);
    const [educationMaster, setEducationMaster] = useState(null);
    const [productMaster, setProductMaster] = useState(null);
    const [economicSectorMaster, setEconomicSectorMaster] = useState(null);
    const [relationStatusMaster, setRelationStatusMaster] = useState(null);
    const [marriageStatusMaster, setMarriageStatusMaster] = useState(null);
    const [homeStatusMaster, setHomeStatusnMaster] = useState(null);
    const [referralMaster, setReferralMaster] = useState(null);
    const [transFundMaster, setTransFundMaster] = useState(null);
    const [jenisPembiayaanMaster, setJenisPembiayaanMaster] = useState(null);
    const [subjenisPembiayaanMaster, setSubjenisPembiayaanMaster] = useState(null);
    const [tujuanPembiayaanMaster, setTujuanPembiayaanMaster] = useState(null);
    const [kategoritujuanPembiayaanMaster, setKategoritujuanPembiayaanMaster] = useState(null);
    const [frekuensiMaster, setFrekuensiMaster] = useState(null);
    const [wilayahMobileMaster, setWilayahMobileMaster] = useState(null);
    const [setUKtimeOutMaster, setSetUKtimeOutMaster] = useState(null);
    const [masterAvailableSubGroupMaster, setMasterAvailableSubGroupMaster] = useState(null);
    const [masterGroupProduct, setMasterGroupProduct] = useState(null);

    useEffect(() => {
        syncData();
        getMasterAsyncStorage();
    }, []);

    async function getMasterAsyncStorage() {
        if (__DEV__) console.log('getMasterAsyncStorage loaded');

        const absent = await AsyncStorage.getItem('Absent');
        const religion = await AsyncStorage.getItem('Religion');
        const livingType = await AsyncStorage.getItem('LivingType');
        const identityType = await AsyncStorage.getItem('IdentityType');
        const partnerJob = await AsyncStorage.getItem('PartnerJob');
        const dwellingCondition = await AsyncStorage.getItem('DwellingCondition');
        const residenceLocation = await AsyncStorage.getItem('ResidenceLocation');
        const pembiayaanLain = await AsyncStorage.getItem('PembiayaanLain');
        const education = await AsyncStorage.getItem('Education');
        const product = await AsyncStorage.getItem('Product');
        const economicSector = await AsyncStorage.getItem('EconomicSector');
        const relationStatus = await AsyncStorage.getItem('RelationStatus');
        const marriageStatus = await AsyncStorage.getItem('MarriageStatus');
        const homeStatus = await AsyncStorage.getItem('HomeStatus');
        const referral = await AsyncStorage.getItem('Referral');
        const transFund = await AsyncStorage.getItem('TransFund');
        const jenisPembiayaan = await AsyncStorage.getItem('JenisPembiayaan');
        const subjenisPembiayaan = await AsyncStorage.getItem('SubjenisPembiayaan');
        const tujuanPembiayaan = await AsyncStorage.getItem('TujuanPembiayaan');
        const kategoritujuanPembiayaan = await AsyncStorage.getItem('KategoritujuanPembiayaan');
        const frekuensi = await AsyncStorage.getItem('Frekuensi');
        const wilayahMobile = await AsyncStorage.getItem('WilayahMobile');
        const setUKtimeOut = await AsyncStorage.getItem('SetUKtimeOut');
        const masterAvailableSubGroup = await AsyncStorage.getItem('MasterAvailableSubGroup');
        const masterGroupProduct = await AsyncStorage.getItem('MasterGroupProduct');

        if (__DEV__) console.log('getMasterAsyncStorage absent:', absent);
        if (__DEV__) console.log('getMasterAsyncStorage religion:', religion);
        if (__DEV__) console.log('getMasterAsyncStorage livingType:', livingType);
        if (__DEV__) console.log('getMasterAsyncStorage identityType:', identityType);
        if (__DEV__) console.log('getMasterAsyncStorage partnerJob:', partnerJob);
        if (__DEV__) console.log('getMasterAsyncStorage dwellingCondition:', dwellingCondition);
        if (__DEV__) console.log('getMasterAsyncStorage residenceLocation:', residenceLocation);
        if (__DEV__) console.log('getMasterAsyncStorage pembiayaanLain:', pembiayaanLain);
        if (__DEV__) console.log('getMasterAsyncStorage education:', education);
        if (__DEV__) console.log('getMasterAsyncStorage product:', product);
        if (__DEV__) console.log('getMasterAsyncStorage economicSector:', economicSector);
        if (__DEV__) console.log('getMasterAsyncStorage relationStatus:', relationStatus);
        if (__DEV__) console.log('getMasterAsyncStorage marriageStatus:', marriageStatus);
        if (__DEV__) console.log('getMasterAsyncStorage homeStatus:', homeStatus);
        if (__DEV__) console.log('getMasterAsyncStorage referral:', referral);
        if (__DEV__) console.log('getMasterAsyncStorage transFund:', transFund);
        if (__DEV__) console.log('getMasterAsyncStorage jenisPembiayaan:', jenisPembiayaan);
        if (__DEV__) console.log('getMasterAsyncStorage subjenisPembiayaan:', subjenisPembiayaan);
        if (__DEV__) console.log('getMasterAsyncStorage tujuanPembiayaan:', tujuanPembiayaan);
        if (__DEV__) console.log('getMasterAsyncStorage kategoritujuanPembiayaan:', kategoritujuanPembiayaan);
        if (__DEV__) console.log('getMasterAsyncStorage frekuensi:', frekuensi);
        if (__DEV__) console.log('getMasterAsyncStorage wilayahMobile:', wilayahMobile);
        if (__DEV__) console.log('getMasterAsyncStorage setUKtimeOut:', setUKtimeOut);
        if (__DEV__) console.log('getMasterAsyncStorage masterAvailableSubGroup:', masterAvailableSubGroup);
        if (__DEV__) console.log('getMasterAsyncStorage MasterGroupProduct:', masterGroupProduct);

        setAbsentMaster(absent);
        setReligionMaster(religion);
        setLivingTypeMaster(livingType);
        setIdentityTypeMaster(identityType);
        setPartnerJobMaster(partnerJob);
        setDwellingConditionMaster(dwellingCondition);
        setResidenceLocationMaster(residenceLocation);
        setPembiayaanLainMaster(pembiayaanLain);
        setEducationMaster(education);
        setProductMaster(product);
        setEconomicSectorMaster(economicSector);
        setRelationStatusMaster(relationStatus);
        setMarriageStatusMaster(marriageStatus);
        setHomeStatusnMaster(homeStatus);
        setReferralMaster(referral);
        setTransFundMaster(transFund);
        setJenisPembiayaanMaster(jenisPembiayaan);
        setSubjenisPembiayaanMaster(subjenisPembiayaan);
        setTujuanPembiayaanMaster(tujuanPembiayaan);
        setKategoritujuanPembiayaanMaster(kategoritujuanPembiayaan);
        setFrekuensiMaster(frekuensi);
        setWilayahMobileMaster(wilayahMobile);
        setSetUKtimeOutMaster(setUKtimeOut);
        setMasterAvailableSubGroupMaster(masterAvailableSubGroup);
        setMasterGroupProduct(masterGroupProduct);
    }

    useEffect(() => {
        setValueGetMaster(!isGetMaster());
    }, [absentMaster, religionMaster, livingTypeMaster, identityTypeMaster, partnerJobMaster, dwellingConditionMaster, residenceLocationMaster, pembiayaanLainMaster, educationMaster, productMaster, economicSectorMaster, relationStatusMaster, marriageStatusMaster, homeStatusMaster, referralMaster, transFundMaster, jenisPembiayaanMaster, tujuanPembiayaanMaster, kategoritujuanPembiayaanMaster, frekuensiMaster, wilayahMobileMaster, setUKtimeOutMaster, masterAvailableSubGroupMaster, masterGroupProduct]);

    async function syncData() {
        moment.locale('id');
        var now = moment().format('YYYY-MM-DD');

        const syncStatus = await AsyncStorage.getItem('userData')
        let DetailData = JSON.parse(syncStatus)
        let userName = DetailData.userName

        const syncBy = await AsyncStorage.getItem('SyncBy')
        let dataRole = await JSON.parse(syncBy)
        let lengthData = 0;
        if (dataRole !== null) lengthData = dataRole.filter((x) => x.userName === userName).length || 0;

        AsyncStorage.getItem('SyncDate', (error, syncDate) => {
            if (syncDate !== now || lengthData === 0) {
            } else {
                props.onSuccess()
            }
        });
    }

    const fetchData = (keyword = '') => {
        if (__DEV__) console.log('fetchData loaded');

        let search = undefined;
        if (keyword !== '') search = keyword;

        let createdBy = undefined;
        if (selectedIndexFilterProspek === 0) createdBy = props.username;

        const route = `${ApiSyncInisiasi}GetListClient/${props.cabangid}/${createdBy}/${search}/1/100`;
        if (__DEV__) console.log('fetchData route:', route);

        setFetching(true);
        try {
            fetch(route, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (__DEV__) console.log('fetchData $get /inisiasi/GetListClient success:', responseJson);
                setDataProspekResponse(responseJson);
                setFetching(false);
                if (!isVisibleModalSearchListView) setIsVisibleModalSearchListView(true);
            })
        } catch(error) {
            if (__DEV__) console.log('fetchData $get /inisiasi/GetListClient error:', error);
            setFetching(false);
        }
    }

    const fetchProspekLamaData = (keyword = '') => {
        if (__DEV__) console.log('fetchProspekLamaData loaded');

        let search = undefined;
        if (keyword !== '') search = keyword;

        let createdBy = undefined;
        if (selectedIndexFilterProspek === 0) createdBy = props.username;

        const route = `${ApiSyncInisiasi}GetListClientBRNET/${props.cabangid}/${createdBy}/${search}/1/100`;
        if (__DEV__) console.log('fetchProspekLamaData route:', route);

        setFetchingProspekLama(true);
        try {
            fetch(route, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (__DEV__) console.log('fetchProspekLamaData $get /inisiasi/GetListClientBRNET success:', responseJson);
                setDataProspekLamaResponse(responseJson);
                setFetchingProspekLama(false);
                if (!isVisibleModalProspekLamaSearchListView) setIsVisibleModalProspekLamaSearchListView(true);
            })
        } catch(error) {
            if (__DEV__) console.log('fetchProspekLamaData $get /inisiasi/GetListClientBRNET error:', error);
            setFetchingProspekLama(false);
        }
    }

    const doProspekLamaSubmit = () => {
        if (__DEV__) console.log('doProspekLamaSubmit loaded');

        if (selectedItemsProspekLama.length > 0) {
            if (__DEV__) console.log('doProspekLamaSubmit length', selectedItemsProspekLama.length);
            if (__DEV__) console.log('doProspekLamaSubmit selectedItemsProspekLama', selectedItemsProspekLama);

            var query = 'INSERT INTO Table_Prospek_Lama_PP_Nasabah (id, clientId, name) values ';
            for (var i = 0; i < selectedItemsProspekLama.length; i++) {
                let uniqueNumber = (new Date().getTime()).toString(36);
                const data = JSON.parse(selectedItemsProspekLama[i]);

                const queryDelete = "DELETE FROM Table_Prospek_Lama_PP_Nasabah WHERE clientId = '" + data.ClientID + "'";
                db.transaction(
                    tx => {
                        tx.executeSql(queryDelete, [], (tx, results) => {
                            if (__DEV__) console.log(`${queryDelete} RESPONSE:`, results.rows);
                        })
                    }, function(error) {
                        if (__DEV__) console.log(`${queryDelete} ERROR:`, error);
                    }, function() {}
                );

                query = query + "('"
                + uniqueNumber
                + "','"
                + data.ClientID
                + "','"
                + data.Name
                + "')";

                if (i != selectedItemsProspekLama.length - 1) {
                    query = query + ",";
                }
            }

            query = query + ";";

            if (__DEV__) console.log('ACTIONS INSERT QUERY:', query);

            db.transaction(
                tx => { tx.executeSql(query); }, function(error) {
                    if (__DEV__) console.log('ACTIONS INSERT TRANSACTION ERROR:', error);
                }, function() {
                    if (__DEV__) console.log('ACTIONS INSERT TRANSACTION DONE');
                }
            );
        }
        return;
    }

    const doSubmit = () => {
        if (__DEV__) console.log('doSubmit loaded');
        if (__DEV__) console.log('doSubmit selectedItemsProspek', selectedItemsProspek);
        if (__DEV__) console.log('doSubmit selectedIndexFilterProspek', selectedIndexFilterProspek);

        if (submitted) return true;
        if (![2].includes(selectedIndexFilterProspek) && selectedItemsProspek.length === 0) {
            ToastAndroid.show('Belum ada nama prospek yang dipilih!', ToastAndroid.SHORT);
            return true;
        }

        const prospekMap = selectedItemsProspek.map((prospek, index) => {
            const dataProspek = JSON.parse(prospek);
            return dataProspek.ID_Prospek;
        });
        if (__DEV__) console.log('doSubmit prospekMap', prospekMap);

        setSubmitted(true);
        const params = { 
            username: props.username,
            cabangid: props.cabangid,
            prospekMap,
            prospekFilter: selectedIndexFilterProspek,
            isGetMaster: valueGetMaster
        };
        getSyncData(params).then(async (responseJson) => {
            if (__DEV__) console.log('doSubmit getSyncData response:', responseJson);

            if (responseJson === 'SYNC FAILED TIMEOUT') {
                setSubmitted(false);
                Alert.alert(
                    "Error",
                    "Sync timeout"
                );
                return;
            }

            setSubmitted(false);

            const responseProspekMap = await AsyncStorage.getItem('ProspekMap');
            let totalProspekMap = prospekMap.length ?? 0;
            let totalProspekMapBerhasil = [];
            if (responseProspekMap) totalProspekMapBerhasil = JSON.parse(responseProspekMap)
            if (__DEV__) console.log('TOTAL PROSPEK MAP:', totalProspekMap);
            if (__DEV__) console.log('TOTAL PROSPEK MAP BERHASIL:', totalProspekMapBerhasil.length, totalProspekMapBerhasil);

            const messageRKH = ![2].includes(selectedIndexFilterProspek) ? `\n\nTotal ${totalProspekMap} Nasabah\nBerhasil ${totalProspekMapBerhasil.length}\nGagal ${totalProspekMap - totalProspekMapBerhasil.length} (Nasabah sudah di prospek user lain)` : '';

            Alert.alert(
                "Sukses",
                `Sync berhasil dilakukan, Anda akan memasuki menu utama.${messageRKH}`,
                [
                    { 
                        text: "OK", 
                        onPress: () => __DEV__ && console.log('onPress loaded')
                    }
                ],
                { cancelable: false }
            )
            doProspekLamaSubmit();
            props.onSuccess();
        }).catch((error) => {
            if (__DEV__) console.log('doSubmit getSyncData error:', error);
            ToastAndroid.show(JSON.stringify(error), ToastAndroid.SHORT);
            setSubmitted(false);
        })
    }

    const LogOutButton = () => {
        Alert.alert(
            "Logout Alert",
            "Apakah anda yakin ingin keluar ?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("cancel pressed"),
                    style: "cancel"
                },
                { 
                    text: "OK", 
                    onPress: () => {
                        AsyncStorage.removeItem('userData');
                        navigation.replace('Login');
                    }
                }
            ]
        );
    }

    const isGetMaster = () => {
        return absentMaster !== null && religionMaster !== null && livingTypeMaster !== null && identityTypeMaster !== null && partnerJobMaster !== null && dwellingConditionMaster !== null && residenceLocationMaster !== null && pembiayaanLainMaster !== null && educationMaster !== null && productMaster !== null && economicSectorMaster !== null && relationStatusMaster !== null && marriageStatusMaster !== null && homeStatusMaster !== null && referralMaster !== null && transFundMaster !== null && jenisPembiayaanMaster !== null && subjenisPembiayaanMaster !== null && tujuanPembiayaanMaster !== null && kategoritujuanPembiayaanMaster !== null && frekuensiMaster !== null && wilayahMobileMaster !== null && setUKtimeOutMaster !== null && masterAvailableSubGroupMaster !== null && masterGroupProduct !== null
    }

    const renderHeaderMenu = () => (
        <View
            style={styles.containerHeader}
        >
            <Text>{``}</Text>
        </View>
    )

    const renderHeaderProfile = () => (
        <View style={{marginHorizontal: scale(15), flexDirection: 'row', alignItems: 'flex-end'}}>
            <View style={{ flex: 1 }}>
                <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.PUTIH}}>Hi, {props.aoname}</Text>
                <Text style={{color: colors.PUTIH}}>{props.username}</Text>
                <Text style={{color: colors.PUTIH}}>{props.namacabang}</Text>
                <Text style={{color: colors.PUTIH}}>{now}</Text>
            </View>
            <View>
                <Text style={{ color: 'white', fontSize: 18 }} onPress={() => LogOutButton()}>Logout</Text>
            </View>
        </View>
    )

    const renderHeader = () => (
        <View
            style={
                {
                    paddingBottom: 16
                }
            }
        >
            {renderHeaderMenu()}
            {renderHeaderProfile()}
        </View>
    )

    const renderCustomList = () => (
        <RadioButton.Group onValueChange={newValue => setValueGetMaster(newValue)} value={valueGetMaster}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                    <RadioButton value={true} />
                    <Text>Tarik Master</Text>
                </View>
                {isGetMaster() && (
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                        <RadioButton value={false} />
                        <Text>Skip</Text>
                    </View>
                )}
            </View>
        </RadioButton.Group>
    )

    const renderProspekList = () => dataFilterProspek.map((item, index) => (
        <TouchableOpacity
            key={index}
            onPress={() => {
                setSelectedItemsProspek([]);
                setSelectedIndexFilterProspek(index);
            }}
        >
            <View
                style={
                    {
                        flexDirection: 'row',
                        marginRight: index === dataFilterProspek.length - 1 ? 0 : 16
                    }
                }
            >
                <View style={
                    [
                        styles.checkbox,
                        {
                            backgroundColor: selectedIndexFilterProspek === index ? colors.DEFAULT : colors.PUTIH,
                            borderRadius: 45
                        }
                    ]
                }>
                    {selectedIndexFilterProspek === index ? <FontAwesomeIcon name="circle" size={16} color={colors.PUTIH} /> : <Text>{`     `}</Text>}
                </View>
                <Text style={{ fontSize: 16, color: colors.HITAM }}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    ))

    const renderProspekButton = () => (
        <Text
            style={
                {
                    marginVertical: 8,
                    fontSize: 16,
                    color: colors.DEFAULT,
                    textDecorationLine: 'underline'
                }
            }
            onPress={() => {
                if ([2].includes(selectedIndexFilterProspek)) return true;
                
                fetchData();
            }}
        >
            Tampilkan
        </Text>
    )

    const renderProspekFilter = () => (
        <View style={{flexDirection: 'row'}}>
            <Text style={
                {
                    marginRight: 16,
                    fontSize: 16,
                    color: colors.HITAM
                }
            }>
                Prospek
            </Text>
            {renderProspekList()}
        </View>
    )

    const renderCustomFilter = () => (
        <View style={{ marginBottom: 16, backgroundColor: 'whitesmoke', paddingVertical: 8 }}>
            <View style={{flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>
                <Text style={
                    {
                        marginRight: 16,
                        fontSize: 16,
                        color: colors.HITAM
                    }
                }>
                    Get Master
                </Text>
                {renderCustomList()}
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginRight: 12 }}>
                        <Text style={{ fontSize: 12, color: absentMaster === null ? 'red' : 'green' }}>Absent</Text>
                        <Text style={{ fontSize: 12, color: religionMaster === null ? 'red' : 'green' }}>Religion</Text>
                        <Text style={{ fontSize: 12, color: livingTypeMaster === null ? 'red' : 'green' }}>LivingType</Text>
                        <Text style={{ fontSize: 12, color: identityTypeMaster === null ? 'red' : 'green' }}>IdentityType</Text>
                        <Text style={{ fontSize: 12, color: partnerJobMaster === null ? 'red' : 'green' }}>PartnerJob</Text>
                    </View>
                    <View style={{ marginRight: 12 }}>
                        <Text style={{ fontSize: 12, color: dwellingConditionMaster === null ? 'red' : 'green' }}>DwellingCondition</Text>
                        <Text style={{ fontSize: 12, color: residenceLocationMaster === null ? 'red' : 'green' }}>ResidenceLocation</Text>
                        <Text style={{ fontSize: 12, color: pembiayaanLainMaster === null ? 'red' : 'green' }}>PembiayaanLain</Text>
                        <Text style={{ fontSize: 12, color: educationMaster === null ? 'red' : 'green' }}>Education</Text>
                        <Text style={{ fontSize: 12, color: productMaster === null ? 'red' : 'green' }}>Product</Text>
                    </View>
                    <View style={{ marginRight: 12 }}>
                        <Text style={{ fontSize: 12, color: economicSectorMaster === null ? 'red' : 'green' }}>EconomicSector</Text>
                        <Text style={{ fontSize: 12, color: relationStatusMaster === null ? 'red' : 'green' }}>RelationStatus</Text>
                        <Text style={{ fontSize: 12, color: marriageStatusMaster === null ? 'red' : 'green' }}>MarriageStatus</Text>
                        <Text style={{ fontSize: 12, color: homeStatusMaster === null ? 'red' : 'green' }}>HomeStatus</Text>
                        <Text style={{ fontSize: 12, color: referralMaster === null ? 'red' : 'green' }}>Referral</Text>
                    </View>
                    <View style={{ marginRight: 12 }}>
                        <Text style={{ fontSize: 12, color: transFundMaster === null ? 'red' : 'green' }}>TransFund</Text>
                        <Text style={{ fontSize: 12, color: jenisPembiayaanMaster === null ? 'red' : 'green' }}>JenisPembiayaan</Text>
                        <Text style={{ fontSize: 12, color: subjenisPembiayaanMaster === null ? 'red' : 'green' }}>SubjenisPembiayaan</Text>
                        <Text style={{ fontSize: 12, color: tujuanPembiayaanMaster === null ? 'red' : 'green' }}>TujuanPembiayaan</Text>
                        <Text style={{ fontSize: 12, color: kategoritujuanPembiayaanMaster === null ? 'red' : 'green' }}>KategoritujuanPembiayaan</Text>
                    </View>
                    <View style={{ marginRight: 12 }}>
                        <Text style={{ fontSize: 12, color: frekuensiMaster === null ? 'red' : 'green' }}>Frekuensi</Text>
                        <Text style={{ fontSize: 12, color: wilayahMobileMaster === null ? 'red' : 'green' }}>WilayahMobile</Text>
                        <Text style={{ fontSize: 12, color: setUKtimeOutMaster === null ? 'red' : 'green' }}>SetUKtimeOut</Text>
                        <Text style={{ fontSize: 12, color: masterAvailableSubGroupMaster === null ? 'red' : 'green' }}>MasterAvailableSubGroup</Text>
                        <Text style={{ fontSize: 12, color: masterGroupProduct === null ? 'red' : 'green' }}>MasterGroupProduct</Text>
                    </View>
                </View>
            </ScrollView>
            
        </View>
    )

    const renderProspekResultSearch = () => (
        <TouchableOpacity
            onPress={() => {
                if ([2].includes(selectedIndexFilterProspek)) return true;
                
                fetchData();
            }}
        >
            <View
                style={
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1, 
                        borderColor: colors.HITAM,
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        marginHorizontal: 12,
                        marginVertical: 8
                    }
                }
            >
                <FontAwesomeIcon name="search" size={18} color={colors.HITAM} />
                <Text
                    style={
                        {
                            paddingHorizontal: 8,
                            paddingVertical: 8
                        }
                    }
                >
                    Cari nama prospek
                </Text>
            </View>
        </TouchableOpacity>
        
    )

    const renderProspekLamaResultSearch = () => (
        <TouchableOpacity
            onPress={() => {
                fetchProspekLamaData();
            }}
        >
            <View
                style={
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1, 
                        borderColor: colors.HITAM,
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        marginHorizontal: 12,
                        marginVertical: 8
                    }
                }
            >
                <FontAwesomeIcon name="search" size={18} color={colors.HITAM} />
                <Text
                    style={
                        {
                            paddingHorizontal: 8,
                            paddingVertical: 8
                        }
                    }
                >
                    Cari nama prospek lama
                </Text>
            </View>
        </TouchableOpacity>
        
    )

    const renderProspekResultList = () => selectedItemsProspek.map((item, index) => (
        <View
            key={index}
            style={
                {
                    marginBottom: 8,
                    marginHorizontal: 12
                }
            }
        >
            <Text>{index + 1}. {JSON.parse(item).Nama}</Text>
        </View>
    ))

    const renderProspekLamaResultList = () => selectedItemsProspekLama.map((item, index) => (
        <View
            key={index}
            style={
                {
                    marginBottom: 8,
                    marginHorizontal: 12
                }
            }
        >
            <Text>{index + 1}. {JSON.parse(item).Name}</Text>
        </View>
    ))

    const renderProspekResultEmpty = () => (
        <View
            style={
                {
                    flex: 1,
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 24
                }
            }
        >
            <Text
                style={
                    {
                        marginVertical: 8,
                        textAlign: 'center'
                    }
                }
            >
                {fetching && 'Mohon tunggu...'}
            </Text>
        </View>
    )

    const renderProspekLamaResultEmpty = () => (
        <View
            style={
                {
                    flex: 1,
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 24
                }
            }
        >
            <Text
                style={
                    {
                        marginVertical: 8,
                        textAlign: 'center'
                    }
                }
            >
                {fetchingProspekLama && 'Mohon tunggu...'}
            </Text>
        </View>
    )

    const renderProspekResult = () => (
        <>
            <View
                style={
                    {
                        borderWidth: 1,
                        borderColor: colors.HITAM,
                        borderRadius: 4,
                        marginTop: 8,
                        minHeight: 160
                    }
                }
            >
                {renderProspekResultSearch()}
                <View>
                    {selectedItemsProspek.length > 0 ? renderProspekResultList() : renderProspekResultEmpty()}
                </View>
            </View>
        </>
    )

    const renderProspekLamaResult = () => (
        <>
            <View
                style={
                    {
                        borderWidth: 1,
                        borderColor: colors.HITAM,
                        borderRadius: 4,
                        marginTop: 8,
                        minHeight: 160
                    }
                }
            >
                {renderProspekLamaResultSearch()}
                <View>
                    {selectedItemsProspekLama.length > 0 ? renderProspekLamaResultList() : renderProspekLamaResultEmpty()}
                </View>
            </View>
        </>
    )

    const renderProspek = () => (
        <>
            {renderCustomFilter()}
            {renderProspekFilter()}
            {renderProspekButton()}
            {renderProspekResult()}
        </>
    )

    const renderProspekLama = () => (
        <>
            {renderProspekLamaResult()}
        </>
    )

    const renderButton = () => (
        <View
            style={
                {
                    flexDirection: 'row',
                    marginTop: 16
                }
            }
        >
            <View style={{ flex: 1 }} />
            {!submitted ? (
                <TouchableOpacity
                    onPress={() => doSubmit()}
                >
                    <View
                        style={
                            {
                                padding: 12,
                                backgroundColor: colors.DEFAULT,
                                borderRadius: 45,
                                borderWidth: 8,
                                borderColor: 'whitesmoke'
                            }
                        }
                    >
                        <MaterialCommunityIcons name="sync" color={colors.PUTIH} size={32} />
                    </View>
                </TouchableOpacity>
            ) : (
                <>
                    <ActivityIndicator animating={true} color={Colors.red800} />
                    <Text style={{ marginLeft: 12 }}>{`Sedang sync,\nmohon tunggu...`}</Text>
                </>
            )}
            <View style={{flex: 1}} />
        </View>
    )

    const renderBody = () => (
        <View
            style={
                {
                    backgroundColor: colors.PUTIH,
                    flex: 1,
                    padding: 16
                }
            }
        >
            <ScrollView>
                {renderProspek()}
                {renderProspekLama()}
                {renderButton()}
                {/* <Text style={{ fontSize: 10, marginTop: 16 }}>{JSON.stringify(selectedItemsProspek)}</Text> */}
                {renderVersion()}
            </ScrollView>
        </View>
    )

    const renderModalSearchListView = () => (
        <SearchListView 
            visible={isVisibleModalSearchListView}
            onDismiss={() => setIsVisibleModalSearchListView(!isVisibleModalSearchListView)}
            datas={dataProspekResponse}
            selectedItems={selectedItemsProspek}
            doSearch={(keyword) => fetchData(keyword)}
            doSubmit={(data) => {
                if (__DEV__) console.log('renderModalSearchListView data:', data);
                setIsVisibleModalSearchListView(false);
                setSelectedItemsProspek(data);
            }}
        />
    )

    const renderModalProspekLamaSearchListView = () => (
        <SearchListView 
            visible={isVisibleModalProspekLamaSearchListView}
            onDismiss={() => setIsVisibleModalProspekLamaSearchListView(!isVisibleModalProspekLamaSearchListView)}
            datas={dataProspekLamaResponse}
            selectedItems={selectedItemsProspekLama}
            doSearch={(keyword) => fetchProspekLamaData(keyword)}
            doSubmit={(data) => {
                if (__DEV__) console.log('renderModalProspekLamaSearchListView data:', data);
                setIsVisibleModalProspekLamaSearchListView(false);
                setSelectedItemsProspekLama(data);
            }}
            keyName="Name"
            placeholderTitle='Cari nama prospek lama'
        />
    )

    const renderSpace = () => (
        <View style={styles.greySpace} />
    )

    const renderVersion = () => (
        <View style={{ marginVertical: 8 }}>
            <Text style={{ textAlign: 'center' }}>version pkm_mobile-0.0.2-002-dev @ 2021-01-19</Text>
            {/* <Text style={{ textAlign: 'center' }}>version pkm_mobile-0.0.1-003-prod @ 2021-01-11</Text> */}
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />
            {renderHeader()}
            {renderBody()}
            {renderModalSearchListView()}
            {renderModalProspekLamaSearchListView()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.DEFAULT
    },
    containerHeader: {
        marginTop: scale(35),
        paddingHorizontal: scale(15),
        alignItems: 'flex-end'
    },
    greySpace: {
        marginVertical: 8,
        height: 1,
        backgroundColor: colors.PUTIH
    },
    checkbox: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        marginRight: 8,
        borderWidth: 1,
        borderColor: colors.HITAM,
        borderRadius: 4
    }
});