import React, { useEffect, useState } from 'react'
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView, FlatList, TextInput, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import db from '../../database/Database'
import { style } from 'styled-system'

const dimension = Dimensions.get('screen');

const Verifikasi = ({ route }) => {
    const { groupName } = route.params;
    const navigation = useNavigation();
    const dimension = Dimensions.get('screen');
    const [currentDate, setCurrentDate] = useState();
    const [data, setData] = useState([
        {
            namaNasabah: 'Raffi Ahmad',
            nomorHandphone: '085774553921',
            status: '2',
            groupName: 'Kuningan'
        },
        {
            namaNasabah: 'Baim Wong',
            nomorHandphone: '08998525878',
            status: '2',
            groupName: 'Kuningan'
        },
        {
            namaNasabah: 'Rizky Billar',
            nomorHandphone: '085715374827',
            status: '2',
            groupName: 'Kuningan'
        }
    ]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        GetInfo();
    }, []);

    const GetInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');
        setCurrentDate(tanggal)
    }

    const renderItem = ({ item }) => (
        <Item data={item} />
    )

    const Item = ({ data }) => (
        <TouchableOpacity 
            style={styles.containerItem} 
            onPress={() => navigation.navigate('VerifikasiFormReview', {
                groupName: data.groupName,
                namaNasabah: data.namaNasabah,
                nomorHandphone: data.nomorHandphone
            })}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessage namaNasabah={data.namaNasabah} status={data.status} />
            </View>
        </TouchableOpacity>
    )

    const ListMessage = ({ namaNasabah, status }) => {
        return(
            <View style={styles.containerList}>
                <View>
                    <Text numberOfLines={1} style={styles.textList}>{namaNasabah}</Text>
                </View>
            </View>
        )
    }

    const empty = () => {
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

    return (
        <View style={styles.container}>
            <View style={styles.containerInisiasi}>
                <TouchableOpacity onPress={() => navigation.replace('Inisiasi')} style={styles.buttonInisiasi}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={styles.titleInisiasi}>INISIASI</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.containerHeader}>
                <ImageBackground source={require("../../../assets/Image/Banner.png")} style={styles.containerImageBackground} imageStyle={{ borderRadius: 20 }}>
                    <Text style={[styles.textImageBackground, { fontSize: 30 }]}>Verifikasi</Text>
                    <Text style={[styles.textImageBackground, { fontSize: 20 }]}>{groupName}</Text>
                    <Text style={[styles.textImageBackground, { fontSize: 20 }]}>{currentDate}</Text>
                </ImageBackground>
            </View>
            <View style={styles.containerProspek}>
                <Text style={styles.textProspek}>Daftar Prospek</Text>
                <View style={styles.containerSearch}>
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
                        <View style={styles.containerMain}>
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
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ECE9E4", 
        width: dimension.width, 
        height: dimension.height, 
        flex: 1
    },
    containerInisiasi: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 40,
        alignItems: "center",
        paddingHorizontal: 20
    },
    buttonInisiasi: {
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#BCC8C6", 
        borderRadius: 10
    },
    titleInisiasi: {
        fontSize: 18, 
        paddingHorizontal: 15, 
        fontWeight: 'bold'
    },
    containerHeader: {
        height: dimension.height/5, 
        marginHorizontal: 30, 
        borderRadius: 20, 
        marginTop: 30
    },
    containerImageBackground: {
        flex: 1, 
        resizeMode: "cover", 
        justifyContent: 'center',
        borderRadius: 20
    },
    textImageBackground: {
        marginHorizontal: 35, 
        fontSize: 30, 
        fontWeight: 'bold', 
        color: '#FFF', 
        marginBottom: 5
    },
    containerProspek: {
        flex: 1, 
        borderTopRightRadius: 20, 
        borderTopLeftRadius: 20, 
        marginTop: 20, 
        marginHorizontal: 20, 
        backgroundColor: '#FFF'
    },
    textProspek: {
        fontSize: 30, 
        fontWeight: 'bold', 
        margin: 20
    },
    containerSearch: {
        borderWidth: 1, 
        marginHorizontal: 10, 
        marginTop: 5, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FFF', 
        borderRadius: 20
    },
    containerMain: {
        justifyContent: 'space-between', 
        marginTop: 20
    },
    containerItem: {
        margin: 5, 
        borderRadius: 20, 
        backgroundColor: '#FFF', 
        flex: 1, 
        borderWidth: 1, 
        marginHorizontal: 15
    },
    containerList: {
        width: "85%",
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textList: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
        color: '#545851'
    }
});

export default Verifikasi;
