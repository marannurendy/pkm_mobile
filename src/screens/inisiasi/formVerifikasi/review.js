import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, ToastAndroid, Modal, KeyboardAvoidingView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import { WebView } from 'react-native-webview';
import db from '../../../database/Database'

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const withTextInput = dimension.width - (20 * 4) + 8;

const VerifikasiFormReview = ({ route }) => {
    const { groupName, namaNasabah, idProspek } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [visible, setVisible] = useState(false);
    const [reason, setReason] = useState('');
    const [statusMounting, setStatusMounting] = useState(false);
    const [uname, setUname] = useState('');
    const [selectedProdukPembiayaan, setSelectedProdukPembiayaan] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUserData();
        getUKProdukPembiayaan();
        setInfo();
    }, []);

    const getUKProdukPembiayaan = () => {
        if (__DEV__) console.log('getUKProdukPembiayaan loaded');

        let query = 'SELECT * FROM Table_UK_ProdukPembiayaan WHERE id_prospek = "'+ idProspek +'"';

        setLoading(true);
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    if (__DEV__) console.log('getUKProdukPembiayaan results:', results.rows);
                    let dataLength = results.rows.length;
                    if (dataLength > 0) {
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('tx.executeSql data:', data);

                        AsyncStorage.getItem('Product').then((response) => {
                            if (response !== null) {
                                const responseJSON = JSON.parse(response);
                                if (responseJSON.length > 0 ?? false) {
                                    let value = data.produk_Pembiayaan;
                                    setSelectedProdukPembiayaan(responseJSON.filter(data => data.id === value)[0] || null);
                                }
                            }
                        });
                    }
                    setLoading(false);
                })
            }
        );
    }

    const getUserData = () => {
        AsyncStorage.getItem('userData', (error, result) => {
            if (error) __DEV__ && console.log('userData error:', error);
            if (__DEV__) console.log('userData response:', result);
            let data = JSON.parse(result);
            setUname(data.userName);
        });
    }

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');
        setCurrentDate(tanggal);
    }

    const onSelectSign = (key, data) => doSave(data, '1');

    const doSave = (image = '', status = '') => {
        if (__DEV__) console.log('doSave loaded');

        let message = 'Approve';
        if (status === '2') message = 'Reject';
        if (status === '3') message = 'Revisi';

        let query = 'UPDATE Table_UK_DataDiri SET sync_Verif = "1" WHERE id_prospek = "' + idProspek + '"';
        if (__DEV__) console.log('doSave db.transaction update query:', query);

        db.transaction(
            tx => {
                tx.executeSql(query);
            }, function(error) {
                if (__DEV__) console.log('doSave db.transaction insert/update error:', error.message);
                setSubmmitted(false);
            },function() {
                if (__DEV__) console.log('doSave db.transaction update success');

                const body = {
                    "ID_Prospek": idProspek,
                    "TTD_KC_SAO": image !== '' ? image.split(',')[1] : '',
                    "VerifBy": uname,
                    "PostStatus": status,
                    "Reason": reason
                };
                if (__DEV__) console.log('doSave body:', body);

                ToastAndroid.show('Berhasil ' + message, ToastAndroid.SHORT);

                AsyncStorage.setItem(`formVerifikasi_body_${idProspek}`, JSON.stringify(body)).then(() => {
                    setTimeout(() => {
                        navigation.goBack();
                        // navigation.replace('Verifikasi', { groupName: groupName });
                    }, 600);
                });
            }
        );
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
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ color: colors.PUTIH }}>{namaNasabah}</Text>
                    <Text style={{ flex: 1, color: colors.PUTIH }}>{groupName} | {currentDate}</Text>
                </View>
            </View>
        </ImageBackground>
    )

    const renderButton = () => (
        <View style={[styles.FDRow, styles.M16]}>
            <TouchableOpacity
                onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganApprove', onSelectSign: onSelectSign })}
                style={[styles.F1]}
            >
                <View style={[styles.P8, { backgroundColor: '#008080', borderRadius: 6 }]}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>APPROVE</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setTimeout(() => {
                        setVisible(true);
                    }, 300);
                }}
                style={[styles.F1, styles.ML16]}
            >
                <View style={[styles.P8, { backgroundColor: colors.MERAH, borderRadius: 6 }]}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>REJECT</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    Alert.alert(
                        "Revisi",
                        "Apakah kamu yakin, akan melakukan revisi?",
                        [
                            {
                                text: "Cancel",
                                onPress: () => __DEV__ && console.log("cancel pressed"),
                                style: "cancel"
                            },
                            { 
                                text: "OK",
                                onPress: () => doSave('', '3')
                            }
                        ]
                    );
                }}
                style={[styles.F1, styles.ML16]}
            >
                <View style={[styles.P8, { backgroundColor: colors.OREN, borderRadius: 6 }]}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>REVISI</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderHeaderModal = () => (
        <View style={[styles.MB16, styles.FDRow]}>
            <Text style={{ flex: 1, fontSize: 18 }}>Reject</Text>
            <FontAwesome5 name="times-circle" size={22} color="#2e2e2e" onPress={() => setVisible(!visible)} />
        </View>
    )

    const renderBodyModal = () => (
        <View style={[styles.F1, styles.MT16]}>
            <Text>Alasan (*)</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={reason} 
                        onChangeText={(text) => setReason(text)}
                        style={[styles.F1]}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFooterModal = () => (
        <View style={styles.FDRow}>
            <View style={styles.F1} />
            <TouchableOpacity
                onPress={() => doSave('', '2')}
            >
                <View style={[styles.buttonSubmitContainer, { padding: 8 }]}>
                    <Text style={styles.buttonSubmitText}>Submit</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderModal = () => (
        <Modal            
            animationType={"fade"}  
            transparent={true}  
            visible={visible}  
            onRequestClose={() =>{ console.log("Modal has been closed.") } }
            KeyboardSpacer
        >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.modalContainer}>  
                    <View style={styles.modalBody}>
                        {renderHeaderModal()}
                        {renderSpace()}
                        {renderBodyModal()}
                        {renderFooterModal()}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )

    const renderSpace = () => (
        <View style={[styles.spaceGray, styles.MB8, { borderWidth: 1, borderColor: 'whitesmoke' }]} />
    )

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

    const renderBody = () => selectedProdukPembiayaan && (
        <View style={styles.bodyContainer}>
            <View style={styles.F1}>
                <WebView
                    renderLoading={renderLoadingView}
                    onLoad={() => setStatusMounting(true)}
                    source={{ uri: `http://reportdpm.pnm.co.id:8080/jasperserver/rest_v2/reports/reports/INISIASI/${selectedProdukPembiayaan.isSyariah === '1' ? 'FP4_SYARIAH' : 'FP4_KONVE'}_T1.html?ID_Prospek=${idProspek}` }}
                    startInLoadingState={true}
                    style={styles.F1}
                />
            </View>
            <Text style={[styles.MH16, styles.MT16, { fontSize: 11 }]}>{`http://reportdpm.pnm.co.id:8080/jasperserver/rest_v2/reports/reports/INISIASI/${selectedProdukPembiayaan.isSyariah === '1' ? 'FP4_SYARIAH' : 'FP4_KONVE'}_T1.html?ID_Prospek=${idProspek}`}</Text>
            {renderButton()}
        </View>
    )

    return(
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
            {renderModal()}
        </View>
    )
}

export default VerifikasiFormReview;
