import React, {useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Button } from 'react-native-elements'
import db from '../../database/Database';

const FormUjiKelayakan = ({route}) => {
    const { groupName, namaNasabah } = route.params
    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [currentDate, setCurrentDate] = useState();
    let [dataDiri, setDataDiri] = useState(false);
    let [screenState, setScreenState] = useState(0);

    useEffect(() => {
        setInfo();
        getUKMaster();
    }, []);

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

    const getUKMaster = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_Master WHERE namaNasabah = '` + namaNasabah + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_Master length:', dataLength);
                    if (dataLength > 0) {
                        let data = results.rows.item(0);
                        setScreenState(parseInt(data.status));
                    }
                    
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_Master error:', error.message);
                })
            }
        )
    }

    const submitHandler = () => null

    return(
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 40,
                alignItems: "center",
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity onPress={() => navigation.replace('UjiKelayakan', {groupName: groupName})} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>UJI KELAYAKAN</Text>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 30, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderRadius: 20}}>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>Form Uji Kelayakan</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{groupName}</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 15, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{namaNasabah}</Text>
                </ImageBackground>
            </View>

            <View style={{flex: 1, marginHorizontal: 20, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFF'}}>
                <Text style={{fontSize: 30, fontWeight: 'bold', margin: 20}}>Form Uji Kelayakan {screenState}</Text>

                <ScrollView style={{flex: 1, marginTop: 10, marginHorizontal: 10}}>

                    <TouchableOpacity onPress={() => navigation.navigate('DataDiri', {groupName: groupName, namaNasabah: namaNasabah})} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: '#0c5da0'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'address-card'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Data Diri Pribadi</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={screenState > 0}
                                fillColor={screenState > 0 ? 'green' : 'white'}
                                disableBuiltInState
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => screenState > 0 ? navigation.navigate('ProdukPembiayaan', {groupName: groupName, namaNasabah: namaNasabah}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 0 ? '#0c5da0' : 'gray'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'product-hunt'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Produk Pembiayaan</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={screenState > 1}
                                fillColor={screenState > 1 ? 'green' : 'white'}
                                disableBuiltInState
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => screenState > 1 ? navigation.navigate('InisiasiFormUKKondisiRumah', {groupName: groupName, namaNasabah: namaNasabah}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 1 ? '#0c5da0' : 'gray'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'home'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Kondisi Rumah</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={screenState > 2}
                                fillColor={screenState > 2 ? 'green' : 'white'}
                                disableBuiltInState
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => screenState > 2 ? navigation.navigate('InisiasiFormUKSektorEkonomi', {groupName: groupName, namaNasabah: namaNasabah}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 2 ? '#0c5da0' : 'gray'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'sellsy'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Sektor Ekonomi</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={screenState > 3}
                                fillColor={screenState > 3 ? 'green' : 'white'}
                                disableBuiltInState
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => screenState > 3 ? navigation.navigate('InisiasiFormUKTingkatPendapatan', {groupName: groupName, namaNasabah: namaNasabah}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 3 ? '#0c5da0' : 'gray'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'chart-area'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Tingkat Pendapatan</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={screenState > 4}
                                fillColor={screenState > 4 ? 'green' : 'white'}
                                disableBuiltInState
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => screenState > 4 ? navigation.navigate('InisiasiFormUKTandaTanganPermohonan', {groupName: groupName, namaNasabah: namaNasabah}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 4 ? '#0c5da0' : 'gray'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'signature'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={2} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Tandatangan dan Permohonan</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={screenState > 5}
                                fillColor={screenState > 5 ? 'green' : 'white'}
                                disableBuiltInState
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={{alignItems: 'center', marginBottom: 20}}>
                        <Button
                            title="SUBMIT UK"
                            onPress={() => screenState > 5 ? alert('Sukses') : null}
                            buttonStyle={{backgroundColor: screenState > 5 ? '#D62828' : 'gray', width: dimension.width/2}}
                            titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                        />
                    </View>

                </ScrollView>

            </View>
        </View>
    )
}

export default FormUjiKelayakan

const styles = StyleSheet.create({
    
})