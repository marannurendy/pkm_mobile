import React, { useEffect, useState } from 'react'
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView, FlatList, TextInput, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import db from '../../database/Database'

const UjiKelayakan = ({route}) => {

    const { groupName } = route.params
    const dimension = Dimensions.get('screen');
    const navigation = useNavigation();
    let [ currentDate, setCurrentDate ] = useState();
    let [data, setData] = useState();
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            GetInfo();
            getSosialisasiDatabase();
        });
        return unsubscribe;
    }, [navigation]);

    const getSosialisasiDatabase = () => {
        if (__DEV__) console.log('getSosialisasiDatabase loaded');
        if (__DEV__) console.log('getSosialisasiDatabase keyword:', keyword);

        let query = 'SELECT a.* FROM Sosialisasi_Database a WHERE a.lokasiSosialisasi = "'+ groupName +'" AND a.namaCalonNasabah LIKE "%'+ keyword +'%"';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('getSosialisasiDatabase results:', results.rows);
                    let dataLength = results.rows.length;

                    var ah = [];
                    for(let a = 0; a < dataLength; a++) {
                        let data = results.rows.item(a);
                        ah.push({"id": data.id, "namaNasabah": data.namaCalonNasabah, "nomorHandphone": data.nomorHandphone, "status": data.verifikasiStatus, "groupName": data.lokasiSosialisasi});
                    }
                    setData(ah)
                })
            }
        );
    }

    const GetInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

    //LIST VIEW
    const renderItem = ({ item }) => (
        <Item data={item} />
    )

    const Item = ({ data }) => (
        <TouchableOpacity 
            style={{margin: 5, borderRadius: 20, backgroundColor: '#FFF', flex: 1, borderWidth: 1, marginHorizontal: 15}} 
            onPress={() => navigation.navigate('FormUjiKelayakan', {id: data.id, groupName: data.groupName, namaNasabah: data.namaNasabah, nomorHandphone: data.nomorHandphone})}
        >
            <View style={{alignItems: 'flex-start'}}>
                <Text>{JSON.stringify(data)}</Text>
                <ListMessage namaNasabah={data.namaNasabah} status={data.status} />
            </View>
        </TouchableOpacity>
    )

    const ListMessage = ({ namaNasabah, status }) => {
        return(
            <View style={{ width: "85%", margin: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, marginBottom: 5, color: '#545851'}} >{namaNasabah}</Text>
                </View>
                <View>
                    {status === '3' && (
                        <FontAwesome5 name={'file-import'} size={25} color={'#FFA500'} />
                    )}
                </View>
                
            </View>
        )
    }
    // END LIST VIEW

    const _listEmptyComponent = () => {
        return (
            <View
                style={
                    {
                        padding: 16
                    }
                }
            >
                <Text>Data kosong</Text>
            </View>
        )
    }

    return(
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 40,
                alignItems: "center",
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity onPress={() => navigation.replace('Inisiasi')} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>INISIASI</Text>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 30, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderRadius: 20}}>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>Uji Kelayakan</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{groupName}</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{currentDate}</Text>
                </ImageBackground>
            </View>

            <View style={{flex: 1, borderTopRightRadius: 20, borderTopLeftRadius: 20, marginTop: 20, marginHorizontal: 20, backgroundColor: '#FFF'}}>
                <Text style={{fontSize: 30, fontWeight: 'bold', margin: 20}}>Daftar Prospek</Text>
                {/* <View style={{borderWidth: 1}}>
                    <FontAwesome5 name="search" size={15} color="#2e2e2e" style={{marginHorizontal: 10}} />
                    <TextInput placeholder={"Cari Kelompok"} style={{padding: 5, borderBottomLeftRadius: 20, borderBottomRightRadius: 20}} />
                </View> */}
                <View style={{borderWidth: 1, marginHorizontal: 10, marginTop: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20}}>
                    <FontAwesome5 name="search" size={15} color="#2e2e2e" style={{marginHorizontal: 10}} />
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

                    {data === undefined ? (
                        <View style={styles.loading}>
                            <ActivityIndicator size="large" color="#00ff00" />
                        </View>
                    ) : (
                        <View style={{ justifyContent:  'space-between', marginTop: 20 }}>
                            <FlatList
                                // contentContainerStyle={styles.listStyle}
                                // refreshing={refreshing}
                                // onRefresh={() => _onRefresh()}
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                enabledGestureInteraction={true}
                                // onEndReachedThreshold={0.1}
                                // onEndReached={() => handleEndReach()}
                                renderItem={renderItem}
                                // style={{height: '88.6%'}}
                                ListEmptyComponent={_listEmptyComponent}
                            />
                        </View>
                    )}
                    
                </SafeAreaView>
            </View>
        </View>
    )
}

export default UjiKelayakan

const styles = StyleSheet.create({
    
})