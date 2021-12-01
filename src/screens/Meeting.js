import React from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, ScrollView, ToastAndroid, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { SearchBar, Card } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RadioButton } from 'react-native-paper';
import CurrencyInput from 'react-native-currency-input';
import update from 'react-addons-update';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'moment/locale/id';

import db from '../database/Database';

const window = Dimensions.get('window');

function AccountDetail(props) {
    return(
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="account-multiple" color='black' size={30} />
            <View style={{ width: window.width/1.4, flexDirection: 'column', paddingLeft: 20 }}>
                <Text style={{ fontSize: 15 }}>{props.accountid}</Text>
                <Text style={{ fontSize: 15 }}>{props.accountname}</Text>
            </View> 
        </View>
    )
}

function DetailMeeting(props) {

    moment.locale('id');
    var hariIni = moment().format('LLLL')

    return(
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="account-multiple" color='black' size={25} />
                <Text style={{ paddingLeft: 20,fontSize: 17 }}>{props.groupid} - {props.groupname}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="calendar-multiselect" color='black' size={25} />
                <Text style={{ paddingLeft: 20, fontSize: 17 }}>{hariIni}</Text>
            </View>
        </View>
    )
}

function DetailProduct(props) {
    return(
        <View style={{ paddingBottom: 15 }}>
            <View style={{ flexDirection: 'row', paddingBottom: 8 }}>
                <Text>Nama Product : {props.productname}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text>Angsuran Ke : {props.ke}</Text>
            </View>
            
        </View>
    )
}

