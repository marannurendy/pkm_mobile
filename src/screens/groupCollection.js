import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, Dimensions, SafeAreaView, TextInput, Keyboard, Alert, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import db from '../database/Database'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import CurrencyInput from 'react-native-currency-input'
import moment from 'moment'
import BottomSheet from 'reanimated-bottom-sheet'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { GroupCollection_Child as Child } from '../child'
import { ScrollView } from 'react-native-gesture-handler'

const dimension = Dimensions.get('screen')

const windowWidth = Dimensions.get('window').width

const GroupCollection = ({route}) => {

    const navigation = useNavigation()
    const { groupid, GroupName } = route.params

    var memberLists = "SELECT DISTINCT * FROM AccountList WHERE GroupID = '"+groupid+"'"
    const SelectMemberList = (memberList) => (new Promise((resolve, reject) => {
        try{
            db.transaction(
                tx => {
                    tx.executeSql(memberList, [], (tx, results) => {
                        let dataLength = results.rows.length
                        var dataList = []
                        for(let a = 0; a < dataLength; a++) {
                            let newData = results.rows.item(a);
                            newData['titipan'] = newData.savings === null ? 0 : newData.savings === undefined ? 0 : newData.savings;
                            newData['tarikan'] = newData.withDraw === null ? 0 : newData.withDraw === undefined ? 0 : newData.withDraw;
                            newData['angsuran'] = newData.InstallmentAmount
                            newData['total'] = newData.InstallmentAmount
                            newData.savings = newData.savings === null ? 0 : newData.savings === undefined ? 0 : newData.savings;
                            newData.withDraw = newData.withDraw === null ? 0 : newData.withDraw === undefined ? 0 : newData.withDraw;
                            dataList.push(newData);
                        }

                        resolve (dataList)
                    })
                },function(error) {
                    reject(error)
                }
            )
        } catch( error ) {
            reject(error)
        }
    }))

    let [currentDate, setCurrentDate] = useState()
    let [groupInfo, setGroupInfo] = useState()
    let [isLoaded, setLoaded] = useState(false)
    let [memberList, setMemberList] = useState(useMemo(() => SelectMemberList(memberLists)), [])
    let [attendList, setAttendList] = useState([])

    let [totalSetoran, setTotalSetoran] = useState()
    let [totalAngsuran, setTotalAngsuran] = useState()
    let [totalTitipan, setTotalTitipan] = useState()
    let [totalTarikan, setTotalTarikan] = useState()
    let [totalAbsen, setTotalAbsen] = useState()

    let [visible, setVisible] = useState(false)
    let [buttonSubmit, setButtonSubmit] = useState(false)


    let [listData, setListData] = useState([])

    const btmsheet = React.createRef()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')

        setCurrentDate(tanggal)

        var groupDetail = "SELECT DISTINCT * FROM GroupList WHERE GroupID = '"+groupid+"'"
        var memberList = "SELECT DISTINCT * FROM AccountList WHERE GroupID = '"+groupid+"'"

        const SelectGroupInfo = (groupDetail) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(groupDetail, [], (tx, results) => {
                            resolve (results.rows.item(0))
                        })
                    },function(error) {
                        reject(error)
                    }
                )
            } catch( error ) {
                reject(error)
            }
        }))

        const SelectAttendStatus = (memberList) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(memberList, [], (tx, results) => {
                            let dataLength = results.rows.length
                            var dataAbsent = []
                            for(let a = 0; a < dataLength; a++) {
                                let data = results.rows.item(a)
                                dataAbsent.push(data.attendStatus)
                            }

                            resolve (dataAbsent)
                        })
                    },function(error) {
                        reject(error)
                    }
                )
            } catch( error ) {
                reject(error)
            }
        }))

        const DataGroupInfo = await SelectGroupInfo(groupDetail)
        const DataMemberList = await SelectMemberList(memberList)
        const DataAttendStatus = await SelectAttendStatus(memberList)

        const statusTotal = DataMemberList.reduce((a,v) =>  a = Number(a) + Number(v.totalSetor) , 0 )
        const statusTotalAngsuran = DataMemberList.reduce((a,v) =>  a = Number(a) + Number(v.InstallmentAmount) , 0 )
        const statusTotalTitipan = DataMemberList.reduce((a,v) =>  a = Number(a) + Number(v.titipan) , 0 )
        const statusTotalTarikan = DataMemberList.reduce((a,v) =>  a = Number(a) + Number(v.tarikan) , 0 )

        // console.log(DataMemberList.length)

        if(DataGroupInfo.Status === '3') {
            setButtonSubmit(true)
        }

        setTotalSetoran(statusTotal)
        setTotalAngsuran(statusTotalAngsuran)
        setTotalTitipan(statusTotalTitipan)
        setTotalTarikan(statusTotalTarikan)

        setGroupInfo(DataGroupInfo)
        setMemberList(DataMemberList)
        setAttendList(DataAttendStatus)

        setListData(DataMemberList)

        setLoaded(true)
    }

    const onInputChange = async (index, item) => {
        memberList[index] = item;

        const statusTotal = await memberList.reduce((a,v) =>  a = Number(a) + Number(v.totalSetor) , 0 )
        const statusTotalAngsuran = await memberList.reduce((a,v) =>  a = Number(a) + Number(v.InstallmentAmount) , 0 )
        const statusTotalTitipan = await memberList.reduce((a,v) =>  a = Number(a) + Number(v.titipan) , 0 )
        const statusTotalTarikan = await memberList.reduce((a,v) =>  a = Number(a) + Number(v.tarikan) , 0 )

        setTotalSetoran(statusTotal)
        setTotalAngsuran(statusTotalAngsuran)
        setTotalTitipan(statusTotalTitipan)
        setTotalTarikan(statusTotalTarikan)
    };

    const searchHandler = (value, data) => {
        let newData = [];
        // setLoaded(false)
        // console.log(value)
        if (value) {
            newData = data.filter(function(item) {
                const itemData = item.ClientName.toUpperCase();
                const textData = value.toUpperCase();
                return itemData.includes(textData);
            })
            setMemberList([...newData]);
            // setLoaded(false)
        } else {
            setMemberList([...listData]);
            // setLoaded(false)
        }

        // setLoaded(true)
    }

    const SubmitHandler = () => {
        let dataLength = memberList.length
        
        for(let a= 0; a < dataLength; a++) {
            let b = memberList[a].attendStatus
            if(b === undefined || b === null || b === 0) {
                Alert.alert(
                    "Caution",
                    "Status kehadiran nasabah atas nama " + memberList[a].ClientName + " belum diisi.",
                    [
                        { text: "OK", onPress: () => {return false} }
                    ],
                )
                return false
            }
        }

        setVisible(true)

        Alert.alert(
            "Caution",
            "Apa anda yakin akan menyimpan data PKM ?",
            [
                { text: "BATAL", onPress: () => {
                    setVisible(false)
                }},
                { text: "OK", onPress: () => {

                    let dataLength = memberList.length
                    for(let a = 0; a < dataLength; a++) {
                        // setLoading(true)
                        // console.log('ini ' + loading)
                        let query = `UPDATE AccountList SET 
                            InstallmentAmount = '` + memberList[a].InstallmentAmount + `',
                            attendStatus = '` + memberList[a].attendStatus + `',
                            savings = '` + memberList[a].titipan + `',
                            withDraw = '` + memberList[a].tarikan + `',
                            totalSetor = '` + memberList[a].totalSetor + `' 
                            WHERE ClientID = '` + memberList[a].ClientID + `';`

                        db.transaction(
                            tx => {
                                tx.executeSql(query)
                            },function(error) {
                                setVisible(false)
                                alert('Transaction ERROR: ' + error.message);
                            }
                        )
                    }

                    let query = `UPDATE GroupList SET Status = '1' WHERE GroupID = '` + groupid + `'`
                    let queryTotal = `INSERT INTO Totalpkm (
                        userName,
                        GroupID,
                        MeetingDay,
                        TotalSetoran,
                        TotalAngsuran,
                        TotalTitipan
                    ) values (
                        '` + groupInfo.syncby + `',
                        '` + groupid + `',
                        '` + groupInfo.MeetingDay + `',
                        '` + totalSetoran + `',
                        '` + totalAngsuran + `',
                        '` + totalTitipan + `'
                    );`
                    db.transaction(
                        tx => {
                            tx.executeSql(queryTotal)
                        }, function(error) {
                            setVisible(false)
                            alert('Transaction ERROR: ' + error.message);
                        }, function() {
                            db.transaction(
                                tx => {
                                    tx.executeSql(query)
                                }, function(error) {
                                    setVisible(false)
                                    alert('Transaction ERROR: ' + error.message);
                                }, function() {
                                    setVisible(false)
                                    alert('input data berhasil');
                                    navigation.goBack()
                                }
                            )
                        }
                    )
                }},
            ]
        )
    }

    const renderContent = () => (
        <View style={{ backgroundColor: '#CCCCC4', padding: 12, height: 600,}}>

            <View style={{borderTopWidth: 4, marginBottom: 10, width: 50, borderRadius: 50, alignSelf: 'center', borderColor: '#51534E'}} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 3 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 10 }}>
                        <Text style={{ color: '#2e2e2e', fontWeight: 'bold', padding: 5, flex: 3 }}>Total Setoran</Text>
                        <CurrencyInput
                            value={totalSetoran}
                            prefix="Rp "
                            delimiter=","
                            separator="."
                            precision={0}
                            editable= {false}
                            style={{
                                color: 'black',
                                fontSize: 16,
                                padding: 5,
                                flex: 3
                            }}
                            numberOfLines={1}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 10, marginTop: 5 }}>
                        <Text style={{ color: '#2e2e2e', fontWeight: 'bold', padding: 5, flex: 3 }}>Total Angsuran</Text>
                        <CurrencyInput
                            value={totalAngsuran}
                            prefix="Rp "
                            delimiter=","
                            separator="."
                            precision={0}
                            editable= {false}
                            style={{
                                color: 'black',
                                fontSize: 16,
                                padding: 5,
                                flex: 3
                            }}
                            numberOfLines={1}
                        />
                    </View>
                </View>

                <View style={{ flex: 2, alignItems: 'center' }}>
                    <TouchableOpacity disabled={buttonSubmit} onPress={() => SubmitHandler()} style={{ paddingHorizontal: 25, paddingVertical: 5, borderRadius: 10, backgroundColor: buttonSubmit === false ? '#08847C' : '#CCCCC4' }}>
                        { buttonSubmit === false ?
                            <Text style={{ fontSize: 17, color: '#FFF', fontWeight: 'bold' }}>SUBMIT</Text> : 
                            <Text style={{ fontSize: 15, color: '#FFF', fontWeight: 'bold' }}>SUBMITTED</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{marginTop: 30}}>
                <Text style={{color: '#51534E', fontSize: 15, marginBottom: 10, margin: 10, fontWeight: 'bold'}}>Detail Draft Pertemuan Kolektif Mingguan </Text>
                <View style={{borderWidth: 1.5, borderColor: '#fff', borderRadius: 10}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 2.5, backgroundColor: '#fff', paddingLeft: 10, borderRadius: 10}}>
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', padding: 5, flex: 2 }}>Total Setoran :</Text>
                        <CurrencyInput
                            value={totalSetoran}
                            prefix="Rp "
                            delimiter=","
                            separator="."
                            precision={0}
                            editable= {false}
                            style={{
                                color: 'black',
                                fontSize: 16,
                                flex: 4
                            }}
                        />
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 2.5, backgroundColor: '#fff', paddingLeft: 10, borderRadius: 10}}>
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', padding: 5, flex: 2 }}>Total Angsuran :</Text>
                        <CurrencyInput
                            value={totalAngsuran}
                            prefix="Rp "
                            delimiter=","
                            separator="."
                            precision={0}
                            editable= {false}
                            style={{
                                color: 'black',
                                fontSize: 16,
                                flex: 4
                            }}
                        />
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 2.5, backgroundColor: '#fff', paddingLeft: 10, borderRadius: 10}}>
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', padding: 5, flex: 2 }}>Total Titipan :</Text>
                        <CurrencyInput
                            value={totalTitipan}
                            prefix="Rp "
                            delimiter=","
                            separator="."
                            precision={0}
                            editable= {false}
                            style={{
                                color: 'black',
                                fontSize: 16,
                                flex: 4
                            }}
                        />
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 2.5, backgroundColor: '#fff', paddingLeft: 10, borderRadius: 10}}>
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', padding: 5, flex: 2 }}>Total Tarikan :</Text>
                        <CurrencyInput
                            value={totalTarikan}
                            prefix="Rp "
                            delimiter=","
                            separator="."
                            precision={0}
                            editable= {false}
                            style={{
                                color: 'black',
                                fontSize: 16,
                                flex: 4
                            }}
                        />
                    </View>
                </View>
            </View>
            
        </View>
    );

    return (
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
            <View
            style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 40,
                alignItems: "center",
                paddingHorizontal: 20,
            }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>PKM</Text>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 20, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../assets/Image/Banner.png")} blurRadius={1} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                    {isLoaded ? 
                        <View>
                            <Text numberOfLines={2} style={{marginHorizontal: 35, fontSize: 25, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{groupInfo.GroupName}</Text>
                            <Text style={{marginHorizontal: 35, fontSize: 15, fontWeight: 'bold', color: '#FFF'}}>{groupInfo.GroupID}</Text>
                            <View style={{flexDirection: 'row', width: dimension.width/2.5, marginHorizontal: 35, marginTop: 10, borderRadius: 5, backgroundColor: '#FAFAF8', padding: 5}}>
                                <FontAwesome5 name="calendar-alt" size={15} color="#2e2e2e" style={{marginRight: 10}} />
                                <Text style={{fontWeight: 'bold', marginRight: 10}}>{currentDate}</Text>
                                <Text style={{fontWeight: 'bold'}}>{moment().format('LT')}</Text>
                            </View>
                        </View>
                    :
                        <View style={{alignItems: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FFF'}}>Mohon Tunggu...</Text>
                        </View>
                    }
                </ImageBackground>
            </View>

            <View style={{marginHorizontal: 20, marginTop: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                <FontAwesome5 name="search" size={15} color="#2e2e2e" style={{marginHorizontal: 10}} />
                <TextInput 
                    placeholder={"Cari Nama Nasabah"} 
                    style={{flex: 1, padding: 5, borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}
                    onChangeText={(value) => {
                        searchHandler(value, memberList)
                    }}
                />
            </View>

            <SafeAreaView style={{flex: 1, marginTop: 10}}>
                {isLoaded === false ? 
                    (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{padding: 10, borderRadius: 15, backgroundColor: '#FFF'}}>
                                <Text style={{fontWeight: 'bold', color: '#545851'}}>Mohon Tunggu...</Text>
                            </View>
                        </View>
                    ) :
                    ( <ScrollView onScrollBeginDrag={Keyboard.dismiss} style={{ marginHorizontal: 20, marginBottom: 100 }}>
                        {memberList.map((item, index) => (
                            <Child
                                key={item.AccountID}
                                item={item}
                                index={index}
                                onChange={onInputChange}
                            />
                        ))}
                    </ScrollView>
                    )
                }

            </SafeAreaView>

            <BottomSheet
                ref={btmsheet}
                snapPoints={[450, 200, 120]}
                initialSnap={2}
                borderRadius={20}
                renderContent={renderContent}
            />

                {visible &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                }
        </View>
    )
}

export default GroupCollection

const styles = StyleSheet.create({
    RadioStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    paymentStyle: {
        fontSize: 16
    },
    Detailtitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    currencyInput: {
        borderWidth: 1,
        borderRadius: 10,
        paddingTop: 0,
        height: dimension.height/18,
        width: dimension.width/3.0
    },
    deviderStyle: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: dimension.width/1.5,
        padding: 10,
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    container: {
        width: windowWidth - 80,
        height: 300,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 4,
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

})