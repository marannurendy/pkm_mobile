import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, FlatList, SafeAreaView } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DropDownPicker from 'react-native-dropdown-picker'
import db from '../database/Database'
// import { ScrollView } from 'react-native-gesture-handler'
// import { Use } from 'react-native-svg'

const MeetingDay = () => {

    const dimension = Dimensions.get('window')
    const navigation = useNavigation()
    let [aoName, setAoName] = useState()
    let [aoUname, setAoUname] = useState()
    let [branchid, setBranchid] = useState()
    let [branchName, setBranchName] = useState()
    let [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Senin', value: '2'},
        {label: 'Selasa', value: '3'},
        {label: 'Rabu', value: '4'},
        {label: 'Kamis', value: '5'},
        {label: 'Jumat', value: '6'},
        {label: 'Sabtu', value: '7'}
    ])

    useEffect(() => {
        setDatauser()
        // fetchData()
    })

    const setDatauser = () => {
        AsyncStorage.getItem('userData', (error, result) => {
            const dt = JSON.parse(result);

            setBranchid(dt.kodeCabang)
            setBranchName(dt.namaCabang)
            setAoUname(dt.userName)
            setAoName(dt.AOname)
        })
    }
    
    const fetchData = () => {
        db.transaction(
            tx => {
                tx.executeSql("SELECT DISTINCT GroupID, GroupName FROM GroupList WHERE MeetingDay = '"+value+"' AND OurBranchID = '"+branchid+"' AND syncby = '"+aoUname+"'", [], (tx, results) => {
                    let dataLength = results.rows.length

                    var helperArray = []
                    for(let d = 0; d < dataLength; d++) {
                        helperArray.push(results.rows.item(d))
                    }

                    console.log(helperArray)
                    
                    setData(helperArray)

                    // console.log("ini bos " + data)
                })

            },function(error) {
                        // console.log('Transaction ERROR: ' + error.message);
                        alert('Transaction ERROR: ' + error.message)
                    }, function() {
                        console.log('Populated OK');
                    }
        )
    }

    // LIST VIEW

    const renderItem = ({ item }) => (
        <Item data={item} />    
    )

    const pressHandler = (groupid, groupName, branchId, Username) => {
        navigation.navigate("MeetingMenu", {groupid: groupid, groupName: groupName})
    }

    const Item = ({ data }) => (
        <TouchableOpacity 
            style={{margin: 5, borderRadius: 20, backgroundColor: '#FFF'}} 
            // onPress={() => navigation.navigate("Menu", {groupid: data.groupid, groupname: data.groupname, branchid: data.branchID, username: data.username})}>
            onPress={() => pressHandler(data.GroupID, data.GroupName, branchid, aoUname)}>
            <View style={{alignItems: 'flex-start'}}>
                <ListMessage groupid={data.GroupID} groupName={data.GroupName} />
            </View>
        </TouchableOpacity>
    )

    const ListMessage = ({ groupid, groupName }) => {
        return(
            <View style={{ flex: 1, margin: 20}}>
                <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, marginBottom: 5, color: '#545851'}} >{groupName}</Text>
                <Text>{groupid}</Text>
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
                    <TouchableOpacity onPress={() => navigation.replace('FrontHome')}>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>PKM</Text>
                </View>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 30, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderRadius: 20}}>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{aoName}</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 13, fontWeight: 'bold', color: '#FFF'}}>{aoUname}</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 13, fontWeight: 'bold', color: '#FFF'}}>{branchid} - {branchName}</Text>
                </ImageBackground>
            </View>

            <View>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder={"Pilih Hari PKM"}
                    placeholderStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                    dropDownContainerStyle={{marginLeft: 30, marginTop: 25, borderColor: "#0E71C4", width: dimension.width/1.5, borderWidth: 2}}
                    style={{ marginLeft: 30, marginTop: 20, borderColor: "#FFF", width: dimension.width/1.5, borderRadius: 15 }}
                    labelStyle={{fontWeight: 'bold', fontSize: 17, margin: 10, color: '#545851'}}
                    onChangeValue={() => fetchData()}
                />
            </View>

            <SafeAreaView style={{flex: 1, marginHorizontal: 30, marginTop: 25, borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                {loading ? 
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
                            data={data}
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

export default MeetingDay

const styles = StyleSheet.create({
    listStyle : {
        borderWidth: 2
    }
})