import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, ActivityIndicator, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BRI_webAuth} from '../../dataconfig'

export default function UmiCornerLanding() {

    const win = Dimensions.get('window')
    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState()

    // const getAuthAPI = "http://192.162.170.90/BRI/BRI.php?nama=Andika&nip=9649.08.15&cabang_nama=tanjung_priok&cabang_id=90001&posisi=AOM)"
    // const getAuthAPI = "http://api-uat-pnm-bri.pnm.co.id/BRI.php/"
    // const getAuthAPI = "http://api-uat-pnm-bri.pnm.co.id/BRI.php?nama=Andika&nip=9649.08.15&cabang_nama=tanjung_priok&cabang_id=90001&posisi=AOM"

    useEffect(() => {
        console.log('sebelum ' + url)
        cekUrl()
    }, [])
    
    async function cekUrl() {

        console.log("this " + BRI_webAuth)

        setLoading(true)
        // const TOKENKEY = await AsyncStorage.getItem('webView')
        const datauser = await AsyncStorage.getItem('userData', (error, result) => {
            return JSON.parse(result);
        })

        const dt = await JSON.parse(datauser)
            try{
                await fetch(BRI_webAuth, {
                    // await fetch(`http://api-uat-pnm-bri.pnm.co.id/BRI.php?nama=${encodeURIComponent(dt.AOname)}&nip=${encodeURIComponent(dt.nip)}&cabang_nama=${encodeURIComponent(dt.businessUnit)}&cabang_id=${encodeURIComponent(dt.kodeCabang)}&posisi=AOM`, {
                // await fetch(getAuthAPI, {
                    method: 'POST',
                    headers: {
                        Accept:
                            'application/json',
                            'Content-Type': 'application/json'
                        },
                    body: JSON.stringify({
                            sellerId : dt.nip,
                            name: dt.AOname, 
                            businessUnit: dt.namaCabang,
                            businessUnitId: dt.kodeCabang,
                            title: "AOM"
                    })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                    AsyncStorage.setItem('webView', JSON.stringify(responseJson.data))
                    setUrl(responseJson.data.webviewUrl)
                    setLoading(false)
                })
            }catch(error){
                alert(error)
                setLoading(false)
            }
    }

  return (
      <View style={{width: dimension.width, height: dimension.height, flex: 1}}>
        <ImageBackground source={require("../images/backtestMenu.png")} style={styles.image}>

        <View style={{ margin: 10 }}>
            {/* <Image source={require('../images/Umi.png')} style={{width:dimension.width/3, height:dimension.height/14}} /> */}
            <Image source={require('../images/SenyuM-2.png')} style={{width:dimension.width/2, height:dimension.height/14}} resizeMode= 'contain' />
        </View>
            <View style={{justifyContent: 'center', flex: 1}}>
                <View style={{ flexDirection:'column', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('UMiCornerPage', {UrlLink : url})}>
                        <View style={{width: dimension.width/1.5, height: dimension.height/10, backgroundColor: '#5D92E1', justifyContent: 'center', alignItems: 'center', margin: 10, borderRadius: 15}}>
                            <Text style={{fontSize: 25, textAlign:'center', margin: 10, color: '#fff'}}>SenyuM Mobile</Text>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => navigation.navigate('UmiList')}>
                        <View style={{width: dimension.width/1.5, height: dimension.height/10, backgroundColor: '#FF7700', justifyContent: 'center', alignItems: 'center', margin: 10, borderRadius: 15}}>
                            <Text style={{fontSize: 25, textAlign:'center', margin: 10, color: '#fff'}}>Daftar Nasabah</Text>
                        </View>
                    </TouchableOpacity>
                    
                </View>
            </View>
            {loading &&
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            } 
            </ImageBackground>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMenu: {
    alignItems: "center",
    justifyContent: "center",
    height: 66,
    width: 66,
    borderRadius: 50,
    backgroundColor: "#fff200",
  },
  rightlogoMenu: {
    alignItems: "center",
    justifyContent: "center",
    height: 66,
    width: 66,
    borderRadius: 50,
    backgroundColor: "#bb32fe",
    marginLeft: 22,
  },
  menuContainer: {
    alignItems: 'center',
    width: 150
  },
  formBring: {
    paddingBottom: 10
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#545454',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
},
loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.7,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
})
