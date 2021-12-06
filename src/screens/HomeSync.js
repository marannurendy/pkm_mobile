import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput, ScrollView, ToastAndroid, Alert, SafeAreaView } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { scale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { ApiSyncInisiasi } from '../../dataconfig/index'
import { getSyncData } from './../actions/sync';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import 'moment/locale/id';
import SearchListView from '../components/SearchListView';

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
            })
        } catch(error) {
            if (__DEV__) console.log('fetchData $get /inisiasi/GetListClient error:', error);
            setFetching(false);
        }
    }

    const doSubmit = () => {
        if (__DEV__) console.log('doSubmit loaded');
        if (submitted) return true;

        setSubmitted(true);
        const params = { 
            username: props.username,
            cabangid: props.cabangid
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

    const doSubmitProspek = () => {
        if (__DEV__) console.log('doSubmitProspek loaded');
        if (__DEV__) console.log('doSubmitProspek selectedItemsProspek:', selectedItemsProspek);

        Alert.alert(
            "Sukses",
            "Data prospek berhasil disimpan",
            [
                { 
                    text: "OK",
                    onPress: () => {}
                }
            ],
            { cancelable: false }
        );
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
            onPress={() => setSelectedIndexFilterProspek(index)}
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
            onPress={() => setIsVisibleModalSearchListView(true)}
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
            <Text>{JSON.parse(item).Nama}</Text>
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
            <FontAwesomeIcon name="database" size={32} color={colors.DEFAULT} />
            <Text
                style={
                    {
                        marginVertical: 8,
                        textAlign: 'center'
                    }
                }
            >
                {fetching ? 'Loading...' : `Data tidak ditemukan\ncoba cari "Prospek" lain.`}
            </Text>
        </View>
    )

    const renderProspekResultButton = () => (
        <View
            style={
                {
                    flexDirection: "row",
                    marginVertical: 16
                }
            }
        >
            <TouchableOpacity
                onPress={() => selectedItemsProspek.length === 0 ? null : doSubmitProspek()}
                style={
                    {
                        backgroundColor: selectedItemsProspek.length === 0 ? 'gray' : colors.DEFAULT,
                        padding: 8,
                        borderRadius: 6
                    }
                }
            >
                <Text 
                style={
                    {
                        color: colors.PUTIH        
                    }
                }>
                    Simpan
                </Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
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
                    {dataProspekResponse.length > 0 ? renderProspekResultList() : renderProspekResultEmpty()}
                </ScrollView>
            </View>
            {renderProspekResultButton()}
        </>
    )

    const renderProspek = () => (
        <>
            {renderProspekFilter()}
            {renderProspekButton()}
            {renderProspekResult()}
            <Text>{JSON.stringify(selectedItemsProspek)}</Text>
        </>
    )

    const renderButton = () => (
        <View
            style={
                {
                    flexDirection: 'row'
                }
            }
        >
            <View style={{ flex: 1 }} />
            <TouchableOpacity
                // onPress={() => submitted || selectedItemsProspek.length === 0 ? null : doSubmit()}
                onPress={() => doSubmit()}
            >
                <View
                    style={
                        {
                            padding: 12,
                            backgroundColor: submitted || selectedItemsProspek.length === 0 ? 'gray' : colors.DEFAULT,
                            borderRadius: 45,
                            borderWidth: 8,
                            borderColor: 'whitesmoke'
                        }
                    }
                >
                    <MaterialCommunityIcons name="sync" color={colors.PUTIH} size={32} />
                </View>
            </TouchableOpacity>
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
        </View>
    )

    const renderModalSearchListView = () => (
        <SearchListView 
            visible={isVisibleModalSearchListView}
            onDismiss={() => setIsVisibleModalSearchListView(!isVisibleModalSearchListView)}
            datas={dataProspekResponse}
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
