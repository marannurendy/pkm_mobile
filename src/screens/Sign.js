import React, { createRef } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, ScrollView, Alert, ToastAndroid, PermissionsAndroid, TouchableOpacity } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CurrencyInput from 'react-native-currency-input';
import SignatureCapture from 'react-native-signature-capture';
import { Picker } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/id';
// import Geolocation from '@react-native-community/geolocation';

import db from '../database/Database';
const window = Dimensions.get('window');

  function DetailKelompok(props) {
        moment.locale('id');
        var hariIni = moment().format('LLLL')

      return(
          <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="account-group" color='black' size={25} />
                            <Text style={{ paddingLeft: 20,fontSize: 15, width: window.width/1.27 }}>{props.kodeCabang} - {props.namaCabang}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="account-multiple" color='black' size={25} />
                            <Text style={{ paddingLeft: 20,fontSize: 15, width: window.width/1.27 }}>{props.idkelompok} - {props.namakelompok}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="calendar-multiselect" color='black' size={25} />
                            <Text style={{ paddingLeft: 20, fontSize: 15, width: window.width/1.27 }}>{hariIni}</Text>
                        </View>
          </View>
      )
  }


export default class Sign extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            id: props.route.params.id,
            loggeduser: props.route.params.username,
            angsuran: '',
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
            buttonSaveTwo: true
        }
    }

    componentDidMount() {
        var query = 'SELECT DISTINCT * FROM Totalpkm WHERE GroupID = ';
        query = query + "'" + this.state.id + "'" + ";";
        var detQuery = 'SELECT DISTINCT * FROM GroupList WHERE GroupID = ';
        detQuery = detQuery + "'" + this.state.id + "'" + ";";
        var listMember = 'SELECT ClientID, ClientName FROM AccountList WHERE GroupID = ';
        listMember = listMember + this.state.id

        // console.log(this.state.loggeduser);

        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    // console.log(dataLength)

                    var arrayHelper = []
                    var data = ''
                    for(let d = 0; d < 1; d++) {
                        data = results.rows.item(d);
                        arrayHelper.push(results.rows.item(d));
                    }
                    // console.log(data)
                    
                    this.setState({
                        totaldetail: arrayHelper,
                        angsuran: data.TotalAngsuran,
                        setoran: data.TotalSetoran,
                        titipan: data.TotalTitipan,
                    })

                    
                }),

                tx.executeSql(detQuery, [], (tx, results) => {
                    let datalength = results.rows.length

                    let helperArray = [];
                    for(let a = 0; a < datalength; a++) {
                        var data = results.rows.item(a);
                        helperArray.push(results.rows.item(a));
                    }
                    // console.log(helperArray)
                    this.setState({
                        groupDetail: helperArray,
                        groupID: data.GroupID,
                        meetingDay: data.MeetingDay,
                        meetingTime: data.MeetingTime,
                    })

                    
                }),

                tx.executeSql(listMember, [], (tx, results) => {
                    let datalength = results.rows.length

                    var helperArray = []
                    for(let q = 0; q < datalength; q++) {
                        helperArray.push(results.rows.item(q));
                    }
                    this.setState({
                        memberList: helperArray,
                    })
                })

            },function(error) {
                console.log('Transaction ERROR: ' + error.message);
            }, function() {
                console.log(this.state.groupDetail);
            }
        )

        AsyncStorage.getItem('userData', (error, result) => {
            const data = JSON.parse(result);
            this.setState({
                branchID: data.kodeCabang,
                namaCabang: data.namaCabang,
                Username: data.userName,
                AOname: data.AOname,
            })
        })

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

    AccountForm = () => {
        const sign = createRef();

        const saveSign2 = () => {
            sign.current.saveImage();
            ToastAndroid.show("Sukses: Tanda tangan Account Officer Berhasil Disimpan", ToastAndroid.LONG)
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
        };

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

    AccountPicker(shit) {
        // console.log(shit);
        this.setState({
            nameSelect: shit
        })
    }
    
    AccountFormList = () => {

        const sign = createRef();

        const saveSign = () => {
            sign.current.saveImage();
            ToastAndroid.show("Sukses: Tanda tangan Ketua Kelompok Berhasil Disimpan", ToastAndroid.LONG)
        };

        const resetSign = () => {
            sign.current.resetImage()
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
            this.setState({
                buttonSaveOne: false
            })
        };

            return(
                <View>
                <Card containerStyle={{}} wrapperStyle={{}}>
                    <Card.Title>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', paddingBottom: 10 }}>Tanda Tangan Ketua Sub Kelompok</Text>
                        </View>
                    </Card.Title>
                    <Card.Divider />
                    <View>
                        <View>
                            <Text style={{ fontSize: 13, fontStyle: 'italic' }}>*Pilih Nama Ketua Kelompok</Text>
                        </View>
                        <View style={{ borderWidth: 1 }}>
                            <Picker
                                selectedValue={this.state.nameSelect}
                                style={{height: 35}}
                                onValueChange={(itemValue, itemIndex) => this.AccountPicker(itemValue)
                            }>
                                <Picker.Item label='Silahkan Pilih' />
                                {this.state.memberList.map((item, index) => (
                                    <Picker.Item label={item.ClientName} value={item.ClientID} key={index} />
                                ))}
                            </Picker>
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
                                onPress={ () => {saveSign()} }
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

    updateSearch = (search) => {
        this.setSearch({ search });
    };

    buttonSubmit() {
        var ts = this
        // console.log(this.state.nameSelect)

        let a = (this.state.sign1 == '') ? null : this.state.sign1;
        let b = (this.state.sign2 == '') ? null : this.state.sign2;
        let c = (this.state.nameSelect == '') ? null : this.state.nameSelect;
        let d = (this.state.loggeduser == '') ? null : this.state.loggeduser;

        // console.log('this shit '+c)

        if(a == null || b == null || c == null){
            if(a == null || b == null) {
                alert('Semua Form Harus di Tandatangani')
            }else if (c == null) {
                alert('Pilih Nama Ketua Kelompok')
            }
        }else{
            var query = "UPDATE Totalpkm SET TtdKetuaKelompok = " + "'" + a + "', " + "TtdAccountOfficer = " + "'" + b + "', " + "IDKetuaKelompok = " + "'" + c + "', " + "userName = " + "'" + d + "' " + "WHERE GroupID = "
            query = query + this.state.id

            // console.log(query)
            db.transaction(
                tx => {
                    tx.executeSql(query)
                },function(error) {
                    console.log('Transaction ERROR: ' + error.message);
                }, function() {
                    Alert.alert(
                        "Sukses",
                        "Jumlah angsuran yang diterima telah disetujui bersama",
                        [
                          { text: "OK", onPress: () => ts.props.navigation.navigate("Menu", {groupid: ts.state.id}) }
                        ],
                        { cancelable: false }
                      );
                }
            )
            // console.log(c)
        }
    }

    SubmitHandler = () => {

        const getOneTimeLocation = () => {
            console.log("this")
            // Geolocation.getCurrentPosition(info => 
            //     console.log(info.coords.latitude));
        }

        const requestLocationPermission = async () => {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  title: 'Location Access Required',
                  message: 'This App needs to Access your location',
                },
            );
              
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //To Check, If Permission is granted
                getOneTimeLocation();
                // subscribeLocationLocation();
              } else {
                // setLocationStatus('Permission Denied');
              }
        }

        requestLocationPermission()
    }

    render() {

        return(
            <View style={styles.headerWrapper}>
                <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = '#0D67B2' translucent={true}/>
                <View style={styles.headerCardContainer}>
                    <View style={styles.groupDetailWrapper}>
                        {this.state.groupDetail.map((item, index) => (
                            <DetailKelompok key={index} idkelompok={item.GroupID} namakelompok={item.GroupName} kodeCabang={this.state.branchID} namaCabang={this.state.namaCabang} />
                        ))}
                    </View>
                </View>

                <ScrollView>
                    <View>{this.AccountFormList()}</View>
                </ScrollView>

                <View style={styles.buttomBarWrapper}>
                <View>
                    <View style={styles.totalSetoranStyle}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>Total Setoran :</Text>
                        <View style={styles.totalCollectStyle}>
                            <CurrencyInput
                                value={this.state.setoran}
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
                                    value={this.state.angsuran}
                                    onChangeValue={(text) => this.setState({totalAngsuran: text})}
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
                                    value={this.state.titipan}
                                    onChangeValue={(text) => this.setState({totalTitipan: text})}
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
                            {/* <TouchableOpacity style={styles.submitButtonContainer} onPress={() => this.buttonSubmit()} > */}
                            <TouchableOpacity style={styles.submitButtonContainer} onPress={() => this.SubmitHandler()} >
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
        height: window.height/5,
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        margin: 10,
      },
})