import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, ActivityIndicator, SafeAreaView, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { WebView } from 'react-native-webview';
import db from '../../database/Database'
import { Button } from 'react-native-elements';

const FormFP4 = () => {
    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
    let [aoName, setAoName] = useState();
    let [data, setData] = useState([]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const getUserData = () => {
            AsyncStorage.getItem('userData', (error, result) => {
                if (error) __DEV__ && console.log('userData error:', error);

                let data = JSON.parse(result);
                setBranchId(data.kodeCabang);
                setBranchName(data.namaCabang);
                setUname(data.userName);
                setAoName(data.AOname);
            });
        }

        getUserData();
    }, []);

    return(
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 40,
                alignItems: "center",
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('Pencairan')}>
                    <View style={{ flexDirection: 'row', alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, paddingHorizontal: 8 }}>
                        <MaterialCommunityIcons name="home" size={30} color="#2e2e2e" />
                        <Text>Home</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 30, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderRadius: 20}}>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>Pencairan</Text>
                </ImageBackground>
            </View>
            
            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>Pencairan Pembiayaan {"\n"}Form FP 4</Text>
                </View>
                <View style={styles.bodyContainer}>
                    <View style={styles.F1}>
                        <WebView
                            source={{ uri: `http://reportdpm.pnm.co.id:8080/jasperserver/rest_v2/reports/reports/INISIASI/FP4_KONVE_T1.html?ID_Prospek=4` }}
                            startInLoadingState={true}
                            style={styles.F1}
                        />
                    </View>
                </View>
                <View style={{alignItems: 'center', marginBottom: 20, marginTop: 20}}>
                    <Button
                        title="OK"
                        buttonStyle={{backgroundColor: '#003049', width: dimension.width/2}}
                        titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                    />
                </View>
            </View>
        </View>
    )
}

export default FormFP4

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        marginVertical: 16,
        borderRadius: 16,
        marginHorizontal: 16,
        backgroundColor: 'white'
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowRadius: 10,
        shadowColor: '#003049',
        shadowOpacity: 0.3,
        shadowOffset: { height: 10 },
    },
    menu: {
        backgroundColor: '#003049'
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    F1: {
        flex: 1
    },
})