import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, SafeAreaView, FlatList, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import db from '../database/Database'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import { RadioButton } from 'react-native-paper'
import { marginTop } from 'styled-system'

const GroupCollection = ({route}) => {

    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [currentDate, setCurrentDate] = useState()
    let [groupInfo, setGroupInfo] = useState()
    let [isLoaded, setLoaded] = useState(false)
    let [memberList, setMemberList] = useState([])
    let [attendList, setAttendList] = useState([])

    let [listData, setListData] = useState([])


    const { groupid, GroupName } = route.params

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
                            // let dataLength = results.rows.length
                            // console.log("yang ini bang " + dataLength)
                            // var datasign = []
                            // for(let a = 0; a < dataLength; a++) {
                            //     datasign.push(results.rows.item(a))
                            // }

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

        const SelectMemberList = (memberList) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(memberList, [], (tx, results) => {
                            let dataLength = results.rows.length
                            var dataList = []
                            for(let a = 0; a < dataLength; a++) {
                                dataList.push(results.rows.item(a))
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

        const SelectAttendStatus = (memberList) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(memberList, [], (tx, results) => {
                            let dataLength = results.rows.length
                            var dataAbsent = []
                            for(let a = 0; a < dataLength; a++) {
                                let data = results.rows.item(a)
                                dataAbsent.push({'attendStatus': data.attendStatus})
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

        setGroupInfo(DataGroupInfo)
        setMemberList(DataMemberList)
        setAttendList(DataAttendStatus)

        setListData(DataMemberList)
        // setJumlahTagih(number(DataGroupInfo.JumlahTagihan))
        setLoaded(true)
    }

    // LIST VIEW

    const renderItem = ({ item }) => (
        <Item data={item} />
    )

    const pressHandler = (groupid, groupName, branchId, Username) => {
        navigation.navigate("MeetingMenu", {groupid: groupid})
    }

    const Item = ({ data }) => (
        <TouchableOpacity 
            style={{marginHorizontal: 20, marginVertical: 10, borderRadius: 20, backgroundColor: '#FFF'}}
        >
            <View>
                <ListMessage 
                    memberName={data.ClientName} 
                    clientid={data.ClientID} 
                    productid={data.ProductID} 
                    jumlahAngsuran={data.ke}
                    attendStatus={data.attendStatus}
                />
            </View>
        </TouchableOpacity>
    )

    const attendanceHandler = (idAbsent, index, clientid) => {
        let newArr = [...attendList]
        newArr[index] = idAbsent

        setAttendList(newArr)
    }

    const searchHandler = (value, data) => {
        let newData = [];
        console.log(value)
        if (value) {
            newData = data.filter(function(item) {
                const itemData = item.ClientName.toUpperCase();
                const textData = value.toUpperCase();
                return itemData.includes(textData);
            })
            console.log("yang ini ==> " + newData)
            setMemberList([...newData]);
        } else {
            console.log("that")
            setMemberList([...listData]);
        }
    }

    const ListMessage = ({ memberName, clientid, productid, jumlahAngsuran }) => {
        function getIndex(clientid) {
            return memberList.findIndex(obj => obj.ClientID === clientid);
        }
        var index = getIndex(clientid)

        return(
            <View style={{margin: 20}}>
                <View style={{paddingVertical: 10, paddingHorizontal: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, borderBottomRightRadius:20, backgroundColor: '#0E71C4'}}>
                    <Text numberOfLines={2} style={{fontWeight: 'bold', fontSize: 18, marginBottom: 5, color: '#FAFAF8'}} >{memberName}</Text>
                    <Text style={{fontWeight: 'bold', fontSize: 15, marginBottom: 5, color: '#FAFAF8'}} >{clientid}</Text>
                </View>

                <View style={{marginTop: 10}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{marginHorizontal: 10, width: dimension.width/4}}>Product ID</Text>
                        <Text style={{marginHorizontal: 5}}>:</Text>
                        <Text>{productid}</Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={{marginHorizontal: 10, width: dimension.width/4}}>Angsuran Ke</Text>
                        <Text style={{marginHorizontal: 5}}>:</Text>
                        <Text>{jumlahAngsuran}</Text>
                    </View>
                </View>

                <View style={{borderBottomWidth: 1, marginVertical: 10}} />

                <View>
                    <Text style={{fontWeight: 'bold', fontSize: 15}}>Kehadiran Nasabah</Text>

                    <View>
                        <View style={styles.RadioStyle}>
                            <RadioButton 
                                value= "1"
                                status={ attendList[index] === '1' ? 'checked' : 'unchecked'}
                                onPress={() => attendanceHandler('1', index, clientid)} 
                            />
                            <Text>1. Hadir, Bayar</Text>
                        </View>
                        <View style={styles.RadioStyle}>
                            <RadioButton 
                                value= "2"
                                status={ attendList[index] === '2' ? 'checked' : 'unchecked'}
                                onPress={() => attendanceHandler('2', index, clientid)} 
                            />
                            <Text>2. Tidak Hadir, Bayar</Text>
                        </View>
                        <View style={styles.RadioStyle}>
                            <RadioButton 
                                value= "3"
                                status={ attendList[index] === '3' ? 'checked' : 'unchecked'}
                                onPress={() => attendanceHandler('3', index, clientid)} 
                            />
                            <Text>3. Hadir, Tidak Bayar</Text>
                        </View>
                        <View style={styles.RadioStyle}>
                            <RadioButton 
                                value= "4"
                                status={ attendList[index] === '4' ? 'checked' : 'unchecked'}
                                onPress={() => attendanceHandler('4', index, clientid)} 
                            />
                            <Text>4. Tidak Hadir, Tidak Bayar</Text>
                        </View>
                        <View style={styles.RadioStyle}>
                            <RadioButton 
                                value= "5"
                                status={ attendList[index] === '5' ? 'checked' : 'unchecked'}
                                onPress={() => attendanceHandler('5', index, clientid)} 
                            />
                            <Text>5. Hadir, Tanggung Renteng</Text>
                        </View>
                        <View style={styles.RadioStyle}>
                            <RadioButton
                                value= "6"
                                status={ attendList[index] === '6' ? 'checked' : 'unchecked'}
                                onPress={() => attendanceHandler('6', index, clientid)} 
                            />
                            <Text>6. Tidak Hadir, Tanggung Renteng</Text>
                        </View>
                    </View>
                </View>

            </View>
        )
    }

    // END LIST VIEW

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
                <View style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <TouchableOpacity onPress={() => navigation.replace("MeetingMenu", {groupid: groupid})}>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>PKM</Text>
                </View>
                {/* <View style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <TouchableOpacity onPress={() => navigation.replace("Meeting", {id : groupid, group : groupname})}>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>PKM</Text>
                </View> */}
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

            <SafeAreaView style={{flex: 1, marginTop: 20}}>
                {isLoaded === false ? 
                    (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{padding: 10, borderRadius: 15, backgroundColor: '#FFF'}}>
                                <Text style={{fontWeight: 'bold', color: '#545851'}}>Mohon Tunggu...</Text>
                            </View>
                        </View>
                    ) :
                    ( <View style={{ justifyContent:  'space-between'}}>
                        <FlatList
                            // contentContainerStyle={styles.listStyle}
                            // refreshing={refreshing}
                            // onRefresh={() => _onRefresh()}
                            data={memberList}
                            keyExtractor={(item, index) => index.toString()}
                            enabledGestureInteraction={true}
                            // onEndReachedThreshold={0.1}
                            // onEndReached={() => handleEndReach()}
                            renderItem={renderItem}
                            // style={{height: '88.6%'}}
                        /> 
                    </View>
                    )
                }
            </SafeAreaView>

        </View>
    )
}

export default GroupCollection

const styles = StyleSheet.create({
    RadioStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
})