import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, Alert, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import db from '../../../database/Database';

const dimension = Dimensions.get('screen');
const withTextInput = dimension.width - (20 * 4) + 16;

const InisiasiFormPPKelompokDetail = ({ route }) => {
    const { groupName } = route.params;
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [data, setData] = useState([]);
    const [dataGroup, setDataGroup] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            generateGroupData();
        })

        return unsubscribe
    }, []);

    const generateGroupData = async () => {

        let queryGetGroup = "SELECT * FROM Table_PP_ListNasabah WHERE kelompok = '" + groupName + "' AND status = 1"

        const getData = (queryGetGroup) => (new Promise ((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(queryGetGroup, [], (tx, results) => {
                            let dataLength = results.rows.length
                            let dataArr = []

                            for(let a = 0; a < dataLength; a++) {
                                let b = results.rows.item(a)
                                b['isKK'] = b.is_Ketua_Kelompok === '0' ? false : true
                                b['isSK'] = b.is_KetuaSubKelompok === '0' ? false : true
                                dataArr.push(b)
                            }
                            resolve(dataArr)
                        })
                    }, function(error) {
                        reject(error)
                    }
                )
            }catch(error){
                reject(error)
            }
        }))

        const dataGet = await getData(queryGetGroup)

        console.log(dataGet)
        setData(dataGet)
        generateGroup(dataGet)

        
        // if (__DEV__) console.log('generateGroupData groupData:', _dataGroup);
    }

    const generateGroup = (dataGet) => {
        let _dataGroup = dataGet.reduce((r, a) => {
            r[a.subKelompok] = [...r[a.subKelompok] || [], a];
            return r;
        }, {});

        setDataGroup(_dataGroup);
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

    const onConfirmKKKS = (nama, id, index) => {
        // let a = data.find(x => x.Nama_Nasabah === nama)
        // console.log(a)
        Alert.alert(
            "Konfirmasi",
            `Jadikan ${nama} sebagai ?`,
            [
                {
                    text: "Batal",
                    onPress: () => console.log("Ask me later pressed")
                },
                {
                    text: "Ketua Sub",
                    onPress: () => subKelompokHandler(id, index, nama),
                    style: "cancel"
                },
                { 
                    text: "Ketua Kelompok", 
                    onPress: () => ketuaKelompokHandler(id, index, nama)
                }
            ]
        );
    }

    const ketuaKelompokHandler = (id, index, nama) => {

        let a = data.findIndex(x => x.Nama_Nasabah === nama)
        let b = data.length

        let arr = [...data]

        for(let i = 0; i < b; i++) {
            arr[i].isKK = false
        }
        setData(arr)

        let newArr = [...data]
        let newVal = !data[a].isKK
        let newVal2 = !newVal
        newArr[a].isKK = newVal
        newArr[a].isSK = newVal2

        setData(newArr)
        generateGroup(newArr)

        // let queryIsKK = "UPDATE Table_PP_ListNasabah SET is_KetuaSubKelompok = " + false
        let query = "UPDATE Table_PP_ListNasabah SET is_Ketua_Kelompok = " + false + " WHERE kelompok = '" + groupName + "'"
        let queryIsKK = "UPDATE Table_PP_ListNasabah SET is_Ketua_Kelompok = " + newVal + ", is_KetuaSubKelompok = " + newVal2 + " WHERE Nasabah_Id = '" + id + "'"
        try{
            db.transaction(
                tx => {
                    tx.executeSql(query)
                }, function(error) {
                    alert(error)
                }, function() {
                    try{
                        db.transaction(
                            tx => {
                                tx.executeSql(queryIsKK)
                            }, function(error) {
                                alert(error)
                            }
                        )
                    }catch(error){
                        alert(error)
                    }
                }
            )
        }catch(error){
            alert(error)
        }

    }

    const subKelompokHandler = (id, index, nama) => {

        let a = data.findIndex(x => x.Nama_Nasabah === nama)
        let b = data.length

        // let arr = [...data]
        // console.log(arr)

        // for(let i = 0; i < b; i++) {
        //     arr[i].isSK = false
        // }
        // setData(arr)

        let newArr = [...data]
        let newVal = !data[a].isSK
        // let newVal2 = !newVal
        newArr[a].isSK = newVal
        // newArr[a].isKK = newVal2

        console.log(newArr)

        setData(newArr)
        generateGroup(newArr)

        let queryIsSK = "UPDATE Table_PP_ListNasabah SET is_KetuaSubKelompok = " + newVal + " WHERE Nasabah_Id = '" + id + "'"
        try{
            db.transaction(
                tx => {
                    tx.executeSql(queryIsSK)
                }, function(error){
                    alert(error)
                }
            )
        }catch(error){
            alert(error)
        }

    }

    const renderList = () => Object.keys(dataGroup).map(keyGroup => (
        <View
            key={JSON.stringify(keyGroup)}
            style={styles.MT16}
        >
            <Text style={[styles.headerTitle, { paddingLeft: 0, marginBottom: 8 }]}>{keyGroup} ({dataGroup[keyGroup].length})</Text>
            {dataGroup[keyGroup].map((group, indexGroup) => (
                <View 
                    key={indexGroup}
                    style={[styles.textInputContainer, { width: withTextInput, marginBottom: indexGroup === dataGroup[keyGroup].length - 1 ? 0 : 8, borderColor: 'gray' }]}
                >
                    <View>
                        <View style={styles.checkbox}>
                            <Text style={{fontWeight: 'bold', fontSize: 18, marginHorizontal: 5}} >{group.Nama_Nasabah.charAt(0)}</Text>
                        </View>
                    </View>
                    <Text style={styles.F1} onPress={() => onConfirmKKKS(group.Nama_Nasabah, group.Nasabah_Id, indexGroup)}>{group.Nama_Nasabah}</Text>
                    {group.isKK && !group.isSK && (
                        <>
                            <FontAwesome5 name="star" size={16} color={colors.OREN} />
                            <FontAwesome5 name="star" size={16} color={colors.OREN} />
                        </>
                    )}
                    {group.isSK && (
                        <>
                            <FontAwesome5 name="star" size={16} color={colors.OREN} />
                        </>
                    )}
                </View>
            ))}
        </View>
    ))

    const renderInformation = () => (
        <View style={styles.MB8}>
            <Text style={[styles.MB8]}>Informasi</Text>
            <View style={[styles.FDRow]}>
                <FontAwesome5 name="star" size={16} color={colors.OREN} />
                <FontAwesome5 name="star" size={16} color={colors.OREN} />
                <Text style={[styles.ML8]}>Ketua Kelompok</Text>
            </View>
            <View style={[styles.FDRow, styles.MT8]}>
                <FontAwesome5 name="star" size={16} color={colors.OREN} />
                <Text style={[styles.ML8]}>Sub Ketua Kelompok</Text>
            </View>
        </View>
    )

    const renderMain = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderInformation()}
            {renderList()}
        </View>
    )

    const renderButton = () => (
        <View style={[styles.FDRow, styles.P16]}>
            <View style={styles.F1} />
            <TouchableOpacity
                onPress={() => navigation.navigate('InisiasiFormPPKelompokSub', {groupName: groupName})}
            >
                <View style={[styles.buttonSubmitContainer, { backgroundColor: colors.MEDIUM_SEA_GREEN, padding: 8, paddingHorizontal: 16 }]}>
                    <FontAwesome5 name="plus" size={35} color={colors.PUTIH} />
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
                <Text style={{ color: colors.PUTIH }}>{groupName}</Text>
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

export default InisiasiFormPPKelompokDetail;
