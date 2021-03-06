import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, Modal, ActivityIndicator, SafeAreaView, ToastAndroid, ScrollView, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { WebView } from 'react-native-webview';
import { Button } from 'react-native-elements';
import { currency, inputVal } from '../../utils/Functions';
import { IS_DEVELOPMENT } from '../../../dataconfig';
import db from '../../database/Database'

const window = Dimensions.get('window');

const Siklus = ({route}) => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [branchId, setBranchId] = useState();
    let [branchName, setBranchName] = useState();
    let [uname, setUname] = useState();
    let [aoName, setAoName] = useState();
    let [data, setData] = useState([]);
    let [dataNasabah, setDataNasabah] = useState(route.params.data);
    let [akadmenu, setakadmenu] = useState(0);
    const [keyword, setKeyword] = useState('');
    let [postPencairan, setPostPencairan] = useState(route.params.postPencairan);
    let [jenpem, setJenPem]= useState();
    let [Chari, setChari]= useState();
    let [JumlahUP, setJumlahUP] = useState((parseInt(dataNasabah.Jumlah_Pinjaman) - ((parseInt(dataNasabah.Jumlah_Pinjaman) * parseInt(dataNasabah.Term_Pembiayaan)) / 100)).toString());
    let [TotalPencairan, setTotalPencairan] =useState((parseInt(dataNasabah.Jumlah_Pinjaman)).toString());
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
        console.log(route.params.postPencairan)
        getUserData();
    }, []);

    const renderLoadingView = () => {
        const marginTop = 0;
    
        return (
            <ActivityIndicator
                animating = {true}
                color = '#0076BE'
                size = 'large'
                hidesWhenStopped={true}
                style={{ marginTop }}
            />
        );
    }

    const doSubmitDraft = (source = 'draft') => new Promise((resolve) => {
        if (__DEV__) console.log('ACTIONS POST DATA PENCAIRAN INSERT LOCAL', dataNasabah.ID_Prospek);
        let fpp = (route.params.data.Jenis_Pembiayaan.includes("S") || route.params.data.Jenis_Pembiayaan.includes("Y") ? "SYARIAH_" : (route.params.data.Jenis_Pembiayaan.charAt(0) == "1" && route.params.data.Jenis_Pembiayaan.includes("M") ? "KONVE_": "KONVENSIONAL_"))
        let tindak = (route.params.data.Jenis_Pembiayaan.charAt(0) == "1" ? "T1" : "TL")
        let inis = (IS_DEVELOPMENT ? 'INISIASI_DEV' : 'INISIASI')
        let query = 'INSERT INTO Table_Pencairan_Post (FP4, Foto_Pencairan, Is_Dicairkan, Jml_RealCair, Jml_UP, TTD_KC, TTD_KK, TTD_KSK, TTD_Nasabah, TTD_Nasabah_2, ID_Prospek, Kelompok_ID) ' +
                    'values ("http://reportdpm.pnm.co.id:8080/jasperserver/rest_v2/reports/reports/'+inis+'/FP4_'+fpp+tindak+'.html?ID_Prospek=' + dataNasabah.ID_Prospek + '","' + postPencairan.Foto_Pencairan + '","' + postPencairan.Is_Dicairkan + '", ' +
                    '"' + TotalPencairan + '","0","' + postPencairan.TTD_KC + '", "' + postPencairan.TTD_KK + '", "' + postPencairan.TTD_KSK + '", "' + postPencairan.TTD_Nasabah + '",'+ 
                    '"' + postPencairan.TTD_Nasabah_2 + '", "' + dataNasabah.ID_Prospek + '", "' + dataNasabah.Kelompok_ID + '")';
        db.transaction(
            tx => {
                tx.executeSql(query);
            }, function(error) {
                if (__DEV__) console.log('doSubmitDraft db.transaction insert/update error:', error.message);
                return resolve(true);
            },function() {
                if (__DEV__) console.log('doSubmitDraft db.transaction insert/update success');
                if (source !== 'submit') ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                if (__DEV__) {
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_Pencairan_Post", [], (tx, results) => {
                                if (__DEV__) console.log('SELECT * FROM Table_Pencairan_Post RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SELECT * FROM Table_Pencairan_Post ERROR:', error);
                        }, function() {}
                    );
                }
                return resolve(true);
            }
        );
        let queryDeletePencairanNasabah = 'DELETE FROM Table_Pencairan_Nasabah where ID_Prospek = "'+ dataNasabah.ID_Prospek +'"';
        db.transaction(
            tx => {
                tx.executeSql(queryDeletePencairanNasabah, [], (tx, results) => {
                    if (__DEV__) console.log('Delete User FROM Table_Pencairan_Nasabah RESPONSE:', results.rows.length);
                })
            }, function(error) {
                if (__DEV__) console.log('Delete User FROM Table_Pencairan_Nasabah ERROR:', error);
            }, function() {}
        );
        let queryDeleteJumlah = 'Update Table_Pencairan set Jumlah_Kelompok = CAST((CAST(Jumlah_Kelompok as int) - 1) as varchar) where kelompok_Id = "'+ dataNasabah.Kelompok_ID +'"';
        db.transaction(
            tx => {
                tx.executeSql(queryDeleteJumlah, [], (tx, results) => {
                    if (__DEV__) console.log(`${queryDeleteJumlah} RESPONSE:`, results.rows);
                })
            }, function(error) {
                if (__DEV__) console.log(`${queryDeleteJumlah} ERROR:`, error);
            }, function() {}
        );
        setakadmenu(1)
    });

    return(
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 40,
                alignItems: "center",
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity onPress={() => navigation.replace("FlowPencairan")} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('FrontHome')}>
                    <View style={{ flexDirection: 'row', alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10, paddingHorizontal: 8 }}>
                        <MaterialCommunityIcons name="home" size={30} color="#2e2e2e" />
                        <Text>Home</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 30, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderRadius: 20}}>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>Siklus</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{dataNasabah.Nama_Prospek}</Text>
                </ImageBackground>
            </View>
            {akadmenu == 0 ?(
            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView>
                        <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Form Siklus</Text>

                            <Text style={{fontSize: 14, fontWeight: 'bold'}}>Produk Pembiayaan</Text>
                            <TextInput 
                                style={{flex: 1, padding: 5,  color:'#333',fontWeight: 'bold',  borderRadius:3, borderWidth:1, marginBottom:5, marginTop:5}}
                                editable={false} selectTextOnFocus={false}
                                value={dataNasabah.Jenis_Pembiayaan}
                                returnKeyType="done"
                            />

                            <Text style={{fontSize: 14, fontWeight: 'bold', marginTop:10}}>Plafond</Text>
                            <TextInput 
                                style={{flex: 1, padding: 5, color:'#333',fontWeight: 'bold', borderRadius:3, borderWidth:1, marginBottom:5, marginTop:5}}
                                editable={false} selectTextOnFocus={false}
                                value={"Rp. "+currency(parseInt(dataNasabah.Jumlah_Pinjaman))}
                                returnKeyType="done"
                            />

                            <Text style={{fontSize: 14, fontWeight: 'bold', marginTop:10}}>Term Pembiayaan</Text>
                            <TextInput 
                                editable={false} selectTextOnFocus={false}
                                style={{flex: 1, padding: 5, borderRadius:3, color:'#333',fontWeight: 'bold', borderWidth:1, marginBottom:5, marginTop:5}}
                                value={dataNasabah.Term_Pembiayaan}
                                returnKeyType="done"
                            />

                            <Text style={{fontSize: 14, fontWeight: 'bold', marginTop:10}}>Transfer Fund</Text>
                            <TextInput 
                                editable={false} selectTextOnFocus={false}
                                value={dataNasabah.Nama_Tipe_Pencairan}
                                style={{flex: 1, padding: 5, color:'#333',fontWeight: 'bold',  borderRadius:3, borderWidth:1, marginBottom:5, marginTop:5}}
                                returnKeyType="done"
                            />

                            <Text style={{fontSize: 14, fontWeight: 'bold', marginTop:10}}>UP Baru</Text>
                            <TextInput 
                                style={{flex: 1, padding: 5, color:'#333',fontWeight: 'bold', borderRadius:3, borderWidth:1, marginBottom:5, marginTop:5}}
                                editable={false} selectTextOnFocus={false}
                                value={"Rp. "+currency(parseInt(dataNasabah.UP_Baru))}
                                returnKeyType="done"
                            />

                            <Text style={{fontSize: 14, fontWeight: 'bold', marginTop:10}}>Up Lama</Text>
                            <TextInput 
                                style={{flex: 1, padding: 5, color:'#333',fontWeight: 'bold', borderRadius:3, borderWidth:1, marginBottom:5, marginTop:5}}
                                editable={false} selectTextOnFocus={false}
                                value={"Rp. "+currency(parseInt(dataNasabah.UP_Lama))}
                                returnKeyType="done"
                            />
                            
                            <Text style={{fontSize: 14, fontWeight: 'bold', marginTop:10}}>Sisa OS</Text>
                            <TextInput 
                                style={{flex: 1, padding: 5, color:'#333',fontWeight: 'bold', borderRadius:3, borderWidth:1, marginBottom:5, marginTop:5}}
                                editable={false} selectTextOnFocus={false}
                                value={"Rp. "+currency(parseInt(dataNasabah.Sisa_OS))}
                                returnKeyType="done"
                            />
                            
                            <View style={{alignItems: 'center', marginBottom: 20, marginTop: 20}}>
                                <Button
                                    title="SIMPAN"
                                    onPress={() => doSubmitDraft()}
                                    buttonStyle={{backgroundColor: '#003049', width: dimension.width/2}}
                                    titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
            ) : (
            <View style={{flex: 1, marginTop: 10, marginHorizontal:10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFFCFA'}}>
                <View style={{flexDirection: 'column', marginHorizontal: 20, marginTop: 10}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>Pencairan Pembiayaan {"\n"}Form FP 4</Text>
                </View>
                <View style={styles.bodyContainer}>
                    <View style={styles.F1}>
                        <WebView
                            renderLoading={renderLoadingView}
                            source={{ uri: `http://reportdpm.pnm.co.id:8080/jasperserver/rest_v2/reports/reports/${IS_DEVELOPMENT ? 'INISIASI_DEV' : 'INISIASI'}/FP4_${route.params.data.Jenis_Pembiayaan.includes('S') || route.params.data.Jenis_Pembiayaan.includes('Y') ? 'SYARIAH': `${route.params.data.Jenis_Pembiayaan.charAt(0) == '1' && route.params.data.Jenis_Pembiayaan.includes('M') ? 'KONVE': 'KONVENSIONAL'}`}_${route.params.data.Jenis_Pembiayaan.charAt(0) == '1' ? 'T1' : 'TL'}.html?ID_Prospek=${dataNasabah.ID_Prospek}` }}
                            startInLoadingState={true}
                            style={styles.F1}
                        />
                    </View>
                </View>
                <View style={{alignItems: 'center', marginBottom: 20, marginTop: 20}}>
                    <Button
                        title="OK"
                        onPress={() => navigation.replace("FlowPencairan")}
                        buttonStyle={{backgroundColor: '#003049', width: dimension.width/2}}
                        titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                    />
                </View>
            </View>
            )}
        </View>
    )
}

export default Siklus

const styles = StyleSheet.create({
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
    signature: {
        height: window.height/4,
        flex: 1
      },
      buttonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        margin: 10,
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // height: window.height
      },
      modalView: {
        backgroundColor: "#ECE9E4",
        // borderRadius: 5,
        // alignItems: "center",
        // shadowColor: "#000",
        height: window.height,
        width: window.width,
        // shadowOffset: {
        //   width: 0,
        //   height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
      },
      bodyContainer: {
        flex: 1,
        marginVertical: 16,
        borderRadius: 16,
        marginHorizontal: 16,
        backgroundColor: 'white'
    },
    F1: {
        flex: 1
    },
})