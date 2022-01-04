import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ActionButton from 'react-native-action-button';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import db from '../../../database/Database';

const dimension = Dimensions.get('screen');

const InisiasiFormPPKelompokList = ({ route }) => {
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [data, setData] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [fetching, setFetching] = useState(false);

    let [branchid, setBranchid] = useState();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            GetInfo();
        })

        return unsubscribe
    }, []);

    const GetInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');

        const detailBranch = await AsyncStorage.getItem('userData')
        let branchid = JSON.parse(detailBranch).kodeCabang
    
        setBranchid(branchid)
        setCurrentDate(tanggal)

        SetData()
    }

    const SetData = async () => {
        let queryGetGroup = "SELECT a.kelompok as groupName, COUNT(b.Nama_Nasabah) as jumlahNasabah FROM Table_PP_Kelompok a LEFT JOIN Table_PP_ListNasabah b ON a.kelompok = b.kelompok WHERE a.status = '0' AND a.kelompok <> '' GROUP BY a.kelompok"
        // let queryGetGroup2 = "SELECT * FROM Table_PP_Kelompok"

        const getDataGroup = (queryGetGroup) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryGetGroup, [], (tx, results) => {
                            let dataLength = results.rows.length

                            var dataArr = []
                            for(let a = 0; a < dataLength; a++) {
                                let data = results.rows.item(a)
                                dataArr.push(data)
                            }

                            resolve(dataArr)

                        })
                    }, function(error) {
                        reject(error)
                    }
                )
            }catch(error){
                reject(error)
            }
        }))

        const ListData = await getDataGroup(queryGetGroup)

        console.log(ListData)
        setData(ListData)
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
                <TouchableOpacity onPress={() => navigation.replace('Inisiasi')}>
                    <View style={{ flexDirection: 'row', alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, paddingHorizontal: 8 }}>
                        <MaterialCommunityIcons name="home" size={30} color="#2e2e2e" />
                        <Text>INISIASI</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )

    const renderItem = ({ item }) => (
        <Item data={item} />
    )

    const Item = ({ data }) => (
        <TouchableOpacity 
            style={stylesheet.containerItem} 
            onPress={() => navigation.navigate('InisiasiFormPPKelompokDetail', { ...data })}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessage groupName={data.groupName} jumlahNasabah={data.jumlahNasabah} />
            </View>
        </TouchableOpacity>
    )

    const ListMessage = ({ groupName, jumlahNasabah }) => {
        return (
            <View style={stylesheet.containerList}>
                <FontAwesome5 name="users" size={32} color="#2e2e2e" />
                <View style={styles.ML16}>
                    <Text numberOfLines={1} style={stylesheet.textList}>{groupName}</Text>
                    <Text>{jumlahNasabah} Orang</Text>
                </View>
            </View>
        )
    }

    const empty = () => (
        <View style={styles.P16}>
            <Text>Data kosong</Text>
        </View>
    )

    const renderActionButton = () => (
        <ActionButton buttonColor="#003049">
            <ActionButton.Item buttonColor='#D62828' title="Kelompok Baru" onPress={() => navigation.navigate('InisiasiFormPPKelompok')}>
                <FontAwesome5 name="user-plus" style={styles.actionButtonIcon} />
            </ActionButton.Item>
        </ActionButton>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <View style={stylesheet.containerProspek}>
                <Text style={stylesheet.textProspek}>Kelompok</Text>
                <View style={stylesheet.containerSearch}>
                    <FontAwesome5 name="search" size={15} color="#2e2e2e" style={styles.MH8} />
                    <TextInput 
                        placeholder={"Cari Kelompok"}
                        style={
                            {
                                padding: 5,
                                borderBottomLeftRadius: 20,
                                borderBottomRightRadius: 20
                            }
                        }
                        onChangeText={(text) => setKeyword(text)}
                        value={keyword}
                        returnKeyType="done"
                        onSubmitEditing={() => getSosialisasiDatabase()}
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
            {renderActionButton()}
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

export default InisiasiFormPPKelompokList;
