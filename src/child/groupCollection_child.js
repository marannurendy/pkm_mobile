import React, { useEffect, useState } from "react";
import { TextInput, View, Text, Dimensions, StyleSheet } from "react-native";
import { RadioButton } from 'react-native-paper'
import CurrencyInput from 'react-native-currency-input'

const dimension = Dimensions.get('screen')

function GroupCollection_Child(props) {
    useEffect(() => {});
    const [item, setItem] = useState(props.item);

    const onChange = (text) => {
        let newValue = text;
        setItem(prevState => {
            let newItem = { ...prevState, ClientName: newValue };

            // sync with [arent array]
            // console.log(newValue)

            props.onChange(props.index, newItem);

            return newItem;
        });
    };

    const attendanceHandler = (text) => {
        let newValue = text;      

        if(text === "4" || text === "3") {
            setItem(prevState => {
                let newItem = { ...prevState, attendStatus: newValue, InstallmentAmount: "0", titipan: "0", tarikan: "0", totalSetor: "0" };
    
                // sync with [arent array]
                // console.log(newValue)
    
                props.onChange(props.index, newItem);
    
                return newItem;
            });
        }else{
            if(item.InstallmentAmount === "0" && item.titipan === "0" && item.tarikan === "0" && item.totalSetor === "0") {
                setItem(prevState => {
                    let newItem = { ...prevState, attendStatus: newValue, InstallmentAmount: item.angsuran, totalSetor: item.angsuran };
        
                    // sync with [arent array]
                    // console.log(newValue)
        
                    props.onChange(props.index, newItem);
        
                    return newItem;
                });
            }else{
                setItem(prevState => {
                    let newItem = { ...prevState, attendStatus: newValue };
        
                    // sync with [arent array]
                    // console.log(newValue)
        
                    props.onChange(props.index, newItem);
        
                    return newItem;
                });
            }
        }
        
        setItem(prevState => {
            let newItem = { ...prevState, attendStatus: newValue };

            // sync with [arent array]
            // console.log(newValue)

            props.onChange(props.index, newItem);

            return newItem;
        });
    };

    const angsuranHandler = (text) => {
        let newValue = text;
        let Total = text + item.titipan - item.tarikan
        setItem(prevState => {
            let newItem = { ...prevState, InstallmentAmount: newValue, totalSetor: Total };

            // sync with [arent array]
            // console.log(newValue)

            props.onChange(props.index, newItem);
            // totalHandler()

            return newItem;
        });
    };

    const setoranHandler = (text) => {
        let newValue = text;
        let Total = Number(item.InstallmentAmount) + text - item.tarikan
        console.log('ini ' + Total)
        setItem(prevState => {
            let newItem = { ...prevState, titipan: newValue, totalSetor: Total };

            // sync with [arent array]
            // console.log(newValue)

            props.onChange(props.index, newItem);

            return newItem;
        });
    };

    const tarikanHandler = (text) => {
        let newValue = text;
        let Total = Number(item.InstallmentAmount) + item.titipan - text
        setItem(prevState => {
            let newItem = { ...prevState, tarikan: newValue, totalSetor: Total };

            // sync with [arent array]
            // console.log(newValue)

            props.onChange(props.index, newItem);

            return newItem;
        });
    };

    return (
        <View style={styles.container}>
            <View style={{ margin: 20 }}>

                {/* <TextInput style={{ borderWidth: 1, margin: 5, padding: 5 }} value={item.ClientName} onChangeText={(text) => onChange(text)} /> */}
                <View style={styles.headerCardStat}>
                    <Text numberOfLines={2} style={{fontWeight: 'bold', fontSize: 18, marginBottom: 5, color: '#FAFAF8'}} >{item.ClientName}</Text>
                    <Text style={{fontWeight: 'bold', fontSize: 15, marginBottom: 5, color: '#FAFAF8'}} >{item.ClientID}</Text>
                </View>

                <View style={{marginTop: 10}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{marginHorizontal: 10, width: dimension.width/4}}>Product ID</Text>
                        <Text style={{marginHorizontal: 5}}>:</Text>
                        <Text>{item.ProductID}</Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={{marginHorizontal: 10, width: dimension.width/4}}>Angsuran Ke</Text>
                        <Text style={{marginHorizontal: 5}}>:</Text>
                        <Text>{item.ke}</Text>
                    </View>
                </View>

                    <View style={{borderBottomWidth: 1, marginVertical: 10}} />

                <View>
                    <Text style={{fontWeight: 'bold', fontSize: 15}}>Kehadiran Nasabah</Text>
                    <View>
                        <View style={styles.RadioStyle}>
                            <RadioButton 
                                value= "1"
                                status={ item.attendStatus === '1' ? 'checked' : 'unchecked'}
                                onPress={() => attendanceHandler('1')} 
                            />
                            <Text>1. Hadir, Bayar</Text>
                        </View>
                        <View style={styles.RadioStyle}>
                            <RadioButton 
                                value= "2"
                                status={ item.attendStatus === '2' ? 'checked' : 'unchecked'}
                                onPress={() => attendanceHandler('2')} 
                            />
                            <Text>2. Tidak Hadir, Bayar</Text>
                        </View>
                        <View style={styles.RadioStyle}>
                            <RadioButton 
                                value= "3"
                                status={ item.attendStatus === '3' ? 'checked' : 'unchecked'}
                                onPress={() => attendanceHandler('3')} 
                            />
                            <Text>3. Hadir, Tidak Bayar</Text>
                        </View>
                        <View style={styles.RadioStyle}>
                            <RadioButton 
                                value= "4"
                                status={ item.attendStatus === '4' ? 'checked' : 'unchecked'}
                                onPress={() => attendanceHandler('4')} 
                            />
                            <Text>4. Tidak Hadir, Tidak Bayar</Text>
                        </View>
                        <View style={styles.RadioStyle}>
                            <RadioButton 
                                value= "5"
                                status={ item.attendStatus === '5' ? 'checked' : 'unchecked'}
                                onPress={() => attendanceHandler('5')} 
                            />
                            <Text>5. Hadir, Tanggung Renteng</Text>
                        </View>
                        <View style={styles.RadioStyle}>
                            <RadioButton
                                value= "6"
                                status={ item.attendStatus === '6' ? 'checked' : 'unchecked'}
                                onPress={() => attendanceHandler('6')} 
                            />
                            <Text>6. Tidak Hadir, Tanggung Renteng</Text>
                        </View>
                    </View>
                </View>

                <View style={{borderBottomWidth: 1, marginVertical: 10}} />

                <View>
                    <Text style={styles.Detailtitle}>Pembayaran*</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{fontSize: 16, flex: 3, fontWeight: 'bold'}}>Angsuran</Text>
                        <View style={{ borderWidth: 1, flex: 2, paddingLeft: 5, borderRadius: 10 }} >
                            <CurrencyInput
                            // onChangeText
                                // onBlur={(val) => angsuranHandler(val, index)}
                                onChangeValue={(val) => angsuranHandler(val)}
                                value={item.attendStatus == '3' ? 0 : item.attendStatus == '4' ? 0 : item.InstallmentAmount}
                                defaultValue={"1"}
                                prefix="Rp "
                                delimiter=","
                                separator="."
                                precision={0}
                                editable={item.attendStatus == '3' ? false : item.attendStatus == '4' ? false : true}
                                style={{ fontSize: 15 }}
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
                                value={item.VolSavingsBal}
                                prefix="Rp "
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
                    <Text style={{ fontSize: 16, paddingTop: 20, fontWeight: 'bold' }}>Titipan</Text>
                    <View style={{flex: 1}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 }}>
                            <Text style={{ flex: 3, marginLeft: 20 }}>Setoran</Text>
                            <View style={{ borderWidth: 1, paddingLeft: 5, borderRadius: 10, flex: 2 }}>
                                <CurrencyInput
                                    onChangeValue={(text) => setoranHandler(text)}
                                    value={item.attendStatus == '4' ? 0 : item.titipan}
                                    prefix="Rp "
                                    delimiter=","
                                    separator="."
                                    precision={0}
                                    editable={item.attendStatus == '4' ? false : true}
                                    // onChangeText={this.Hitung(this.state.angsuran[idx])}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 }}>    
                            <Text style={{ flex: 3, marginLeft: 20 }}>Tarikan</Text>
                            <View style={{ borderWidth: 1, paddingLeft: 5, borderRadius: 10, flex: 2 }}>
                                <CurrencyInput
                                    onChangeValue={(text) => tarikanHandler(text)}
                                    value={item.attendStatus == '4' ? 0 : item.tarikan}
                                    prefix="Rp "
                                    delimiter=","
                                    separator="."
                                    maxValue={item.VolSavingsBal}
                                    precision={0}
                                    editable={item.attendStatus == '4' ? false : true}
                                    // onChangeText={this.Hitung(this.state.angsuran[idx])}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <View style={styles.deviderStyle} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20 }}>
                        <Text style={{ fontSize: 16, flex: 3, fontWeight: 'bold' }}>Jumlah Setor</Text>
                        <View style={{ borderWidth: 1, paddingLeft: 5, borderRadius: 10, flex: 2 }}>
                            <CurrencyInput
                                // onChangeValue={(text) => this.handleChangeInput(text, idx, dt.AccountID, 'total')}
                                value={item.attendStatus == '4' ? 0 : item.totalSetor}
                                prefix="Rp "
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

            </View>
        </View>
    );
}

export default GroupCollection_Child

const styles = StyleSheet.create({
    container : {
        marginVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FFF'
    },
    headerCardStat : {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius:20,
        backgroundColor: '#0E71C4'
    },
    RadioStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    deviderStyle: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: dimension.width/1.5,
        padding: 10,
    },
})
