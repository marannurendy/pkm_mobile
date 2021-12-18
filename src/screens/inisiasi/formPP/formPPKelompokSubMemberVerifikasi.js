import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message"
import db from '../../../database/Database';
import { getSyncData } from '../../../actions/sync';

const dimension = Dimensions.get('screen');

const InisiasiFormPPKelompokSubMemberVerifikasi = ({ route }) => {
    const { branchid, namaSub, num, status, subKelompok } = route.params;
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [data, setData] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getData()
        })

        return unsubscribe
    }, [])

    const getData = async () => {
        // let queryGetVerif = 'SELECT * FROM Table_PP_ListNasabah WHERE '
        const syncBy = await AsyncStorage.getItem('userData')
        let DetailData = JSON.parse(syncBy)
        // setUsername(DetailData.userName)
        let userName = DetailData.userName
        let queryGetVerif = "SELECT * FROM Table_PP_ListNasabah WHERE syncBy = '" + userName + "' AND branchid = '" + branchid + "' AND status = 0"
        // let queryGetVerif = "SELECT * FROM Table_PP_ListNasabah"

        console.log(queryGetVerif)

        const getDataPP = (queryGetVerif) => (new Promise ((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryGetVerif, [], (tx, results) => {
                            let dataLength = results.rows.length
                            let dataArr = []

                            for(let a = 0; a < dataLength; a++) {
                                let data = results.rows.item(a)

                                dataArr.push(data)
                            }

                            resolve(dataArr)
                        })
                    }
                )
            }catch(error){
                alert(error)
                reject(error)
            }
        }))

        const dataPP = await getDataPP(queryGetVerif)
        setData(dataPP)

    }

    const getSelected = (id) => selectedItems.includes(id);
    const selectItems = (id) => {
        if (selectedItems.includes(id)) {
            const newListItems = selectedItems.filter(
                listItem => listItem !== id
            );
            return setSelectedItems([...newListItems]);
        }
        setSelectedItems([...selectedItems, id]);
    };

    const renderList = () => data.map((x, i) => (
        <TouchableOpacity
            key={i}
            onPress={() => selectItems(x.Nasabah_Id)}
            style={[styles.MB16]}
        >
            <View style={[styles.FDRow, styles.P16, { borderWidth: 1, borderRadius: 8, alignItems: 'center' }]}>
                <View style={styles.checkbox}>
                    {getSelected(x.Nasabah_Id) ? <FontAwesome5 name="check" size={16} color={colors.DEFAULT} /> : <Text>{`     `}</Text>}
                </View>
                <Text style={styles.F1}>{x.Nama_Nasabah}</Text>
                <Text>{x.lokasiSos}</Text>
            </View>
        </TouchableOpacity>
    ))

    const renderMain = () => (
        <View style={[styles.F1, styles.P16]}>
            <ScrollView>
                {renderList()}
            </ScrollView>
        </View>
    )

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

    const tambahHandler = () => {
        // console.log(selectedItems)
        let dataLength = selectedItems.length

        if(dataLength === 0) return flashNotification("Caution!", "Silahkan pilih nasabah untuk di masukkan kedalam kelompok", "#FF7900", "#fff")

        for(let a = 0; a < dataLength; a++) {
            let b = selectedItems[a]

            let queryUpdate = "UPDATE Table_PP_ListNasabah SET kelompok = '" + subKelompok + "', subKelompok = '" + namaSub + "', status = 1 WHERE Nasabah_Id = '" + b + "'"
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryUpdate)
                    }, function(error){
                        alert(error)
                    }
                )
            }catch(error){
                alert(error)
            }
        }

        flashNotification("Sukses!", "Nasabah berhasil ditambahkan", "#ffbf47", "#fff")
        navigation.goBack()
    }

    const renderButton = () => (
        <View style={[styles.FDRow, styles.P16]}>
            <TouchableOpacity
                // onPress={() => alert(JSON.stringify(selectedItems))}
                onPress={() => tambahHandler()}
                style={[styles.F1, styles.MR16]}
            >
                <View style={styles.buttonSubmitContainer}>
                    <Text style={styles.buttonSubmitText}>TAMBAH</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            {renderMain()}
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
                <Text style={{ color: colors.PUTIH }}>{namaSub}</Text>
            </View>
        </ImageBackground>
    )

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
        </View>
    )
}

export default InisiasiFormPPKelompokSubMemberVerifikasi;
