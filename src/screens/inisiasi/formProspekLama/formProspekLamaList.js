import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, StyleSheet, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import { ApiSyncInisiasi } from '../../../../dataconfig/index';
import db from '../../../database/Database'

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const withTextInput = dimension.width - (20 * 4) + 8;

const InisiasiFormProspekLamaList = ({ route }) => {
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [keyword, setKeyword] = useState('');
    const [data, setData] = useState([]);
    const [dataSQLite, setDataSQLite] = useState([]);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        getUserData();
        setInfo();
        // fetchData('');
        fetchSQLite();
    }, []);

    const getUserData = () => {
        AsyncStorage.getItem('userData', (error, result) => {
            if (error) __DEV__ && console.log('userData error:', error);
            if (__DEV__) console.log('userData response:', result);
        });
    }

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');
        setCurrentDate(tanggal);
    }

    const fetchSQLite = () => {
        if (__DEV__) console.log('fetchSQLite loaded');

        let query = 'SELECT * FROM Table_Prospek_Lama_PP_Nasabah';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    var ah = [];
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({ "clientId": data.clientId, "name": data.name });
                    }
                    setDataSQLite(ah)
                })
            }
        );
    }

    const fetchData = (keyword = '') => {
        if (__DEV__) console.log('fetchData loaded');

        let search = undefined;
        if (keyword !== '') search = keyword;

        const route = `${ApiSyncInisiasi}GetListClientBRNET/90091/undefined/${search}/1/100`;
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
                if (__DEV__) console.log('fetchData $get /inisiasi/GetListClientBRNET success:', responseJson);
                setFetching(false);
                setData(responseJson);
            })
        } catch(error) {
            if (__DEV__) console.log('fetchData $get /inisiasi/GetListClientBRNET error:', error);
            setFetching(false);
        }
    }

    const getName = (Name) => {
        return Name.split('-')[1];
    }

    const renderHeader = () => (
        <ImageBackground source={require("../../../../assets/Image/Banner.png")} style={styles.containerImageBackground} imageStyle={{ borderRadius: 20 }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>BACK</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: colors.PUTIH }}>DATA PROSPEK</Text>
                </View>
            </View>
        </ImageBackground>
    )

    const renderSearch = () => (
        <View style={[styles.FDRow, styles.MB16]}>
            <View style={[styles.F1, stylesheet.containerSearch, { alignItems: 'center' }]}>
                <FontAwesome5 name="search" size={15} color="#2e2e2e" style={{marginHorizontal: 10}} />
                <TextInput 
                    placeholder={"Cari prospek"}
                    style={
                        {
                            flex: 1,
                            padding: 5,
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20
                        }
                    }
                    onChangeText={(text) => setKeyword(text)}
                    value={keyword}
                    returnKeyType="search"
                    autoFocus={true}
                    clearButtonMode="while-editing"
                    onSubmitEditing={() => fetchData(keyword)}
                />
            </View>
        </View>
    )

    const renderSQLiteList = () => dataSQLite.map((x, i) => (
        <View key={i} style={{ backgroundColor: 'whitesmoke' }}>
            <TouchableOpacity
                onPress={() => navigation.navigate('InisiasiFormProspekLama', { name: getName(x.name), clientId: x.clientId })}
            >
                <View
                    style={[styles.FDRow, styles.P8]}
                >
                    <Text style={[styles.F1, styles.MR16]}>{getName(x.name)}</Text>
                    <Text style={{ textAlign:'right', color: 'gray' }}>{x.clientId}</Text>
                </View>
            </TouchableOpacity>
            {renderSpace()}
        </View>
    ))
    
    const renderList = () => data.map((x, i) => (
        <View key={i}>
            <TouchableOpacity
                onPress={() => navigation.navigate('InisiasiFormProspekLama', { name: getName(x.Name), clientId: x.ClientID })}
            >
                <View
                    style={[styles.FDRow, styles.P8]}
                >
                    <Text style={[styles.F1, styles.MR16]}>{getName(x.Name)}</Text>
                    <Text style={{ textAlign:'right', color: 'gray' }}>{x.ClientID}</Text>
                </View>
            </TouchableOpacity>
            {renderSpace()}
        </View>
    ))

    const renderSpace = () => (
        <View style={stylesheet.greySpace} />
    )

    const renderBody = () => (
        <View style={[styles.bodyContainer, styles.P16]}>
            {renderSearch()}
            <ScrollView>
                {renderSQLiteList()}
                {renderList()}
            </ScrollView>
        </View>
    )

    const renderLoading = () => fetching && (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.DEFAULT} />
        </View>
    )

    return(
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
            {renderLoading()}
        </View>
    )
}

const stylesheet = StyleSheet.create({
    containerSearch: {
        borderWidth: 1, 
        marginHorizontal: 10, 
        marginTop: 5, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FFF', 
        borderRadius: 20
    },
    greySpace: {
        marginVertical: 8,
        height: 1,
        backgroundColor: colors.ABUABU
    }
})

export default InisiasiFormProspekLamaList;
