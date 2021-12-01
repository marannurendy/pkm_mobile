import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar, Animated, ScrollView } from 'react-native';
// import { TextInput } from 'react-native-gesture-handler';
import { SearchBar } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CurrencyInput from 'react-native-currency-input';
import { Alert } from 'react-native';
import { Content, Card, CardItem } from 'native-base';
import update from 'react-addons-update';
import moment from 'moment';
import 'moment/locale/id';

const window = Dimensions.get('window');
import db from '../database/Database';
import { color } from 'react-native-reanimated';

const Test = () => {

}

function NumberConvert() {
    const [value, setValue] = React.useState();
  
    return (
      <CurrencyInput
        value={value}
        onChangeValue={setValue}
        unit="Rp "
        delimiter=","
        separator="."
        precision={0}
      />
    );
  }


  let totalAngsur= 0;


export default class Meeting extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            id: props.route.params.id,
            listup: [],
            listJumlahup: [],
            totalTarik: '',
            jumlahnasabah: '',
            groupname: '',
            groupid: '',
            meetingday: '',
            meetingtime: '',
            masterListup: [],
            search: '',
            status: [],
            masterUP: []
        }        
    }

    componentDidMount() {
        // console.log(this.state.id)
        var detQuery = 'SELECT DISTINCT * FROM GroupList WHERE GroupID = ';
        detQuery = detQuery + this.state.id;

        db.transaction(
            tx => {
                tx.executeSql(detQuery, [], (tx, results) => {
                    var groupname = results.rows.item(0).GroupName
                    var groupid = results.rows.item(0).GroupID
                    var meetingday = results.rows.item(0).MeetingDay
                    var meetingtime = results.rows.item(0).MeetingTime

                    this.setState({
                        groupname: groupname,
                        groupid: groupid,
                        meetingday: meetingday,
                        meetingtime: meetingtime,
                    })

                }),

                tx.executeSql("SELECT * FROM UpAccountList WHERE GroupID = " + this.state.id, [], (tx, results) => {
                    let length = results.rows.length

                    var Helper = []
                    var fuckingHelper = []
                    for(let a = 0; a < length; a++) {
                        Helper.push(results.rows.item(a)) 
                        var data = results.rows.item(a).JumlahUP
                        var dt = results.rows.item(a)
                        fuckingHelper.push({'groupid': dt.GroupID,'clientid': dt.ClientID, 'jumlahup': dt.JumlahUP, 'status': ''})
                        // console.log(shit)
                    }

                    // console.log(Helper)
                    this.setState({
                        listup: Helper,
                        masterListup: Helper,
                        masterUP: fuckingHelper
                    })
                })
            }
        )
    }

    calculateAllAngsuran = () => {
        this.setState({totalAngsuran: Number(this.state.angsuran)})
    }
    
    calculate = () => {
        this.setState({total: Number(this.state.angsuran) + Number(this.state.setoran) - Number(this.state.tarikan)})    
    }

    calculateTotalCollect = () => {
        totalAngsur = 0
        totalAngsur =  Number(this.state.angsuran)
        this.setState({totalAngsuran: totalAngsur})
    }

    BatalHandler(clientid, jumlah, id) {
        var listAkun = this.state.masterListup.length
        // console.log(listAkun)

        var arrayHelp = []
        for(let a = 0; a < listAkun; a++) {
            arrayHelp.push(this.state.masterListup[a].ClientID)
        }

        var indexTarget = arrayHelp.indexOf(clientid)

        this.setState({
            jumlahnasabah: Number(this.state.jumlahnasabah) - 1,
            totalTarik: Number(this.state.totalTarik) - Number(jumlah)
        }, () => {
            this.setState(update(this.state, {
                masterUP: {
                    [indexTarget]: {
                        status: {
                            $set: '0'
                        }
                    }
                }
            }))   
        })
    }

    TarikHandler(clientid, jumlah, id) {
        // console.log(clientid, jumlah, id)

        var listAkun = this.state.masterListup.length
        // console.log(listAkun)

        var arrayHelp = []
        for(let a = 0; a < listAkun; a++) {
            arrayHelp.push(this.state.masterListup[a].ClientID)
        }

        var indexTarget = arrayHelp.indexOf(clientid)

        this.setState({
            jumlahnasabah: Number(this.state.jumlahnasabah) + 1,
            totalTarik: Number(this.state.totalTarik) + Number(jumlah)
        }, () => {
            this.setState(update(this.state, {
                masterUP: {
                    [indexTarget]: {
                        status: {
                            $set: '1'
                        }
                    }
                }
            }))   
        })
    }

    AccountFormList(dt, id) {
        // console.log(this.state.masterListup)

        var listAkun = this.state.masterListup.length
        // console.log(listAkun)

        var arrayHelp = []
        for(let a = 0; a < listAkun; a++) {
            arrayHelp.push(this.state.masterListup[a].ClientID)
        }

        var indexTarget = arrayHelp.indexOf(dt.ClientID)

            return(
                <View>
                    <Content padder>
                    <Card>
                            <CardItem header bordered>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                                    <View style={{ alignItems: 'center' }}>
                                        
                                        <View style={{ flexDirection: 'column' }}> 
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <MaterialCommunityIcons name="account-multiple" color={'black'} size={26} />
                                                <View style={{ width: window.width/2, flexDirection: 'column' }}>
                                                    <Text style={ styles.groupList }>{dt.ClientName}</Text>
                                                    <Text style={{ fontSize: 10, paddingLeft: 10 }}>{dt.ClientID}</Text>
                                                </View> 
                                            </View>
                                                                
                                            
                                            <View style={{ paddingTop: 10 }}>
                                                <View style={styles.upBorder}>
                                                <CurrencyInput
                                                    value={this.state.listup[id].JumlahUP}
                                                    unit="Rp "
                                                    delimiter=","
                                                    separator="."
                                                    precision={0}
                                                    onChangeText={this.calculate}
                                                    style={{
                                                        fontSize: 12,
                                                        color: "black"
                                                    }}
                                                    editable={false}
                                                />
                                            </View>
                                            </View>
                                        </View>
                                    </View>                                            
                                    <View>
                                        <TouchableOpacity 
                                            style={{  backgroundColor: this.state.masterUP[indexTarget].status === '1' ? "red" : "#28b358", elevation: 8, borderRadius: 5, height: window.height/25, width: window.width/6.0, justifyContent: 'center' }}
                                            onPress={() => this.state.masterUP[indexTarget].status === '1' ? this.BatalHandler(dt.ClientID, this.state.listup[id].JumlahUP, id) : this.TarikHandler(dt.ClientID, this.state.listup[id].JumlahUP, id)}
                                        >
                                            {this.state.masterUP[indexTarget].status === '1' ? 
                                                <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 10, fontWeight: 'bold' }}>BATAL</Text> :
                                                <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 10, fontWeight: 'bold' }}>TARIK</Text>                                               
                                            }  
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                
                            </CardItem>
                    </Card>
                </Content>
                </View>
            )
        }

    updateSearch = (text) => {
        // console.log(text)
        if (text) {
            this.setState({
                listup: this.state.masterListup,
                search: text
            }, () => {
                const newData = this.state.listup.filter(function (item) {
                    const itemData = item.ClientName
                      ? item.ClientName.toUpperCase()
                      : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                })

                this.setState({
                    listup: newData,
                    search: text
                }) 
            })
           
        } else {
            this.setState({
                listup: this.state.masterListup,
                search: text
            })
        }
    }

    submitHandler() {
        
        var findstat = this.state.masterUP.filter( ({ status }) => status === '1' );
        var ts = this
        var dataLength = findstat.length

        var submitUp = "INSERT INTO DetailUP (groupid, clientid, jumlahup) values "
        for(let d = 0; d < dataLength; d++) {
            submitUp = submitUp + "('"
            +findstat[d].groupid
            +"', '"
            +findstat[d].clientid
            +"', '"
            +Number(findstat[d].jumlahup)
            + "')";

            if (d != dataLength - 1) {
                submitUp = submitUp + ", ";
            }
        }
        submitUp = submitUp + ';';
            db.transaction(
                tx => {
                    tx.executeSql(submitUp)
                },function(error) {
                    console.log('Transaction ERROR: ' + error.message);
                },function() {
                    Alert.alert(
                        "Sukses",
                        "Tarik UP Berhasil Dilakukan",
                        [
                          { text: "OK", onPress: () => ts.props.navigation.navigate("Menu", {groupid: ts.state.id}) }
                        ],
                        { cancelable: false }
                      );
                }
            )
        
    }

    render() {

        const { search } = this.state;
        
        moment.locale('id');
        var hariIni = moment().format('LLLL')

        return(
            <View style={styles.headerWrapper}>
                <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = '#0D67B2' translucent={true}/>
                <View style={styles.headerCardContainer}>
                    <View style={styles.groupDetailWrapper}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="account-multiple" color='black' size={25} />
                            <Text style={{ paddingLeft: 20,fontSize: 17 }}>{this.state.groupid + ' - ' + this.state.groupname}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="calendar-multiselect" color='black' size={25} />
                            <Text style={{ paddingLeft: 20, fontSize: 17 }}>{hariIni}</Text>
                        </View>
                    </View>
                    <View opacity={0.8} style={{ alignItems: 'center', padding: 10 }}>
                        <SearchBar
                            platform="android"
                            containerStyle={{
                                borderRadius: 20,
                                backgroundColor: '#fff',
                                width: 320,
                                height: 30,
                            }}
                            inputContainerStyle={{
                                height: 15
                            }}
                            placeholder="Cari Nama Nasabah" 
                            onChangeText={(text) => this.updateSearch(text)}
                            value={this.state.search} 
                            />
                    </View>
                </View>

                <ScrollView>
                    {this.state.listup.map((item, index) => (
                        <View key={index}>
                            {this.AccountFormList(item, index)}
                        </View>
                    ))}    
                </ScrollView>

                <View style={styles.buttomBarWrapper}>
                    <View>
                    <View style={styles.totalSetoranStyle}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>Total Tarik UP :</Text>
                        <Text style={{ color: '#fff', fontSize: 18 }}>{Number(this.state.totalTarik)}</Text>
                    </View>
                    <View>
                        <View style={styles.totalAngsuranStyle}>
                            <Text style={{ color: '#adadad', fontSize: 15 }}>Jumlah Nasabah :</Text>
                            <Text style={{ color: '#adadad', fontSize: 15 }}>{this.state.jumlahnasabah}</Text>
                        </View>
                    </View>
                    </View>
                    <View>
                        <View>
                            <TouchableOpacity style={styles.submitButtonContainer} onPress={() => this.submitHandler()}>
                                <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold' }}>SUBMIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    
                </View>
            </View>
        )
    }
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
        height: window.height/18,
        width: window.width/1.2,
        paddingLeft: 10,
        padding: 5
    },
    RadioStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    Detailtitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    currencyInput: {
        borderWidth: 1,
        borderRadius: 10,
        paddingTop: 0,
        height: window.height/18,
        width: window.width/2.5
    },
    currrencyContainer: {
        alignItems: 'flex-end'
    },
    deviderStyle: {
        borderBottomColor: 'black',
        borderBottomWidth: 0.7,
        width: window.width/1.5,
        padding: 10,
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
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    totalCollectStyle: {
        height: window.height/18,
        width: window.width/3.0
    },
    totalSetoranStyle: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',

    },
    totalAngsuranStyle: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    submitButtonContainer: {
        elevation: 8,
        borderRadius: 5,
        backgroundColor: "#28b358",
        height: window.height/20,
        width: window.width/3.7,
        justifyContent: 'center'
    },
    groupList: {
        fontSize: 13,
        fontWeight: 'bold',
        paddingLeft: 10,
        flexWrap: 'wrap',
        flex: 3,
    },
    upBorder: {
        borderWidth: 1,
        borderRadius: 10,
        height: window.height/20,
        width: window.width/2.5
    },
    clientName: {
        flexWrap: 'wrap',
        flex: 0.2
    }
})