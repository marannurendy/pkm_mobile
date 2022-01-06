import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import db from '../../../database/Database';
import { getSyncData } from '../../../actions/sync';

const InisiasiFormPPList = ({ route }) => {
    const { groupName } = route.params;
    const navigation = useNavigation();
    const [data, setData] = useState([])
    const [keyword, setKeyword] = useState('');
    const [fetching, setFetching] = useState(false);
    const [currentDate, setCurrentDate] = useState()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            GetInfo();
            getData();
        })

        return unsubscribe
    }, []);

    const GetInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');
        setCurrentDate(tanggal)
    }

    const getData = async () => {
        console.log(groupName)
        let queryList = "SELECT * FROM Table_PP_ListNasabah WHERE kelompok = '" + groupName + "' AND status <> 'null'"

        const ListData = (queryList) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryList, [], (tx, results) => {
                            let dataLength = results.rows.length
                            let dataList = []

                            for(let a = 0; a < dataLength; a++) {
                                let i = results.rows.item(a)

                                dataList.push(i)
                            }

                            resolve(dataList)
                        })
                    }
                )
            }catch(error){
                alert(error)
            }
        }))

        const DataList = await ListData(queryList)
        console.log(DataList)
        setData(DataList)
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
                <Text numberOfLines={1} style={{ color: colors.PUTIH, marginHorizontal: 100 }}>{groupName}</Text>
            </View>
        </ImageBackground>
    )

    const renderItem = ({ item }) => (
        <Item data={item} />
    )

    const Item = ({ data }) => (
        <TouchableOpacity 
            style={stylesheet.containerItem} 
            onPress={() => navigation.navigate('InisiasiFormPPForm', { ...data, groupName })}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessage name={data.Nama_Nasabah} />
            </View>
        </TouchableOpacity>
    )

    const ListMessage = ({ name }) => {
        return (
            <View style={stylesheet.containerList}>
                <View style={[styles.checkbox, {backgroundColor: "#0D67B2", borderColor: '#FFF'}]}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, marginHorizontal: 5, color: "#FFF"}} >{name.charAt(0)}</Text>
                </View>
                <Text numberOfLines={1} style={stylesheet.textList}>{name}</Text>
            </View>
        )
    }

    const empty = () => (
        <View style={styles.P16}>
            <Text>Data kosong</Text>
        </View>
    )

    const findGroupMember = async () => {
        let queryFind = "SELECT * FROM Table_PP_ListNasabah WHERE kelompok = '" + groupName + "' AND status <> 'null' AND Nama_Nasabah like '%" + keyword + "%'"

        const ListData = (queryList) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryList, [], (tx, results) => {
                            let dataLength = results.rows.length
                            let dataList = []

                            for(let a = 0; a < dataLength; a++) {
                                let i = results.rows.item(a)

                                dataList.push(i)
                            }

                            resolve(dataList)
                        })
                    }
                )
            }catch(error){
                alert(error)
            }
        }))

        const DataList = await ListData(queryFind)
        console.log(DataList)
        setData(DataList)
    }

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <View style={stylesheet.containerProspek}>
                <Text style={stylesheet.textProspek}>Persetujuan Pembiayaan</Text>
                <View style={stylesheet.containerSearch}>
                    <FontAwesome5 name="search" size={15} color="#2e2e2e" style={styles.MH8} />
                    <TextInput 
                        placeholder={"Cari"}
                        style={
                            {
                                padding: 5,
                                flex: 1
                            }
                        }
                        onChangeText={(text) => setKeyword(text)}
                        value={keyword}
                        returnKeyType="done"
                        onSubmitEditing={() => findGroupMember()}
                    />
                </View>
                <SafeAreaView style={{flex: 1}}>
                    {fetching === undefined ? (
                        <View style={stylesheet.loading}>
                            <ActivityIndicator size="large" color="#00ff00" />
                        </View>
                    ) : (
                        <View style={stylesheet.containerMain}>
                            <FlatList
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                enabledGestureInteraction={true}
                                renderItem={renderItem}
                                ListEmptyComponent={empty}
                            />
                        </View>
                    )}
                </SafeAreaView>
            </View>
        </View>
    )

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
        </View>
    )
}

const stylesheet = StyleSheet.create({
    containerProspek: { 
        ...styles.F1,
        ...styles.MT16,
        ...styles.MH16,
        backgroundColor: colors.PUTIH
    },
    textProspek: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        margin: 16
    },
    containerSearch: { 
        ...styles.FDRow,
        ...styles.MH8,
        ...styles.MT4,
        borderWidth: 1, 
        alignItems: 'center', 
        backgroundColor: colors.PUTIH, 
        borderRadius: 16
    },
    containerMain: { 
        ...styles.MT16,
        justifyContent: 'space-between'
    },
    containerItem: { 
        ...styles.F1,
        ...styles.MH8,
        ...styles.M4,
        borderRadius: 16, 
        backgroundColor: colors.PUTIH, 
        borderWidth: 1, 
    },
    containerList: {
        ...styles.FDRow,
        ...styles.M16,
        width: "85%",
        alignContent: 'center',
        alignItems: 'center'
    },
    textList: {
        ...styles.MB4,
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.HITAM
    }
});

export default InisiasiFormPPList;
