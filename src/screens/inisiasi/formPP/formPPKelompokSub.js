import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, KeyboardAvoidingView, ScrollView, Alert, Modal, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import db from '../../../database/Database';
import { getSyncData } from '../../../actions/sync';

const dimension = Dimensions.get('screen');
const withTextInput = dimension.width - (20 * 4) + 16;

const InisiasiFormPPKelompokSub = ({ route }) => {
    const { groupName } = route.params;
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());

    // const [inputList, setInputList] = useState([{ value: "Kelinci 1" }, { value: "Kelinci 2" }]);
    const [inputList, setInputList] = useState([]);

    const [visible, setVisible] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    let [branchid, setBranchid] = useState()
    let [currentDate, setCurrrentDate] = useState()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getInfoData()
            getDataSubKelompok()
        })

        return unsubscribe
    }, [])

    const getInfoData = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');

        const detailBranch = await AsyncStorage.getItem('userData')
        let branchid = JSON.parse(detailBranch).kodeCabang

        setBranchid(branchid)
        setCurrrentDate(tanggal)
    }

    const getDataSubKelompok = async () => {
        let querySubKelompok = "SELECT subKelompok, num, subKelompok || ' ' || num AS namaSub, branchid, status FROM Table_PP_SubKelompok WHERE subKelompok = '" + groupName + "'"

            try{
                db.transaction(
                    tx => {
                        tx.executeSql(querySubKelompok, [], (tx, results) => {
                            let dataLength = results.rows.length
                            
                            var data = []
                            for(let a = 0; a < dataLength; a++) {
                                var list = results.rows.item(a)
                                data.push(list)
                            }
                            console.log(data)
                            setInputList(data)
                        })
                    }
                )
            }catch(error){
                console.log(error)
            }
    }

    const handleRemove = (index) => {
        let a = index
        let b = inputList[a].num
        let queryDelete = "DELETE FROM Table_PP_SubKelompok WHERE kelompok = '" + groupName + "' AND num = '" + b + "'"

        Alert.alert(
            'Konfirmasi',
            `Hapus sub kelompok no. ${index + 1}?`,
            [
                {
                    text: "Cancel",
                    onPress: () => __DEV__ && console.log("cancel pressed"),
                    style: "cancel"
                },
                { 
                    text: "OK", 
                    onPress: () => {
                        const list = [...inputList];
                        list.splice(index, 1);
                        setInputList(list);

                        try{
                            db.transaction(
                                tx => {
                                    tx.executeSql(queryDelete)
                                }, function(error) {
                                    alert(error)
                                }
                            )
                        }catch(error){
                            alert(error)
                        }
                    }
                }
            ]
        )
        
    } 

    // const handleAdd = () => navigation.navigate('InisiasiFormPPKelompokSubForm', {groupName: groupName})
    const handleAdd = () => {
        let x = inputList.map(function(x) {return Number(x.num)})
        let y = Math.max.apply(null, x)

        let b = groupName + " " + (y + 1)
        let c = y + 1
        console.log(c)
        let newData = [...inputList]
        newData.push({branchid: branchid, namaSub: b, num: c, status: 0, subKelompok: groupName})
        setInputList([...newData])

        let InsertDataSub = 'INSERT INTO Table_PP_SubKelompok ( kelompok_Id, subKelompok_Id, kelompok, subKelompok, num, branchid, status ) VALUES '
            + "( '"
            + ""
            + "', '"
            + ""
            + "', '"
            + groupName
            + "', '"
            + groupName
            + "', '"
            + c
            + "', '"
            + branchid
            + "', '"
            + 0
            + "' );"

        try{
            db.transaction(
                tx => {
                    tx.executeSql(InsertDataSub)
                }, function(error) {
                    alert(error)
                }
            )
        }catch(error){
            alert(error)
        }
    }

    const renderFormNamaKelompok = () => (
        <View style={styles.MT8}>
            <Text>Nama Kelompok (*)</Text>
            <View style={[styles.textInputContainer, { width: withTextInput, backgroundColor: 'whitesmoke' }]}>
                <View style={styles.F1}>
                    <Text>{groupName}</Text>
                </View>
                <View />
            </View>
        </View>
    )

    const renderSubListRemove = (i) => {
        if (i > 0) {
            return (
                <View style={styles.FDRow}>
                    <TouchableOpacity onPress={() => handleRemove(i)} style={styles.ML8}>
                        <FontAwesome5 name="trash" size={16} color={colors.MERAH} />
                    </TouchableOpacity>
                </View>
            )
        }
    }

    const renderSubList = () => inputList.map((x, i) => (
        <View
            key={i}
            style={[styles.textInputContainer, { width: withTextInput - 32, marginBottom: i === inputList.length - 1 ? 0 : 12, borderColor: 'gray' }]}
        >
            <Text>{i+1}. </Text>
            <Text 
                style={styles.F1}
                onPress={() => {
                    setSelectedData(x);
                    setVisible(true);
                    // console.log(x)
                }}
            >
                {x.namaSub}
            </Text>
            {renderSubListRemove(i)}
        </View>
    ))

    const renderSub = () => (
        <View
            style={[styles.P16, styles.MT16, { borderWidth: 1, borderRadius: 16, borderStyle: 'dashed' }]}
        >
            <View style={[styles.FDRow, styles.MB16, { alignItems: 'center' }]}>
                <Text style={styles.F1}>List Sub Kelompok ({inputList.length})</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleAdd()}
                >
                    <Text style={[styles.PH8, { color: colors.PUTIH }]}>Tambah (+)</Text>
                </TouchableOpacity>
            </View>
            {renderSubList()}
        </View>
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            <Text style={[styles.bodyTitle, { margin: 0, marginBottom: 16 }]}>Kelompok</Text>
            <ScrollView>
                {renderFormNamaKelompok()}
                {renderSub()}
            </ScrollView>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            {renderForm()}
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
            </View>
        </ImageBackground>
    )

    const renderHeaderModal = () => (
        <View
            style={[styles.MB16, styles.FDRow]}
        >
            <Text style={{ flex: 1, fontSize: 18 }}>SUB Kelompok</Text>
            <FontAwesome5 name="times-circle" size={22} color="#2e2e2e" onPress={() => setVisible(!visible)} />
        </View>
    )

    const renderBodyModal = () => (
        <View style={[styles.F1, styles.MT16]}>
            <TouchableOpacity
                onPress={() => {
                    setVisible(!visible);
                    setTimeout(() => {
                        navigation.navigate('InisiasiFormPPKelompokSubMemberVerifikasi', { ...selectedData });
                    }, 300);
                }}
                style={styles.MB16}
            >
                <View style={[styles.FDRow, styles.P16, { backgroundColor: colors.DEFAULT, borderRadius: 16 }]}>
                    <FontAwesome5 name="certificate" size={18} color={colors.PUTIH} />
                    <Text style={[styles.ML8, { color: colors.PUTIH }]}>Anggota Verifikasi</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setVisible(!visible);
                    setTimeout(() => {
                        navigation.navigate('Sosialisasi');
                    }, 300);
                }}
            >
                <View style={[styles.FDRow, styles.P16, { backgroundColor: colors.DEFAULT, borderRadius: 16 }]}>
                    <FontAwesome5 name="user-plus" size={18} color={colors.PUTIH} />
                    <Text style={[styles.ML8, { color: colors.PUTIH }]}>Prospek Baru</Text>
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
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )

    const renderSpace = () => (
        <View style={[styles.spaceGray, styles.MB8, { borderWidth: 1, borderColor: 'whitesmoke' }]} />
    )

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
            {renderModal()}
        </View>
    )
}

export default InisiasiFormPPKelompokSub;
