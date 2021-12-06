import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import db from '../database/Database'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { flex } from 'styled-system'

const MeetingMenu = ({route}) => {

    const navigation = useNavigation()
    const dimension = Dimensions.get('screen')

    const { groupid } = route.params

    let [currentDate, setCurrentDate] = useState()
    let [branchid, setBranchid] = useState()
    let [branchName, setBranchName] = useState()
    let [groupInfo, setGroupInfo] = useState()
    let [isLoaded, setLoaded] = useState(false)
    // let [jumlahTagih, setJumlahTagih] = useState()

    useEffect(() => {
        GetInfo()
    }, [])

    const GetInfo = async () => {

        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)

        AsyncStorage.getItem('userData', (error, result) => {
            const dt = JSON.parse(result);

            setBranchid(dt.kodeCabang)
            setBranchName(dt.namaCabang)
        })

        var query = 'SELECT DISTINCT * FROM GroupList where GroupID = ' + groupid
        var queryHeader = 'SELECT * FROM Totalpkm where GroupID = ' + groupid + " AND TotalSetoran IS NOT NULL"
        var queryCekSync = "SELECT TtdKetuaKelompok, TtdAccountOfficer FROM Totalpkm where GroupID = " + groupid
        var cekup = "SELECT * FROM DetailUP";
        var queryCekSign = "SELECT * FROM Totalpkm WHERE GroupID = " + "'" + groupid + "'" + "AND trxdate = " + "'" + tanggal + "'" + "AND TtdKetuaKelompok IS NOT NULL"

        const SelectGroupInfo = (query) => (new Promise((resolve, reject) => {
            try{
                db.transaction(
                    tx => {
                        tx.executeSql(query, [], (tx, results) => {
                            // let dataLength = results.rows.length
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

        const DataGroupInfo = await SelectGroupInfo(query)
        // console.log(DataGroupInfo.AnggotaAktif)
        setGroupInfo(DataGroupInfo)
        // setJumlahTagih(number(DataGroupInfo.JumlahTagihan))
        setLoaded(true)
    } 

    return (
        <ImageBackground source={require("../../assets/Image/Background.png")} style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
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
                    <TouchableOpacity onPress={() => navigation.navigate('Sync')}>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>PKM</Text>
                </View>
            </View>

            <View style={{marginHorizontal: 20, marginTop: 20}}>
                {isLoaded ? 
                    <View>
                        <Text numberOfLines={2} style={{fontSize: 30, fontWeight: 'bold', color: '#FFF'}}>{groupInfo.GroupName}</Text>
                        <View>
                            <Text style={{fontSize: 15, color: '#FFF'}}>{groupInfo.GroupID}</Text>
                            <Text numberOfLines={1} style={{fontSize: 15, color: '#FFF'}}>{branchid} - {branchName}</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 10, marginRight: 10, alignItems: 'center', borderRadius: 5, padding: 5, backgroundColor: '#FFF', width: dimension.width/1.5}}>
                            <FontAwesome5 name="calculator" size={15} color="#2e2e2e" style={{marginRight: 5}} />
                            <Text>Jumlah Tagihan: Rp.{Number(groupInfo.JumlahTagihan)}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flexDirection: 'row', marginTop: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 5, padding: 5, backgroundColor: '#FFF'}}>
                                <FontAwesome5 name="calendar-alt" size={15} color="#2e2e2e" style={{marginRight: 5}} />
                                <Text>{currentDate}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 5, padding: 5, backgroundColor: '#FFF'}}>
                                <FontAwesome5 name="user-friends" size={15} color="#2e2e2e" style={{marginRight: 5}} />
                                <Text>{groupInfo.AnggotaAktif}</Text>
                            </View>
                        </View>
                    </View>
                : 
                    <View style={{marginTop: 20, justifyContent: 'flex-start'}}>
                        <Text style={{fontSize: 17, fontWeight: 'bold', color: '#FFF'}}>Mohon Tunggu...</Text>
                    </View>
                }
            </View>

            <View style={{flex: 1, borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: '#FFF', marginTop: 35, padding: 20}}>
                <View>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>Status Sync</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', padding: 5}}>
                        <View style={{borderWidth: 1, width: dimension.width/2.5, padding: 5, alignItems: 'center', borderRadius: 20}}>
                            <Text>Berhasil Sync</Text>
                        </View>
                        <View style={{width: dimension.width/2.5, padding: 5, alignItems: 'center', borderRadius: 20, backgroundColor: '#C73D3D'}}>
                            <Text style={{fontWeight: 'bold', color: '#FFF'}}>Belum Sync</Text>
                        </View>
                    </View>
                </View>

                <View style={{marginTop: 30, flex: 1, padding: 10}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>MENU</Text>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10}}>
                        <TouchableOpacity onPress={() => navigation.navigate('GroupCollection', {groupid: groupid})} style={{width: dimension.width/4, height: dimension.height/7, borderRadius: 20, padding: 10, backgroundColor: '#32908F'}}>
                            <FontAwesome5 name="users" size={25} color="#FAFAF8" style={{marginRight: 5}} />
                            <View style={{margin: 10}}>
                                <Text style={{fontWeight: 'bold', fontSize: 25, color: '#FAFAF8'}}>PKM</Text> 
                            </View>
                        </TouchableOpacity>

                        <View style={{width: dimension.width/4, height: dimension.height/7, borderRadius: 20, padding: 10, backgroundColor: '#FF521B'}}>
                            <FontAwesome5 name="user-check" size={25} color="#FAFAF8" style={{marginRight: 5}} />
                            <View style={{margin: 10}}>
                                <Text numberOfLines={2} style={{fontWeight: 'bold', fontSize: 19, color: '#FAFAF8'}}>Uang Pertanggungjawaban</Text> 
                            </View>
                        </View>

                        <View style={{width: dimension.width/4, height: dimension.height/7, borderRadius: 20, padding: 10, backgroundColor: '#9C482E'}}>
                            <FontAwesome5 name="signature" size={25} color="#FAFAF8" style={{marginRight: 5}} />
                            <View style={{margin: 10}}>
                                <Text numberOfLines={2} style={{fontWeight: 'bold', fontSize: 18, color: '#FAFAF8'}}>Tanda Tangan</Text> 
                            </View>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10}}>
                        <View style={{width: dimension.width/4, height: dimension.height/7, borderRadius: 20, padding: 10, backgroundColor: '#E94F37'}}>
                            <FontAwesome5 name="clipboard-check" size={25} color="#FAFAF8" style={{marginRight: 5}} />
                            <View style={{margin: 10}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20, color: '#FAFAF8'}}>Report</Text> 
                            </View>
                        </View>

                        <View style={{width: dimension.width/4, height: dimension.height/7, borderRadius: 20, padding: 10, backgroundColor: '#F4A634'}}>
                            <FontAwesome5 name="clipboard-list" size={25} color="#FAFAF8" style={{marginRight: 5}} />
                            <View style={{margin: 10}}>
                                <Text numberOfLines={2} style={{fontWeight: 'bold', fontSize: 20, color: '#FAFAF8'}}>PKM Bermakna</Text> 
                            </View>
                        </View>

                        <View style={{width: dimension.width/4, height: dimension.height/7, borderRadius: 20, padding: 10, backgroundColor: '#FAD133'}}>
                            <FontAwesome5 name="sync-alt" size={25} color="#FAFAF8" style={{marginRight: 5}} />
                            <View style={{margin: 10}}>
                                <Text style={{fontWeight: 'bold', fontSize: 25, color: '#FAFAF8'}}>Sync</Text> 
                            </View>
                        </View>
                    </View>

                </View>
            </View>

        </ImageBackground>
    )
}

export default MeetingMenu

const styles = StyleSheet.create({
    
})