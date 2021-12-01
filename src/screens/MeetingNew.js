import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Dimensions, StyleSheet, StatusBar, ScrollView, Alert, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
// import { TouchableOpacity } from 'react-native-gesture-handler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RadioButton, Searchbar, Divider } from 'react-native-paper';
import CurrencyInput from 'react-native-currency-input';
import update from 'react-addons-update';
import moment from 'moment';
import 'moment/locale/id';

import db from '../database/Database';
import Meeting from './Meeting';
import { useNavigation } from '@react-navigation/native';

const window = Dimensions.get('window')

export default function Meetingnew(props) {
    // const { id } = props.route.params
    const {id, group} = props.route.params
    const [search, setSearch] = useState()
    const [value, setValue] = useState()
    const [angsuran, setAngsuran] = useState([])
    const [totaltitipan, setTotaltitipan] = useState()
    const [totalangsuran, setTotalangsuran] = useState()
    const [totalTitipan, setTotalTitipan] = useState([])
    const [totalcollect, setTotalcollect] = useState()
    const [accountlist, setAccountlist] = useState([])
    const [masteraccountlist, setMasteraccountlist] = useState([])
    const [groupdetail, setGroupdetail] = useState()
    const [attendance, setAttendance] = useState()
    const [dataheader, setDataheader] = useState([])
    const [groupid, setGroupid] = useState()
    const [groupname, setGroupname] = useState()
    const [meetingday, setMeetingday] = useState()
    const [meetingtime, setMeetingtime]= useState()

    const [kehadiran, setKehadiran] = useState()

    const navigation = useNavigation()
    moment.locale('id');
    var hariIni = moment().format('LLLL')

    const FetchListAccount = () => {
        var query = 'SELECT * FROM AccountList WHERE GroupID = ' + id

        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    let dataLength = results.rows.length;

                    var helperArray = [];
                    var row = [];
                    var titip = [];
                    for(let d = 0; d < dataLength; d++) {
                        let data = results.rows.item(d);
                        helperArray.push(results.rows.item(d));
                        row.push({'GroupID': data.GroupID,'meetingday': data.MeetingDay, 'clientID': data.ClientID, 'clientname': data.ClientName, 'accountid': data.AccountID,'attendance': '', 'angsuran': data.InstallmentAmount, 'setoran': '', 'tarikan': '0', 'titipan':data.VolSavingsBal, 'productname': data.ProductID, 'totalSetor': data.InstallmentAmount, 'ke': data.ke})
                        titip.push(data.VolSavingsBal);
                    }

                    setMasteraccountlist(helperArray)
                    setAngsuran(row)
                    setTotalTitipan(titip)
                    setDataheader(helperArray.length)
                    setAccountlist(helperArray)

                })
            } 
        )
    }

    const MemoRender = useMemo(() => {
        FetchListAccount()
    }, [])

    useEffect(() => {
        navigation.addListener('focus', () => {
            // FetchListAccount()
            MemoRender            
        })
    })

    const updateSearch = (text) => {
        console.log(text)

        if (text) {


                        const newData = accountlist.filter(function (item) {
                        const itemData = item.ClientName
                        ? item.ClientName.toUpperCase()
                        : ''.toUpperCase();
                        const textData = text.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    })

                        setAccountlist(newData)
                        setSearch(text)          
            // console.log(newData)
           
        } else {
            setAccountlist(masteraccountlist)
            setSearch(text)
        }
    }

    const Item = ({ data }) => (
        <View style={styles.accountlist}>
            <AccountDetail accountname={data.ClientName} accountid={data.ClientID} />
            <Divider />
            <ProductDetail productid={data.ProductID} ke={data.ke} />
            <Divider />
            <AttendanceList attendStatus ={data.attendance} accountid={data.ClientID} />
        </View>
    )

    const AccountDetail = ({ accountname, accountid }) => {
        return(
            <View style={{ paddingBottom: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 20, backgroundColor: '#f2f2f2' }}>
                    <MaterialCommunityIcons name="account-multiple" color='black' size={30} />
                    <View style={{ width: window.width/1.4, flexDirection: 'column', paddingLeft: 20 }}>
                        <Text style={{ fontSize: 15 }}>{accountid}</Text>
                        <Text style={{ fontSize: 15 }}>{accountname}</Text>
                    </View> 
                </View>                
            </View>
            
        )
    }

    const ProductDetail = ({ productid, ke }) => {
        console.log('test')
        return(
            <View style={{ padding: 15 }}>
                <View>
                    <View style={{ flexDirection: 'row', paddingBottom: 8 }}>
                        <Text>Nama Product : {productid}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Angsuran Ke : {ke}</Text>
                    </View>
                </View>
            </View>
        )
    }

    const AttendanceList = ({ attendStatus, accountid }) => {

        const[kehadiran, SetKehadiran] = useState(attendStatus)

        const attendanceHandler = (stat) => {
            SetKehadiran(stat)

            let dataLength = accountlist.length
            var arrayHelper = []

            for(let d = 0; d < dataLength; d++) {
                arrayHelper.push(accountlist[d].ClientID)
            }

            let thisindex = arrayHelper.indexOf(accountid)
            let newArr = [...accountlist]
            newArr[thisindex].status = '1'

            setAccountlist(newArr)
        }

        return(
            <View style={{ padding: 10 }}>
                <Text style={styles.Detailtitle}>Kehadiran Nasabah*</Text>
                <View>
                    <View style={styles.RadioStyle}>
                        <RadioButton 
                        value= "1"
                        status={ kehadiran === '1' ? 'checked' : 'unchecked'}
                        // onPress={() => this.attendanceHandler('1', idx, accountID)} 
                        // onPress={() => SetKehadiran('1')}
                        onPress={() => attendanceHandler('1', accountid)}
                        />
                        <Text>1. Hadir, Bayar</Text>
                    </View>
                    <View style={styles.RadioStyle}>
                        <RadioButton 
                        value= "2"
                        status={ kehadiran === '2' ? 'checked' : 'unchecked'}
                        // onPress={() => this.attendanceHandler('2', idx, accountID)} 
                        // onPress={() => SetKehadiran('2')}
                        onPress={() => attendanceHandler('2', accountid)}
                        />
                        <Text>2. Tidak Hadir, Bayar</Text>
                    </View>
                    <View style={styles.RadioStyle}>
                        <RadioButton 
                        value= "3"
                        status={ kehadiran === '3' ? 'checked' : 'unchecked'}
                        // onPress={() => this.attendanceHandler('3', idx, accountID)}
                        // onPress={() => SetKehadiran('3')}
                        onPress={() => attendanceHandler('3', accountid)}
                        />
                        <Text>3. Hadir, Tidak Bayar</Text>
                    </View>
                    <View style={styles.RadioStyle}>
                        <RadioButton 
                        value= "4"
                        status={ kehadiran === '4' ? 'checked' : 'unchecked'}
                        // onPress={() => this.attendanceHandler('4', idx, accountID)} 
                        // onPress={() => SetKehadiran('4')}
                        onPress={() => attendanceHandler('4', accountid)}
                        />
                        <Text>4. Tidak Hadir, Tidak Bayar</Text>
                    </View>
                    <View style={styles.RadioStyle}>
                        <RadioButton 
                        value= "5"
                        status={ kehadiran === '5' ? 'checked' : 'unchecked'}
                        // onPress={() => this.attendanceHandler('5', idx, accountID)} 
                        // onPress={() => SetKehadiran('5')}
                        onPress={() => attendanceHandler('5', accountid)}
                        />
                        <Text>5. Hadir, Tanggung Renteng</Text>
                    </View>
                    <View style={styles.RadioStyle}>
                        <RadioButton
                        value= "6"
                        status={ kehadiran === '6' ? 'checked' : 'unchecked'}
                        // onPress={() => this.attendanceHandler('6', idx, accountID)} 
                        // onPress={() => SetKehadiran('6')}
                        onPress={() => attendanceHandler('6', accountid)}
                        />
                        <Text>6. Tidak Hadir, Tanggung Renteng</Text>
                    </View>
                </View>
            </View>
        )
    }

    const renderItem = ({ item }) => (
            <Item data={item} />    
    )

    const SubmitHandler = () => {
        console.log(kehadiran)

        AttendanceList
    }
 
    return(
        <View style={styles.headerWrapper}>
        <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = '#0D67B2' translucent={true}/>
        <View style={styles.headerCardContainer}>
            <View style={styles.groupDetailWrapper}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="account-multiple" color='black' size={25} />
                        <Text style={{ paddingLeft: 20,fontSize: 17 }}>{id} - {group}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="calendar-multiselect" color='black' size={25} />
                        <Text style={{ paddingLeft: 20, fontSize: 17 }}>{hariIni}</Text>
                    </View>
                </View>
            </View>
            <View opacity={0.8} style={{ alignItems: 'center', padding: 10 }}>
                <Searchbar
                    style={{
                        height: window.width/12,
                        width: window.width/1.2,
                        borderRadius: 15
                    }}
                    inputStyle={{
                        fontSize: 13,
                    }}
                    placeholder="Cari Nama Nasabah" 
                    onChangeText={(text) => updateSearch(text)}
                    value={search} 
                    />
            </View>
        </View>

            <FlatList
                data={accountlist}
                renderItem={renderItem}
                keyExtractor={item => item.ClientID}
            />


        <View style={styles.buttomBarWrapper}>
            <View>
            <View style={styles.totalSetoranStyle}>
                <Text style={{ color: '#fff', fontSize: 18 }}>Total Setoran :</Text>
                <View style={styles.totalCollectStyle}>
                    <CurrencyInput
                        value={totalcollect}
                        unit="Rp "
                        delimiter=","
                        separator="."
                        precision={0}
                        editable= {false}
                        style={{
                            color: '#fff',
                            fontSize: 18,
                            padding: 6
                        }}
                    />
                </View>
            </View>
            <View>
                <View style={styles.totalAngsuranStyle}>
                    <Text style={{ color: '#adadad', fontSize: 15 }}>Total Angsuran :</Text>
                    <View style={styles.totalCollectStyle}>
                        <CurrencyInput
                                value={totalangsuran}
                                unit="Rp "
                                delimiter=","
                                separator="."
                                precision={0}
                                editable= {false}
                                style={{
                                    color: '#adadad',
                                    fontSize: 14,
                                    paddingTop: 0,
                                    height: 30
                                }}
                            />
                    </View>
                </View>
                <View style={styles.totalAngsuranStyle}>
                    <Text style={{ color: '#adadad', fontSize: 15 }}>Total Titipan :</Text>
                    <View style={styles.totalCollectStyle}>
                        <CurrencyInput
                            value={totaltitipan}
                            unit="Rp "
                            delimiter=","
                            separator="."
                            precision={0}
                            editable= {false}
                            style={{
                                color: '#adadad',
                                fontSize: 14,
                                paddingTop: 0,
                                height: 30
                            }}
                        />
                    </View>
                </View>
            </View>
            </View>
            <View>
                <View>
                    <TouchableOpacity style={styles.submitButtonContainer} onPress={() => SubmitHandler()} >
                        <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold' }}>SUBMIT</Text>

                    </TouchableOpacity>
                </View>
            </View>
            
            
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 15,
    },
    textTitle: {
        textAlign: 'center'
    },
    headerWrapper:{
        flex: 1,
    },
    headerCardContainer: {
        backgroundColor: '#0D67B2',
        height: window.height/5,
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        padding: 15
    },
    groupDetailWrapper: {
        backgroundColor: '#fff',
        height: window.height/9,
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center'
    },
    DetailTextStyle: {
        fontSize: 15
    },
    accountContainer: {
        backgroundColor: '#E6E6E6',
        borderRadius: 20,
        borderRadius: 10,
        height: window.height/13,
        width: window.width/1.2,
        paddingLeft: 10,
        padding: 0
    },
    RadioStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    Detailtitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    currencyInput: {
        borderWidth: 1,
        borderRadius: 10,
        paddingTop: 0,
        height: window.height/18,
        width: window.width/3.0
    },
    currrencyContainer: {
        alignItems: 'flex-end'
    },
    deviderStyle: {
        top: 10,
        bottom: 10,
        backgroundColor: "#808080"
    },
    paymentStyle: {
        fontSize: 16
    },
    totalDepoStyle: {
        borderBottomWidth: 1,
        height: window.height/18,
        width: window.width/3.0
    },
    buttomBarWrapper: {
        backgroundColor: '#0D67B2',
        height: window.height/7,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    totalCollectStyle: {
        height: window.height/18,
        width: window.width/3.0
    },
    totalSetoranStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,

    },
    totalAngsuranStyle: {
        flexDirection: 'row',
        paddingLeft: 10,
        height: 30,
    },
    submitButtonContainer: {
        elevation: 8,
        borderRadius: 5,
        backgroundColor: "#28b358",
        height: window.height/20,
        width: window.width/3.7,
        justifyContent: 'center'
    },
    accountlist: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10
    },
})