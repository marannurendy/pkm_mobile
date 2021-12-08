import React, {useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Button } from 'react-native-elements'

const FormUjiKelayakan = ({route}) => {

    const { groupName, namaNasabah } = route.params
    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [ currentDate, setCurrentDate ] = useState()
    let [ dataDiri, setDataDiri ] = useState(false)

    useEffect(() => {
        setInfo()
    })

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')

        setCurrentDate(tanggal)
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
                <Text style={{fontSize: 30, fontWeight: 'bold', margin: 20}}>Form Uji Kelayakan</Text>

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
                                isChecked={dataDiri}
                                fillColor={'#FFF'}
                                disableBuiltInState
                                // onPress={() => pickerHandler(1)}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('ProdukPembiayaan', {groupName: groupName, namaNasabah: namaNasabah})} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: '#0c5da0'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'product-hunt'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Produk Pembiayaan</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={dataDiri}
                                fillColor={'#FFF'}
                                disableBuiltInState
                                // onPress={() => pickerHandler(1)}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('InisiasiFormUKKondisiRumah', {groupName: groupName, namaNasabah: namaNasabah})} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: '#0c5da0'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'home'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Kondisi Rumah</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={dataDiri}
                                fillColor={'#FFF'}
                                disableBuiltInState
                                // onPress={() => pickerHandler(1)}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('InisiasiFormUKSektorEkonomi', {groupName: groupName, namaNasabah: namaNasabah})} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: '#0c5da0'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'sellsy'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Sektor Ekonomi</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={dataDiri}
                                fillColor={'#FFF'}
                                disableBuiltInState
                                // onPress={() => pickerHandler(1)}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('InisiasiFormUKTingkatPendapatan', {groupName: groupName, namaNasabah: namaNasabah})} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: '#0c5da0'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'chart-area'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Tingkat Pendapatan</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={dataDiri}
                                fillColor={'#FFF'}
                                disableBuiltInState
                                // onPress={() => pickerHandler(1)}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('InisiasiFormUKTandaTanganPermohonan', {groupName: groupName, namaNasabah: namaNasabah})} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: '#0c5da0'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'signature'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={2} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Tandatangan dan Permohonan</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={dataDiri}
                                fillColor={'#FFF'}
                                disableBuiltInState
                                // onPress={() => pickerHandler(1)}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={{alignItems: 'center', marginBottom: 20}}>
                        <Button
                            title="SUBMIT UK"
                            onPress={() => alert('Sukses')}
                            buttonStyle={{backgroundColor: '#D62828', width: dimension.width/2}}
                            titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                            onPress={() => submitHandler()}
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