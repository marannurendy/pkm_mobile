import React from 'react';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, ToastAndroid, StatusBar, TouchableOpacity } from 'react-native';
import { Content, Card, CardItem } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'
// import moment from 'moment';
// import 'moment/locale/id';


import db from '../database/Database';
const window = Dimensions.get('window');

function ListCard(props) {
    return(
        <Content padder>
            <Card>
                <TouchableOpacity onPress={() => props.navigation.navigate("Menu", {groupid: props.groupid, groupname: props.groupname, branchid: props.branchID, username: props.username})}>
                    <CardItem header bordered>
                        <MaterialCommunityIcons name="account-group" color={'black'} size={26} />
                        <View>
                            <Text style={ styles.groupListStyle }>{props.groupid} - {props.groupname}</Text>
                        </View> 
                    </CardItem>
                </TouchableOpacity>
            </Card>
        </Content>
    );
}

export default class Sync extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            groupList: [],
            branchID: '',
            Username: '',
            motherLink: 'http://devapipkm.pnm.co.id:9005/',
            // motherLink: 'http://192.168.43.162:9005/',

            dayfilter: 2,
            data: 1,
            loading: false,
            visible: true,
            kodeCabang: '',
            namaCabang: '',
            userName: '',
            AOname: '',
            datalength: ''
        }

    }

    populateGroupList() {
        db.transaction(
            tx => {
                tx.executeSql("SELECT DISTINCT GroupID, GroupName FROM GroupList WHERE MeetingDay = '"+this.state.dayfilter+"' AND OurBranchID = '"+this.state.branchID+"' AND syncby = '"+this.state.Username+"'", [], (tx, results) => {
                    let dataLength = results.rows.length;

                    // alert(dataLength);
                    let helperArray = [];
                    for(let d = 0; d < dataLength; d++) {
                        helperArray.push(results.rows.item(d));
                    }
                    this.setState({
                        groupList: helperArray,
                    });
                    // alert(dataLength);

                });

            },function(error) {
                        // console.log('Transaction ERROR: ' + error.message);
                        alert('Transaction ERROR: ' + error.message)
                    }, function() {
                        console.log('Populated OK');
                    }
        )
    }

    componentDidMount() {
        // console.log('this '+this.state.kodeCabang)

        AsyncStorage.getItem('userData', (error, result) => {
            const dt = JSON.parse(result);
            this.setState({
                branchID: dt.kodeCabang,
                namaCabang: dt.namaCabang,
                Username: dt.userName,
                AOname: dt.AOname,
            })
        })

        AsyncStorage.getItem('SyncDate', (error, result) => {
            console.log(result)
        })

        this.populateGroupList()

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.populateGroupList()
        })

    }

    onValueChange(value) {
        this.setState({
            dayfilter: value
        }, () => {
            this.populateGroupList()
        });
      }

    filterDay() {
        // var today = moment().format("dddd")
        // console.log(today)
        return(
            <Picker
                selectedValue={this.state.dayfilter}
                style={{height: 35}}
                onValueChange={this.onValueChange.bind(this)}
            >
                <Picker.Item label="Senin" value="2" />
                <Picker.Item label="Selasa" value="3" />
                <Picker.Item label="Rabu" value="4" />
                <Picker.Item label="Kamis" value="5" />
                <Picker.Item label="Jumat" value="6" />
                <Picker.Item label="Sabtu" value="7" />
            </Picker>
        )
    }
    
    render() {  
        // console.log(this.state.dayfilter)
        return(
            <View style={{ flex: 1 }}>
            {/* <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = '#0D67B2' translucent={true}/> */}
                {this.state.loading &&
                  <View style={styles.loading}>
                      <ActivityIndicator size="large" color="#00ff00" />
                  </View>
                }
                <View style={styles.container}>
                    <View style={styles.branchContainer}>
                        <Text style={styles.branchName}>{this.state.branchID} - {this.state.namaCabang}</Text>
                        <Text style={styles.accountName}>{this.state.AOname}</Text>
                        <Text style={styles.accountName}>{this.state.Username}</Text>
                    </View>
                    <View style={styles.containerChild}>
                        <View opacity={0.8} style={styles.pickerStyle}>
                            <View>
                                {this.filterDay()}
                            </View>
                        </View>
                    </View>
                </View>

                <ScrollView>
                {/* <View>
                {this.state.groupList.map((item,index)=>(
                    <ListCard key={index} groupid={item.GroupID} branchID={this.state.branchID} username={this.state.Username} groupname={item.GroupName} navigation={this.props.navigation} />
                ))}        
                </View> */}
                </ScrollView>

            </View>      
            
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 20,
    },
    textStyle: {
        textAlign: 'center',
        fontSize: 40,
    },
    container: {
        backgroundColor: "#0D67B2",
        borderBottomRightRadius: 200,
        borderBottomLeftRadius: 200,
        transform : [ { scaleX : 2 } ],
        width: window.width,
        height: window.width / 1.7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 12,
    },
    containerChild : {
        flex : 1,
        transform : [ { scaleX : 0.5 } ],
        padding: 20,
        justifyContent: 'flex-end',
        marginBottom: 20
    },
    pickerStyle: {
        borderRadius: 15,
        overflow: "hidden",
        height: 39,
        backgroundColor: "#FFF",
    },
    branchName: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold',
    },
    accountName: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
    },
    branchContainer: {
        flex : 1,
        transform : [ { scaleX : 0.5 } ],
        padding: 20,
    },
    groupListStyle: {
        fontSize: 17,
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingRight: 15,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        bottom: 0,
        right: window.width/2.5,
    },
    fabContainer: {
        justifyContent: 'flex-end'
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center"
    },
    loaderHorizontal: {
        flexDirection: "row",
        padding: 10
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
    }
})
