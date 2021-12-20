import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiSyncPostInisiasi } from '../../../../dataconfig/apisync/apisync';
import { showMessage } from 'react-native-flash-message';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';

const dimension = Dimensions.get('screen');
const withTextInput = dimension.width - (20 * 4) + 16;

const InisiasiFormPPForm = ({ route }) => {
    const { groupName, Nama_Nasabah, Nasabah_Id, branchid, jangka_waktu, jasa, jumlah_pembiayaan, kelompok, Angsuran_per_minggu } = route.params;
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [valueTandaTanganKetuaAO, setValueTandaTanganKetuaAO] = useState(null);
    const [valueTandaTanganKCSAO, setValueTandaTanganKCSAO] = useState(null);

    let [cabangid, setCabangid] = useState()
    let [namaCabang, setNamacabang] = useState()
    let [username, setUsername] = useState()
    let [aoname, setAoname] = useState()

    let [loading, setLoading] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const syncStatus = await AsyncStorage.getItem('userData')
            
            let DetailData = JSON.parse(syncStatus)

            setCabangid(DetailData.kodeCabang)
            setNamacabang(DetailData.namaCabang)
            setUsername(DetailData.userName)
            setAoname(DetailData.AOname)
        })

        return unsubscribe
    })

    const onSelectSign = (key, data) => {
        if (__DEV__) console.log('onSelectSign loaded');

        if (key === 'tandaTanganKetuaAO') return setValueTandaTanganKetuaAO(data);
        if (key === 'tandaTanganKCSAO') return setValueTandaTanganKCSAO(data);
    };

    const flashNotification = (title, message, backgroundColor, color) => {
        showMessage({
            message: title,
            description: message,
            type: "info",
            duration: 3500,
            statusBarHeight: 20,
            backgroundColor: backgroundColor,
            color: color
        });
      }

    const renderFormJumlahPembiayaanYangDisetujui = () => (
        <View style={[styles.FDRow, styles.MT8]}>
            <Text style={styles.F1}>Jumlah Pembiayaan Yang Disetujui</Text>
            <Text style={styles.MH8}>:</Text>
            <Text style={{ width: 100 }}>{jumlah_pembiayaan}</Text>
        </View>
    )

    const renderFormJangkaWaktu = () => (
        <View style={[styles.FDRow, styles.MT8]}>
            <Text style={styles.F1}>Jangka Waktu</Text>
            <Text style={styles.MH8}>:</Text>
            <Text style={{ width: 100 }}>{jangka_waktu} Minggu</Text>
        </View>
    )

    const renderFormJasa = () => (
        <View style={[styles.FDRow, styles.MT8]}>
            <Text style={styles.F1}>JASA</Text>
            <Text style={styles.MH8}>:</Text>
            <Text style={{ width: 100 }}>{jasa}</Text>
        </View>
    )

    const renderFormAngsuranPerminggu = () => (
        <View style={[styles.FDRow, styles.MT8, styles.MB32]}>
            <Text style={styles.F1}>Angsuran Per Minggu</Text>
            <Text style={styles.MH8}>:</Text>
            <Text style={{ width: 100 }}>{Angsuran_per_minggu}</Text>
        </View>
    )

    const renderFormTandaTanganKetuaKelompok = () => (
        <View style={styles.MB16}>
            <Text>Tanda Tangan Account Officer</Text>
            <View style={[stylesheet.boxTTD, styles.MT8, { borderColor: 'gray' }]}>
                {valueTandaTanganKetuaAO && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganKetuaAO }}
                    />
                )}
                <Text style={[styles.MH16, styles.MV16, { color: 'black' }]}>({aoname})</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganKetuaAO', onSelectSign: onSelectSign })} />
            </View>
            <Text style={[styles.note, styles.MB8, { marginLeft: 0, color: 'red' }]}>*isi tanda tangan dengan benar</Text>
        </View>
    )

    const renderFormTandaTanganKCSAO = () => (
        <View style={styles.MB16}>
            <Text>Tanda Tangan Account KC/SAO</Text>
            <View style={[stylesheet.boxTTD, styles.MT8, { borderColor: 'gray' }]}>
                {valueTandaTanganKCSAO && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganKCSAO }}
                    />
                )}
                <Text style={[styles.MH16, styles.MV16, { color: 'black' }]}>({Nama_Nasabah})</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganKCSAO', onSelectSign: onSelectSign })} />
            </View>
            <Text style={[styles.note, styles.MB8, { marginLeft: 0, color: 'red' }]}>*isi tanda tangan dengan benar</Text>
        </View>
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            <Text style={[styles.bodyTitle, { margin: 0, marginBottom: 16, fontSize: 18 }]}>Persetujuan Pembiayaan</Text>
            <ScrollView>
                {renderFormJumlahPembiayaanYangDisetujui()}
                {renderFormJangkaWaktu()}
                {renderFormJasa()}
                {renderFormAngsuranPerminggu()}
                {renderFormTandaTanganKetuaKelompok()}
                {renderFormTandaTanganKCSAO()}
            </ScrollView>
        </View>
    )

    const submitHandler = () => {
        if(valueTandaTanganKetuaAO === null || valueTandaTanganKetuaAO === undefined || valueTandaTanganKetuaAO === "null" || valueTandaTanganKetuaAO === "undefined") flashNotification("Caution!", "Account Officer belum melakukan tanda tangan", "#FF7900", "#fff")
        if(valueTandaTanganKCSAO === null || valueTandaTanganKCSAO === undefined || valueTandaTanganKCSAO === "null" || valueTandaTanganKCSAO === "undefined") flashNotification("Caution!", "Kepala Cabang / Senior Account Officer belum melakukan tanda tangan", "#FF7900", "#fff")

        setLoading(true)

        let ttd_ao = valueTandaTanganKetuaAO.split("data:image/png;base64,")
        let ttd_kc = valueTandaTanganKCSAO.split("data:image/png;base64,")
        let dataSend = {ID_Prospek: Nasabah_Id, Keterangan_Pembelian: "", TTD_AO: ttd_ao[1], TTD_KC: ttd_kc[1], TTD_KK: "", TTD_KSK: ""}

        try{
            fetch(ApiSyncPostInisiasi + "persetujuan_pembiayaan", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                                'Content-Type': 'application/json'
                        },
                    body: JSON.stringify(dataSend)
                })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("second")

                console.log(responseJson)
                if(responseJson.code === 200) {
                    setLoading(false)
                    flashNotification("Success", "Data berhasil di proses", "#ffbf47", "#fff")
                    var queryUpdate = `UPDATE Table_PP_ListNasabah SET status = 2, AbsPP = '0' WHERE Nasabah_Id = '` + Nasabah_Id + `'`

                    db.transaction(
                        tx => {
                            // tx.executeSql("DELETE FROM Table_PP_ListNasabah WHERE Nasabah_Id = '" + data.Nasabah_Id + "'")
                            // tx.executeSql("DELETE FROM Table_PP_Kelompok WHERE kelompok = '" + kelompok + "'")
                            tx.executeSql(queryUpdate)
                        },function(error) {
                            console.log('Transaction ERROR: ' + error.message);
                          }, function() {
                            console.log('Delete Table OK');
                      }
                    )

                }else{
                    setLoading(false)
                    flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + responseJson.message, "#ff6347", "#fff")
                }
            }).catch((error) => {
                setLoading(false)
                flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + error.message, "#ff6347", "#fff")
            })
        }catch(error){
            console.log("disini")
            setLoading(false)
            flashNotification("Alert", "Data gagal di proses, Coba lagi beberapa saat. error : " + error, "#ff6347", "#fff")
        }
    }

    const renderButton = () => (
        <View style={styles.P16}>
            <TouchableOpacity
                onPress={() => submitHandler()}
            >
                <View style={styles.buttonSubmitContainer}>
                    <Text style={styles.buttonSubmitText}>SUBMIT</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            {renderForm()}
            {renderButton()}
        </View>
    )

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
                <Text style={{ color: colors.PUTIH }}>{groupName} {`>`} {Nama_Nasabah}</Text>
            </View>

            {loading &&
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            }
        </ImageBackground>
    )

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
        </View>
    )
}

const stylesheet = StyleSheet.create({
    siklusContainer: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        width: 200
    },
    boxTTD: {
        borderRadius: 6,
        borderWidth: 1
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default InisiasiFormPPForm;
