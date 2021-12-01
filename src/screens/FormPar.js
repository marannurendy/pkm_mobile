import React, { createRef } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity, ScrollView, Alert, ToastAndroid } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CurrencyInput from 'react-native-currency-input';
import SignatureCapture from 'react-native-signature-capture';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/id';

import db from '../database/Database';
const window = Dimensions.get('window');


function DetailKelompok(props) {

    moment.locale('id');
    const hariIni = moment().format('LLLL')

    return(
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="account-group" color='black' size={25} />
                        <Text style={{ paddingLeft: 20,fontSize: 17 }}>{props.idcabang} - {props.namacabang}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="account-multiple" color='black' size={25} />
                        <Text style={{ paddingLeft: 20,fontSize: 17 }}>{props.idkelompok} - {props.namakelompok}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="calendar-multiselect" color='black' size={25} />
                        <Text style={{ paddingLeft: 20, fontSize: 17 }}>{hariIni}</Text>
                    </View>
        </View>
    )
}

function DetailNasabahPar(props) {
    return(
        <View>
            <View style={{ paddingBottom: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Nama Nasabah : {props.clientname}</Text>
                </View>
                <View style={{ paddingTop: 15, flexDirection: 'row' }}>
                    <Text>ID nasabah : {props.clientid}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Total Angsuran : </Text>
                    <CurrencyInput
                        value={props.jumlahpar}
                        unit="Rp "
                        delimiter=","
                        separator="."
                        precision={0}
                        editable={false}
                        style={{
                            color: 'black'
                        }}
                        // onChangeText={this.Hitung(this.state.angsuran[idx])}
                    />
                </View>
                
            </View>
        </View>
    )
}


export default class FormPar extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            id: props.route.params.id,
            clientid: props.route.params.clientid,
            accountid: props.route.params.accountid,
            jumlahpar: props.route.params.jumlahpar,
            groupid: props.route.params.groupid,
            parSum: '',
            setoran: '',
            tarikan: '',
            groupDetail: [],
            groupID: '',
            meetingDay: '',
            meetingTime: '',
            memberList: [],
            nameSelect: '',
            sign1: '',
            sign2: '',
            ketuaKelompok: '',
            branchID: '',
            namaCabang: '',
            Username: '',
            AOname: '',
            buttonSaveOne: true,
            buttonSaveTwo: true,
        }
    }

    componentDidMount() {
        var clientid = this.state.clientid
        var accountid = this.state.accountid
        var query = "SELECT * FROM PAR_AccountList WHERE ClientID = '" + clientid + "' AND AccountID = '" + accountid + "'";

        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    let datalength = results.rows.length

                    var dataHelper = []
                    var par = ''
                    for(let a = 0; a < datalength; a++) {
                        par = results.rows.item(a).ODAmount
                        dataHelper.push(results.rows.item(a))
                    }

                    // console.log(par)
                    this.setState({
                        groupDetail: dataHelper,
                        parSum: par
                        
                    })

                })
            },function(error) {
                console.log('Transaction ERROR: ' + error.message);
            },function() {
                console.log('ok');
            }
        )

        AsyncStorage.getItem('userData', (error, result) => {
            const dt = JSON.parse(result);
            this.setState({
                branchID: dt.kodeCabang,
                namaCabang: dt.namaCabang,
                Username: dt.userName,
                AOname: dt.AOname,
            })
        })

    }

    AccountForm = () => {

        const sign = createRef();
        

        const saveSign2 = () => {
            sign.current.saveImage();
            ToastAndroid.show("Sukses: Tanda tangan Account Officer Berhasil Disimpan", ToastAndroid.SHORT)
        };

        const resetSign2 = () => {
            sign.current.resetImage();
            this.setState({
                buttonSaveTwo: true
            })
        };

        const thatFunction = (result) => {
            var a = result.encoded
            this.setState({
                sign2: a
            })
        }

        const _onDragEvents = () => {
            // This callback will be called when the user enters signature
            console.log('dragged');
            this.setState({
                buttonSaveTwo: false
            })
        }

            return(
                <View>
                <Card containerStyle={{}} wrapperStyle={{}}>
                    <Card.Title>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', paddingBottom: 10 }}>Tanda Tangan Account Officer</Text>
                        </View>
                    </Card.Title>
                    <Card.Divider />
                    <View style={{ borderWidth: 1 }}>
                    <SignatureCapture
                        style={styles.signature}
                        ref={sign}
                        onSaveEvent={thatFunction}
                        onDragEvent={_onDragEvents}
                        showNativeButtons={false}
                        showTitleLabel={false}
                        viewMode={'portrait'}
                    />
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{
                                    borderRadius: 7,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 20,
                                    width: 50,
                                    margin: 10,
                                    backgroundColor: this.state.buttonSaveTwo == true ? '#E6E6E6' : '#0D67B2'
                                }}
                                onPress={() => {saveSign2()}}
                                disabled={this.state.buttonSaveTwo}
                            >
                                <Text style={{ color: '#fff' }}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    borderRadius: 7,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 20,
                                    width: 50,
                                    margin: 10,
                                    backgroundColor: '#0D67B2'
                                }}
                                onPress={() => {resetSign2()}}
                            >
                                <Text style={{ color: '#fff' }}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                        
                    </View>
           
                </Card>
            </View>
            )
    }

    handleChange(text) {
        this.setState({
            parSum: text
        })
    }
    
    AccountFormList = (dt) => {

        const sign = createRef();

        const saveSign = (clientname) => {
            sign.current.saveImage();
            ToastAndroid.show("Sukses: Tanda tangan " + dt.ClientName + " Berhasil Disimpan", ToastAndroid.SHORT)
        };

        const resetSign = () => {
            sign.current.resetImage();
            this.setState({
                buttonSaveOne: true
            })
        };

        const thisFunction = (result) => {
            var a = result.encoded
            this.setState({
                sign1: a
            })
        }

        const _onDragEvent = () => {
            // This callback will be called when the user enters signature
            console.log('dragged');
            this.setState({
                buttonSaveOne: false
            })
        };

            return(
                <View>
                <Card containerStyle={{}} wrapperStyle={{}}>
                    <Card.Title>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', paddingBottom: 10 }}>Tanda Tangan Nasabah</Text>
                        </View>
                    </Card.Title>
                    <Card.Divider />
                        <DetailNasabahPar clientname={dt.ClientName} clientid={dt.ClientID} jumlahpar={dt.ODAmount} />
                    <Card.Divider />
                    <View style={{ paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.paymentStyle}>Angsuran</Text>
                                <View style={styles.currencyInput}>
                                    <CurrencyInput
                                        onChangeValue={(text) => this.handleChange(text)}
                                        value={this.state.parSum}
                                        unit="Rp "
                                        delimiter=","
                                        separator="."
                                        precision={0}
                                        // onChangeText={this.Hitung(this.state.angsuran[idx])}
                                    />
                                </View>
                    </View>
                    <Card.Divider />
                    <View style={{ borderWidth: 1 }}>
                    <SignatureCapture
                        style={styles.signature}
                        ref={sign}
                        onSaveEvent={thisFunction}
                        onDragEvent={_onDragEvent}
                        showNativeButtons={false}
                        showTitleLabel={false}
                        viewMode={'portrait'}
                    />
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{
                                    borderRadius: 7,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 20,
                                    width: 50,
                                    margin: 10,
                                    padding: 5,
                                    backgroundColor: this.state.buttonSaveOne == true ? '#E6E6E6' : '#0D67B2'
                                }}
                                onPress={ () => {saveSign(dt.ClientName)} }
                                disabled={this.state.buttonSaveOne}
                            >
                                <Text style={{ color: '#fff' }}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    borderRadius: 7,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 20,
                                    width: 50,
                                    margin: 10,
                                    padding: 5,
                                    backgroundColor: '#0D67B2'
                                }}
                                onPress={() => {resetSign()} }
                            >
                                <Text style={{ color: '#fff' }}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                        
                    </View>
           
                </Card>
                <View>
                    {this.AccountForm()}
                </View>
            </View>
            )
        }

    buttonSubmit() {
        moment.locale('id');
        var tanggal = moment().format('YYYY-MM-DD')

        var ts = this
        var accountid = this.state.accountid
        var clientid = this.state.clientid
        var parSum = this.state.parSum
        var groupid = this.state.groupid
        var idcabang = this.state.branchID
        var username = this.state.Username
        var clientsign = this.state.sign1
        var aosign = this.state.sign2

        if(this.state.parSum === null) {
            alert('Masukkan Jumlah Angsuran')
        }else if(this.state.sign1 == '' || this.state.sign2 == '') {
            alert('Semua Field Harus ditandatangani')
        }else {
            var queryCheck = "SELECT * FROM DetailPAR WHERE clientid = '"+ clientid +"'"
            var insertPar = "INSERT INTO DetailPAR (cabangid, groupid, clientid, accountid, jumlahpar, clientSign, AOSign, createdby, trxdate) values ('"+idcabang+"', '"+groupid+"', '"+clientid+"', '"+accountid+"', '"+parSum+"', '"+clientsign+"', '"+aosign+"', '"+username+"', '"+tanggal+"')"
            var insertDetailPar = "UPDATE PAR_AccountList SET jumlahbayar = '"+ Number(parSum) +"', status = '1' WHERE ClientID = '"+ clientid +"' AND AccountID = '"+ accountid +"'"
            console.log(insertDetailPar)

            db.transaction(
                tx => {
                    tx.executeSql(queryCheck, [], (tx, results) => {
                        var dataLength = results.rows.length

                        if(dataLength == 0 ) {
                            db.transaction(
                                tx => {
                                    tx.executeSql(insertPar)
                                },function(error) {
                                    console.log('Transaction ERROR: ' + error.message);
                                }, function() {
                                    db.transaction(
                                        tx => {
                                            tx.executeSql(insertDetailPar)
                                        },function(error) {
                                            console.log('Input Par Gagal: ' +error.message)
                                        },function() {
                                            Alert.alert(
                                                "Sukses",
                                                "Input angsuran nasabah PKM berhasil dilakukan",
                                                [
                                                //   { text: "OK", onPress: () => ts.props.navigation.navigate("MeetingPAR", {cabangid: ts.state.id}) }
                                                  { text: "OK", onPress: () => ts.props.navigation.navigate("IndividualMeeting") }
                                                ],
                                                { cancelable: false }
                                              );
                                        }
                                    )   
                                }
                            )
                        }else{
                            Alert.alert(
                                "Gagal !",
                                "Input angsuran nasabah PKM Gagal Dilakukan",
                                [
                                  { text: "OK", onPress: () => ts.props.navigation.navigate("IndividualMeeting") }
                                ],
                                { cancelable: false }
                              );
                        }
                    })
                },function(error) {
                    console.log('Transaction ERROR: ' + error.message);
                }, function() {
                    console.log('Populated database OK');
                }
            )
        } 

        

    }

    render() {

        return(
            <View style={styles.headerWrapper}>
                <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = '#0D67B2' translucent={true}/>
                <View style={styles.headerCardContainer}>
                    <View style={styles.groupDetailWrapper}>
                        {this.state.groupDetail.map((item, index) => (
                            <DetailKelompok key={index} idcabang={this.state.branchID} namacabang={this.state.namaCabang} idkelompok={item.GroupID} namakelompok={item.GroupName}/>
                        ))}
                    </View>
                </View>

                <ScrollView>
                    {this.state.groupDetail.map((item, index) => (
                        <View key={index}>
                            {this.AccountFormList(item)}
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.buttomBarWrapper}>
                <View>
                    <View style={styles.totalSetoranStyle}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>Total Setoran :</Text>
                        <View style={styles.totalCollectStyle}>
                            <CurrencyInput
                                value={this.state.parSum}
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
                    
                    </View>
                    <View>
                        <View>
                            <TouchableOpacity style={styles.submitButtonContainer} onPress={() => this.buttonSubmit()} >
                                <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold' }}>SIMPAN</Text>
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
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        padding: 15
    },
    groupDetailWrapper: {
        backgroundColor: '#fff',
        height: window.height/7,
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
        width: window.width/3.0
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
        height: window.height/8,
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
    signature: {
        flex: 1,
        height: window.height/3,
        borderWidth: 1,
      },
      buttonStyle: {
        borderWidth: 1,
        borderRadius: 7,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
        width: 50,
        margin: 10,
      },
})