export default class Meeting extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            search: '',
            profit: '',
            value: [],
            Angsuran: [],
            TotalTitipan: [],
            totalAngsuran: '',
            totalTitipan: '',
            totalCollect: '',
            test: '',
            group: props.route.params.group,
            id: props.route.params.id,
            accountList: [],
            masteraccountList: [],
            groupDetail: [],
            attendance: [],
            dataHeader: '',
            groupID: '',
            groupName: '',
            meetingDay: '',
            meetingTime: '',
            editable: true,
            testArray: [],
            submitStatus: false,
            loading: false
        }
    }

    attendanceHandler(text, id, accountID) {
        
        // console.log('cari ' + this.state.search)
        var listAkun = this.state.masteraccountList.length
        // console.log(listAkun)

        var arrayHelp = []
        for(let a = 0; a < listAkun; a++) {
            arrayHelp.push(this.state.masteraccountList[a].AccountID)
        }

        var indexTarget = arrayHelp.indexOf(accountID)

        if(text == 3 || text == 4){
            this.setState(update(this.state, {
                Angsuran: {
                    [indexTarget]: {
                        attendance: {
                            $set: text
                        },
                        angsuran: {
                            $set: 0
                        },
                        setoran: {
                            $set: 0
                        },
                        tarikan: {
                            $set: 0
                        },
                        totalSetor: {
                            $set: 0
                        }

                    }
                }
            }))
        }else{
            this.setState(update(this.state, {
                Angsuran: {
                    [indexTarget]: {
                        attendance: {
                            $set: text
                        }
                    }
                }
            }))
        }

        // console.log(this.state.Asuransi)
    }

    AttendanceList(idx, accountID) {

        // console.log(this.state.masteraccountList.map)
        var listAkun = this.state.masteraccountList.length
        // console.log(listAkun)

        var arrayHelp = []
        for(let a = 0; a < listAkun; a++) {
            arrayHelp.push(this.state.masteraccountList[a].AccountID)
        }

        var indexTarget = arrayHelp.indexOf(accountID)

        return(
            <View>
                <View style={styles.RadioStyle}>
                    <RadioButton 
                    value= "1"
                    status={ this.state.Angsuran[indexTarget].attendance === '1' ? 'checked' : 'unchecked'}
                    onPress={() => this.attendanceHandler('1', idx, accountID)} />
                    <Text>1. Hadir, Bayar</Text>
                </View>
                <View style={styles.RadioStyle}>
                    <RadioButton 
                    value= "2"
                    status={ this.state.Angsuran[indexTarget].attendance === '2' ? 'checked' : 'unchecked'}
                    onPress={() => this.attendanceHandler('2', idx, accountID)} />
                    <Text>2. Tidak Hadir, Bayar</Text>
                </View>
                <View style={styles.RadioStyle}>
                    <RadioButton 
                    value= "3"
                    status={ this.state.Angsuran[indexTarget].attendance === '3' ? 'checked' : 'unchecked'}
                    onPress={() => this.attendanceHandler('3', idx, accountID)} />
                    <Text>3. Hadir, Tidak Bayar</Text>
                </View>
                <View style={styles.RadioStyle}>
                    <RadioButton 
                    value= "4"
                    status={ this.state.Angsuran[indexTarget].attendance === '4' ? 'checked' : 'unchecked'}
                    onPress={() => this.attendanceHandler('4', idx, accountID)} />
                    <Text>4. Tidak Hadir, Tidak Bayar</Text>
                </View>
                <View style={styles.RadioStyle}>
                    <RadioButton 
                    value= "5"
                    status={ this.state.Angsuran[indexTarget].attendance === '5' ? 'checked' : 'unchecked'}
                    onPress={() => this.attendanceHandler('5', idx, accountID)} />
                    <Text>5. Hadir, Tanggung Renteng</Text>
                </View>
                <View style={styles.RadioStyle}>
                    <RadioButton
                    value= "6"
                    status={ this.state.Angsuran[indexTarget].attendance === '6' ? 'checked' : 'unchecked'}
                    onPress={() => this.attendanceHandler('6', idx, accountID)} />
                    <Text>6. Tidak Hadir, Tanggung Renteng</Text>
                </View>
                
                
            </View>
        )
    }

    componentDidUpdate() {
        // console.log(this.state.Angsuran)
        let lengthData = this.state.Angsuran.length
        let totalangsuran = []
        let totaltitipan = []
        let totalsetoran = []
        for(let d = 0; d < lengthData; d++) {
            // console.log(this.state.Angsuran[d].angsuran)
            let datatotalAngsuran = this.state.Angsuran[d].angsuran
            let datatotalTitipan = this.state.Angsuran[d].setoran
            let datatotalSetoran = this.state.Angsuran[d].totalSetor
            totaltitipan.push(datatotalTitipan)
            totalangsuran.push(datatotalAngsuran)
            totalsetoran.push(datatotalSetoran)
        }
        
        var total = totalangsuran.reduce((prev, cur, index)=>Number(prev)+Number(cur), 0);
        var totalTitip = totaltitipan.reduce((prev, cur, index)=>Number(prev)+Number(cur), 0);
        var totalSetor = totalsetoran.reduce((prev, cur, index)=>Number(prev)+Number(cur), 0);
        
        if(this.state.totalAngsuran != total) {
            this.setState({
                totalAngsuran:total
            })
        }if(this.state.totalCollect != totalSetor){
            this.setState({
                totalCollect:totalSetor
            })
        }if(this.state.totalTitipan != totalTitip){
            this.setState({
                totalTitipan:totalTitip
            })
        }
    }

    async FetchData() {
        moment.locale('id');
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        var ts = this

        var statuspkm = "SELECT * FROM Totalpkm WHERE GroupID = " + "'" + this.state.id + "'" + " AND trxdate = " + "'" + tanggal + "'"
        var statuspkmFix = "SELECT * FROM Totalpkm WHERE GroupID = " + "'" + this.state.id + "'" + " AND trxdate = " + "'" + tanggal + "'" + "AND TtdKetuaKelompok IS NOT NULL"
        var query = 'SELECT DISTINCT * FROM AccountList WHERE GroupID = ';
        query = query + "'" + this.state.id + "'";
        console.log("fetch data sukses");

        db.transaction(
            tx => {
                ts.setState({
                    loading: true
                })
                tx.executeSql(query, [], (tx, results) => {
                    let queryLength = results.rows.length

                    console.log(queryLength)

                    if(queryLength == 0){
                        this.setState({
                            submitStatus : true
                        })
                    }
                },function(error) {
                    ToastAndroid.show("Something Went Wrong : " +  error.message, ToastAndroid.SHORT);
                    // console.log('Transaction ERROR: ' + error.message);
                },function(){
                    ts.setState({
                        loading: false
                    })
                })
                tx.executeSql(statuspkmFix, [], (tx, results) => {
                    let statusFixLength = results.rows.length

                    if(statusFixLength != 0) {
                        this.setState({
                            submitStatus : true
                        })
                    }
                },function(error) {
                    ToastAndroid.show("Something Went Wrong : " +  error.message, ToastAndroid.SHORT);
                    // console.log('Transaction ERROR: ' + error.message);
                },function(){
                    ts.setState({
                        loading: false
                    })
                })
                tx.executeSql(statuspkm, [], (tx, results) => {
                    let statusLength = results.rows.length

                    console.log("this " + statusLength)

                    if(statusLength != 0) {
                        // console.log('berhasil')
                        // this.setState({
                        //     submitStatus : true
                        // })

                        var queryAfterPKM = 'SELECT * FROM pkmTransaction WHERE GroupID = ';
                        queryAfterPKM = queryAfterPKM + this.state.id;

                        db.transaction(
                            tx.executeSql(queryAfterPKM, [], (tx, results) => {
                                let dataLength = results.rows.length;

                                var Arrayafter = [];
                                var rowAfter = [];
                                var titipAfter = [];
                                for(let d = 0; d < dataLength; d++) {
                                    let data = results.rows.item(d);
                                    Arrayafter.push(results.rows.item(d));
                                    rowAfter.push({'GroupID': data.GroupID,'meetingday': data.MeetingDay, 'clientID': data.ClientID, 'clientname': data.ClientName, 'accountid': data.AccountID, 'attendance': data.Attendance, 'angsuran': data.Angsuran, 'setoran': data.Setoran, 'tarikan': data.Tarikan, 'titipan':data.Titipan, 'productname': data.ProductID, 'totalSetor': data.TotalSetor, 'ke': data.ke})
                                    titipAfter.push(data.Titipan);
                                }

                                // console.log(Arrayafter)

                                this.setState({
                                    masteraccountList: Arrayafter,
                                    Angsuran: rowAfter,
                                    TotalTitipan: titipAfter,
                                    dataHeader: Arrayafter.length,
                                }, () => {
                                    this.setState({
                                        accountList: this.state.masteraccountList,
                                    })
                                })

                                // console.log(Arrayafter)
                            },function(error) {
                                ToastAndroid.show("Something Went Wrong : " +  error.message, ToastAndroid.SHORT);
                                // console.log('Transaction ERROR: ' + error.message);
                            },function(){
                                ts.setState({
                                    loading: false
                                })
                            })
                        )

                    }else{

                        db.transaction(
                            tx.executeSql(query, [], (tx, results) => {
                                let dataLength = results.rows.length;

                                console.log("sukses " + dataLength)
            
                                var helperArray = [];
                                var row = [];
                                var titip = [];
                                for(let d = 0; d < dataLength; d++) {
                                    let data = results.rows.item(d);
                                    helperArray.push(results.rows.item(d));
                                    row.push({'GroupID': data.GroupID,'meetingday': data.MeetingDay, 'clientID': data.ClientID, 'clientname': data.ClientName, 'accountid': data.AccountID,'attendance': '', 'angsuran': data.InstallmentAmount, 'setoran': '', 'tarikan': '0', 'titipan':data.VolSavingsBal, 'productname': data.ProductID, 'totalSetor': data.InstallmentAmount, 'ke': data.ke})
                                    titip.push(data.VolSavingsBal);
                                }
            
                                
                                console.log("row data " + row)
                                
                                this.setState({
                                    masteraccountList: helperArray,
                                    Angsuran: row,
                                    TotalTitipan: titip,
                                    dataHeader: helperArray.length,
                                }, () => {
                                    this.setState({
                                        accountList: this.state.masteraccountList,
                                    })
                                })
                            },function(error) {
                                ToastAndroid.show("Something Went Wrong : " +  error.message, ToastAndroid.SHORT);
                                // console.log('Transaction ERROR: ' + error.message);
                            },function(){
                                ts.setState({
                                    loading: false
                                })
                            })
                        )
                        
                    }
                },function(error) {
                    ToastAndroid.show("Something Went Wrong : " +  error.message, ToastAndroid.SHORT);
                    // console.log('Transaction ERROR: ' + error.message);
                },function(){
                    ts.setState({
                        loading: false
                    })
                })  
            },function(error) {
                ToastAndroid.show("Something Went Wrong : " +  error.message, ToastAndroid.SHORT);
                // console.log('Transaction ERROR: ' + error.message);
            },function(){
                ts.setState({
                    loading: false
                })
                console.log("test " + ts.state.accountList)
            }
        )
    }

    componentDidMount() {
        // this.FetchData()
        // console.log("this ==> did mount sukses")

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.FetchData()
            console.log("this ==> did mount sukses")
        })
    }
    
    handleChangeInput(text, id, what) {
        // console.log('tarikan '+this.state.tarikan[id])
        let SetoranBaru = this.state.setoran.slice() //copy the array
        let jumlahSetor = this.state.total.slice() //copy the array
        let jumlahTarik = this.state.tarikan.slice()
        let sum = ''
        // console.log(text,)
        if(what == 'setoran') {
            SetoranBaru[id] = Number(text)
            // console.log(SetoranBaru[id])
            this.setState({ setoran: SetoranBaru }, () => {
                let num = (this.state.tarikan[id] == undefined) ? 0 : this.state.tarikan[id]
                sum = (this.state.setoran[id]) + (this.state.Angsuran[id]) - (num)
                jumlahSetor[id] = Number(sum)
                // console.log(SetoranBaru[id])
                this.setState({ total: jumlahSetor })
            })
        }else if(what == 'tarikan') {
            jumlahTarik[id] = Number(text)
            // console.log(SetoranBaru[id])
            this.setState({ tarikan: jumlahTarik }, () => {
                let num = (this.state.setoran[id] == undefined) ? 0 : this.state.setoran[id]
                sum = (num) + (this.state.Angsuran[id]) - (this.state.tarikan[id])
                jumlahSetor[id] = Number(sum)
                // console.log(SetoranBaru[id])
                this.setState({ total: jumlahSetor })
            })
        }
    

        // console.log(this.state.setoran)
        // var sum = (this.state.setoran[id]) + (this.state.Angsuran[id])
        // console.log('this '+sum)
        
    }

    handleChange(text, id, AccountID, what) {

        var listAkun = this.state.masteraccountList.length
        // console.log(listAkun)

        var arrayHelp = []
        for(let a = 0; a < listAkun; a++) {
            arrayHelp.push(this.state.masteraccountList[a].AccountID)
        }

        var indexTarget = arrayHelp.indexOf(AccountID)

        if(what == 'angsuran') {
            this.setState(update(this.state, {
            Angsuran: {
              [indexTarget]: {
                angsuran: {
                    $set: text
                } 
              }
            }
          }), () => {
              let a = (this.state.Angsuran[indexTarget].angsuran == undefined) ? 0 : this.state.Angsuran[indexTarget].angsuran
              let b = (this.state.Angsuran[indexTarget].setoran == undefined) ? 0 : this.state.Angsuran[indexTarget].setoran
              let c = (this.state.Angsuran[indexTarget].tarikan == undefined) ? 0 : this.state.Angsuran[indexTarget].tarikan
              
              let jumlahSetor = Number(a) + Number(b) - Number(c)

              this.setState(update(this.state, {
                  Angsuran: {
                      [indexTarget]: {
                          totalSetor: {
                              $set: jumlahSetor
                          }
                      }
                  }
              }))
          })

        }else if(what == 'setoran') {
            
            this.setState(update(this.state, {
                Angsuran: {
                  [indexTarget]: {
                    setoran: {
                        $set: text
                    } 
                  }
                }
              }), () => {
                let a = (this.state.Angsuran[indexTarget].angsuran == undefined) ? 0 : this.state.Angsuran[indexTarget].angsuran
                let b = (this.state.Angsuran[indexTarget].setoran == undefined) ? 0 : this.state.Angsuran[indexTarget].setoran
                let c = (this.state.Angsuran[indexTarget].tarikan == undefined) ? 0 : this.state.Angsuran[indexTarget].tarikan
                
                let jumlahSetor = Number(a) + Number(b) - Number(c)
  
                this.setState(update(this.state, {
                    Angsuran: {
                        [indexTarget]: {
                            totalSetor: {
                                $set: jumlahSetor
                            }
                        }
                    }
                }))
            });
        }else if(what == 'tarikan') {
            this.setState(update(this.state, {
                Angsuran: {
                  [indexTarget]: {
                    tarikan: {
                        $set: text
                    } 
                  }
                }
              }), () => {
                let a = (this.state.Angsuran[indexTarget].angsuran == undefined) ? 0 : this.state.Angsuran[indexTarget].angsuran
                let b = (this.state.Angsuran[indexTarget].setoran == undefined) ? 0 : this.state.Angsuran[indexTarget].setoran
                let c = (this.state.Angsuran[indexTarget].tarikan == undefined) ? 0 : this.state.Angsuran[indexTarget].tarikan
                
                let jumlahSetor = Number(a) + Number(b) - Number(c)
  
                this.setState(update(this.state, {
                    Angsuran: {
                        [indexTarget]: {
                            totalSetor: {
                                $set: jumlahSetor
                            }
                        }
                    }
                }))
            });
        }
    }

    AccountFormList(dt, idx) {

        var AccountID = dt.AccountID

        var listAkun = this.state.masteraccountList.length
        console.log(listAkun)

        var arrayHelp = []
        for(let a = 0; a < listAkun; a++) {
            arrayHelp.push(this.state.masteraccountList[a].AccountID)
        }

        var indexTarget = arrayHelp.indexOf(AccountID)

        //console.log(dt)

        // console.log(dt)
        
            return(
                <View key={idx}>
                <Card key={idx} containerStyle={{}} wrapperStyle={{}}>
                    <Card.Title>
                        <View style={styles.accountContainer}>
                            <AccountDetail accountid = {dt.ClientID} accountname = {dt.ClientName} />
                        </View>
                    </Card.Title>
                    <Card.Divider />
                        <View>
                            <DetailProduct ke={dt.ke} productname={dt.ProductID} />
                        </View>
                    <Card.Divider />
                        <View
                            style={{
                            position: "relative"
                            }}
                        >
                            <Text style={styles.Detailtitle}>Kehadiran Nasabah*</Text>
                            <View>
                                {this.AttendanceList(idx, dt.AccountID)}
                            </View>
                        </View>
                    <Card.Divider />
                        <View key={idx}>
                            <Text style={styles.Detailtitle}>Pembayaran*</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.paymentStyle}>Angsuran</Text>
                                <View style={styles.currencyInput}>
                                    <CurrencyInput
                                        onChangeValue={(text) => this.handleChange(text, idx, dt.AccountID, 'angsuran')}
                                        value={this.state.Angsuran[indexTarget].attendance == '3' ? 0 : this.state.Angsuran[indexTarget].attendance == '4' ? 0 : this.state.Angsuran[indexTarget].angsuran}
                                        unit="Rp "
                                        delimiter=","
                                        separator="."
                                        precision={0}
                                        editable={this.state.Angsuran[indexTarget].attendance == '3' ? false : this.state.Angsuran[indexTarget].attendance == '4' ? false : true}
                                        // onChangeText={this.Hitung(this.state.angsuran[idx])}
                                    />
                                </View>
                            </View>
    
                            <View style={{ alignItems: 'flex-end' }}>
                                <View style={styles.deviderStyle} />
                            </View>

                            <View> 

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <Text>Saldo Titipan Saat ini : </Text>
                                    <CurrencyInput
                                        value={dt.VolSavingsBal == undefined ? dt.Titipan : dt.VolSavingsBal}
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
    
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 20 }}>
                                <Text style={styles.paymentStyle}>Titipan</Text>
                                <View style={{ flexDirection: 'column' }}>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ paddingBottom: 5 }}>Setoran</Text>
                                        <View style={styles.currencyInput}>
                                            <CurrencyInput
                                                onChangeValue={(text) => this.handleChange(text, idx, dt.AccountID, 'setoran')}
                                                value={this.state.Angsuran[indexTarget].attendance == '4' ? 0 : this.state.Angsuran[indexTarget].setoran}
                                                unit="Rp "
                                                delimiter=","
                                                separator="."
                                                precision={0}
                                                editable={this.state.Angsuran[indexTarget].attendance == '4' ? false : true}
                                                // onChangeText={this.Hitung(this.state.angsuran[idx])}
                                            />
                                        </View>
                                    </View>
    
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ paddingBottom: 5 }}>Tarikan</Text>
                                        <View style={styles.currencyInput}>
                                            <CurrencyInput
                                                onChangeValue={(text) => this.handleChange(text, idx, dt.AccountID, 'tarikan')}
                                                value={this.state.Angsuran[indexTarget].attendance == '4' ? 0 : this.state.Angsuran[indexTarget].tarikan}
                                                unit="Rp "
                                                delimiter=","
                                                separator="."
                                                maxValue={this.state.TotalTitipan[indexTarget]}
                                                precision={0}
                                                editable={this.state.Angsuran[indexTarget].attendance == '4' ? false : true}
                                                // onChangeText={this.Hitung(this.state.angsuran[idx])}
                                            />
                                        </View>
                                    </View>   
                                </View>
                            </View>
    
                            <View style={{ alignItems: 'flex-end' }}>
                                <View style={styles.deviderStyle} />
                            </View>
    
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20 }}>
                                <Text style={styles.paymentStyle}>Jumlah Setor</Text>
                                    <View style={styles.totalDepoStyle}>
                                        <CurrencyInput
                                            onChangeValue={(text) => this.handleChangeInput(text, idx, dt.AccountID, 'total')}
                                            value={this.state.Angsuran[indexTarget].attendance == '4' ? 0 : this.state.Angsuran[indexTarget].totalSetor}
                                            unit="Rp "
                                            delimiter=","
                                            separator="."
                                            precision={0}
                                            editable= {false}
                                            style={{
                                                color: 'black'
                                            }}
                                        />
                                    </View>
                            </View>
    
                        </View>
                </Card>
            </View>
            )
        }

    

    async SubmitHandler() {

        moment.locale('id');
        const tanggal = await AsyncStorage.getItem('TransactionDate')

        console.log(tanggal)

        var ts = this
        
        var dataAngsuran = this.state.Angsuran
        var angsuranLength = this.state.Angsuran.length

        for(let d = 0; d < angsuranLength; d++) {
            if(this.state.Angsuran[d].attendance.length < 1) {
                alert(this.state.Angsuran[d].clientname+' BELUM ABSEN')

                return false
            }
        }

        db.transaction(
            tx => {
                tx.executeSql("DELETE FROM pkmTransaction")
                tx.executeSql("DELETE FROM Totalpkm")
            }
        )


        var submitQuery = 'INSERT INTO pkmTransaction (GroupID, AccountID, Angsuran, Attendance, ClientID, ClientName, MeetingDay, ProductID, Setoran, Tarikan, Titipan, ke, TotalSetor) values '
        for (let a = 0; a < angsuranLength; a++) {
            submitQuery = submitQuery + "('"
            + dataAngsuran[a].GroupID
            + "','"
            + dataAngsuran[a].accountid
            + "','"
            + Number(dataAngsuran[a].angsuran)
            + "','"
            + dataAngsuran[a].attendance
            + "','"
            + dataAngsuran[a].clientID
            + "','"
            + dataAngsuran[a].clientname
            + "','"
            + dataAngsuran[a].meetingday
            + "','"
            + dataAngsuran[a].productname
            + "','"
            + Number(dataAngsuran[a].setoran)
            + "','"
            + Number(dataAngsuran[a].tarikan)
            + "','"
            + Number(dataAngsuran[a].titipan)
            + "','"
            + Number(dataAngsuran[a].ke)
            + "','"
            + Number(dataAngsuran[a].totalSetor)
            + "')";

            if (a != angsuranLength - 1) {
                submitQuery = submitQuery + ", ";
            }
        }

        // console.log(submitQuery);
        submitQuery = submitQuery + ';';
        db.transaction(
            tx => {
                tx.executeSql(submitQuery)
            },function(error) {
                console.log('Transaction ERROR: ' + error.message);
            }
        )

        var submitTotal = 'INSERT INTO Totalpkm (GroupID, MeetingDay, TotalSetoran, TotalAngsuran, TotalTitipan, trxdate) values '
        submitTotal = submitTotal + "('" + this.state.id + "', '" + this.state.Angsuran[0].meetingday + "', '" + this.state.totalCollect + "', '" + this.state.totalAngsuran + "', '" + this.state.totalTitipan + "', '" + tanggal + "')" + ";"
        db.transaction(
            tx => {
                tx.executeSql(submitTotal)
            },function(error) {
                console.log('Transaction ERROR: ' + error.message);
            },function() {
                Alert.alert(
                    "Sukses",
                    "PKM Berhasil Dilakukan",
                    [
                      { text: "OK", onPress: () => ts.props.navigation.navigate("Menu", {groupid: ts.state.id}) }
                    ],
                    { cancelable: false }
                  );
            }
        )
        
    }

    updateSearch = (text) => {
        // this.setSearch({ search });
        //  console.log(text)
        if (text) {
            // console.log('fuck')
            this.setState({
                accountList: this.state.masteraccountList,
                search: text
            }, () => {
                const newData = this.state.accountList.filter(function (item) {
                    const itemData = item.ClientName
                      ? item.ClientName.toUpperCase()
                      : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                })

                this.setState({
                    accountList: newData,
                    search: text
                }) 
            })

            
            // console.log(newData)
           
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            this.setState({
                accountList: this.state.masteraccountList,
                search: text
            })
        }
    };


    render() {

        const { search } = this.state;

        return(
            <View style={styles.headerWrapper}>
                <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = '#0D67B2' translucent={true}/>
                <View style={styles.headerCardContainer}>
                    <View style={styles.groupDetailWrapper}>
                        <View>
                            <DetailMeeting groupid={this.state.id} groupname={this.state.group} />
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
                    {this.state.accountList.map((item, index) => (
                        <View key={index}>
                            {this.AccountFormList(item, index)}
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.buttomBarWrapper}>
                    <View>
                    <View style={styles.totalSetoranStyle}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>Total Setoran :</Text>
                        <View style={styles.totalCollectStyle}>
                            <CurrencyInput
                                value={this.state.totalCollect}
                                onChangeValue={(text) => this.setState({totalCollect: text})}
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
                                        value={this.state.totalAngsuran}
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
                                    value={this.state.totalTitipan}
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
                            <TouchableOpacity 
                                disabled={this.state.submitStatus} 
                                style={{
                                    elevation: 8,
                                    borderRadius: 5,
                                    backgroundColor: this.state.submitStatus == false ? "#28b358" : "#E6E6E6",
                                    height: window.height/20,
                                    width: window.width/3.7,
                                    justifyContent: 'center'
                                }} 
                                onPress={() => this.SubmitHandler()} 
                            >
                                <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold' }}>SUBMIT</Text>

                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    
                </View>

                {this.state.loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                } 

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
        height: window.height/13,
        width: window.width/1.2,
        paddingLeft: 10,
        padding: 0,
        justifyContent: 'center',
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