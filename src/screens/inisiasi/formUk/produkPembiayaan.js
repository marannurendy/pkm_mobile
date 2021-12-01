import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ImageBackground, TextInput, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ProdukPembiayaan = ({route}) => {

    const { groupName, namaNasabah } = route.params

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [ currentDate, setCurrentDate ] = useState()

    useEffect(() => {
        setInfo()
    })

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')

        setCurrentDate(tanggal)
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
                <TouchableOpacity onPress={() => navigation.replace('UjiKelayakan', {groupName: groupName})} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>UJI KELAYAKAN</Text>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 30, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderRadius: 20}}>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>Form Uji Kelayakan</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{groupName}</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 15, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{namaNasabah}</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 15, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{currentDate}</Text>
                </ImageBackground>
            </View>

            <View style={{flex: 1, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 20, backgroundColor: '#FFF'}}>
                <Text style={{fontSize: 25, fontWeight: 'bold', margin: 20}}>Produk Pembiayaan</Text>
                <ScrollView style={{borderTopRightRadius: 20, borderTopLeftRadius: 20}}>

                </ScrollView>
            </View>

        </View>
    )
}

export default ProdukPembiayaan

const styles = StyleSheet.create({
    
})