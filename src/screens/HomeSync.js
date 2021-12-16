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
    const [fetching, setFetching] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isVisibleModalSearchListView, setIsVisibleModalSearchListView] = useState(false);

    useEffect(() => {
        syncData();
    }, []);

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

            // console.log("keluar")

            // setIsRkh(true);
        });

        // AsyncStorage.getItem('SyncDate', (error, syncDate) => {
        //     if(){
                
        //     }
        //     if (syncDate === now) props.onSuccess();
        // });
    }

    const fetchData = (keyword = '') => {
        if (__DEV__) console.log('fetchData loaded');

        let search = undefined;
        if (keyword !== '') search = keyword;

        let createdBy = undefined;
        if (selectedIndexFilterProspek === 0) createdBy = props.username;

        const route = `${ApiSyncInisiasi}GetListClient/${props.cabangid}/${createdBy}/${search}/1/10000`;
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
            prospekFilter: selectedIndexFilterProspek
        };
        getSyncData(params).then((responseJson) => {
            if (__DEV__) console.log('doSubmit getSyncData response:', responseJson);

            Alert.alert(
                "Sukses",
                "Sync berhasil dilakukan, Anda akan memasuki menu utama",
                [
                    { text: "OK", onPress: () => {
                        props.onSuccess();
                    }}
                ],
                { cancelable: false }
            )
            setSubmitted(false);
        }).catch((error) => {
            if (__DEV__) console.log('doSubmit getSyncData error:', error);
            ToastAndroid.show(JSON.stringify(error), ToastAndroid.SHORT);
            setSubmitted(false);
        })
    }

    const renderHeaderMenu = () => (
        <View
            style={styles.containerHeader}
        >
            <Text>{``}</Text>
        </View>
    )

    const renderHeaderProfile = () => (
        <View style={{marginHorizontal: scale(15)}}>
            <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.PUTIH}}>Hi, {props.aoname}</Text>
            <Text style={{color: colors.PUTIH}}>{props.username}</Text>
            <Text style={{color: colors.PUTIH}}>{props.namacabang}</Text>
            <Text style={{color: colors.PUTIH}}>{now}</Text>
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

    const renderProspekResult = () => (
        <>
            <View
                style={
                    {
                        borderWidth: 1,
                        borderColor: colors.HITAM,
                        borderRadius: 4,
                        marginTop: 8,
                        height: 260
                    }
                }
            >
                {renderProspekResultSearch()}
                <ScrollView>
                    {selectedItemsProspek.length > 0 ? renderProspekResultList() : renderProspekResultEmpty()}
                </ScrollView>
            </View>
        </>
    )

    const renderProspek = () => (
        <>
            {renderProspekFilter()}
            {renderProspekButton()}
            {renderProspekResult()}
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
            {renderProspek()}
            {renderButton()}
            <Text style={{ fontSize: 10, marginTop: 16 }}>{JSON.stringify(selectedItemsProspek)}</Text>
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

    const renderSpace = () => (
        <View style={styles.greySpace} />
    )

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />
            {renderHeader()}
            {renderBody()}
            {renderModalSearchListView()}
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
