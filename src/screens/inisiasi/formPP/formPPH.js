import React, { useEffect, useState } from 'react';
import { 
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TextInput,
    ActivityIndicator,
    Modal,
    KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Checkbox } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/id';

import db from '../../../database/Database';
import { style } from 'styled-system';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';

const dimension = Dimensions.get('screen');

const InisiasiFormPPH = ({ route }) => {
    const { source } = route.params;
    const navigation = useNavigation();
    const [date, setDate] = useState('');
    const [data, setData] = useState([
        {
            groupName: 'Bogor',
            jumlahNasabah: '10'
        },
        {
            groupName: 'Depok',
            jumlahNasabah: '1'
        },
        {
            groupName: 'Jakarta',
            jumlahNasabah: '4'
        }
    ]);
    const [keyword, setKeyword] = useState('');
    const [fetching, setFetching] = useState(false);
    const [visible, setVisible] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [statusMelakukan, setStatusMelakukan] = useState(false)

    useEffect(() => {
        generateDate();
    }, []);

    const generateDate = () => {
        if (source === '2') return setDate(moment(new Date()).add(1, 'days'));
        if (source === '3') return setDate(moment(new Date()).add(2, 'days'));

        setDate(new Date());
    }

    const renderHeader = () => (
        <ImageBackground source={require("../../../../assets/Image/Banner.png")} style={styles.containerImageBackground} imageStyle={{ borderRadius: 20 }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>BACK</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )

    const renderItem = ({ item }) => (
        <Item data={item} />
    )

    const Item = ({ data }) => (
        <TouchableOpacity 
            style={stylesheet.containerItem} 
            onPress={() => setVisible(true)}
        >
            <View style={{alignItems: 'flex-start'}}>
                <ListMessage groupName={data.groupName} jumlahNasabah={data.jumlahNasabah} />
            </View>
        </TouchableOpacity>
    )

    const ListMessage = ({ groupName, jumlahNasabah }) => {
        return (
            <View style={stylesheet.containerList}>
                <FontAwesome5 name="users" size={32} color="#2e2e2e" />
                <View style={styles.ML16}>
                    <Text numberOfLines={1} style={stylesheet.textList}>{groupName}</Text>
                    <Text>{jumlahNasabah} Orang</Text>
                </View>
            </View>
        )
    }

    const empty = () => (
        <View style={styles.P16}>
            <Text>Data kosong</Text>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <View style={stylesheet.containerProspek}>
                <Text style={stylesheet.textProspek}>Persiapan Pembiayaan {source}</Text>
                <View style={stylesheet.containerSearch}>
                    <FontAwesome5 name="search" size={15} color="#2e2e2e" style={styles.MH8} />
                    <TextInput 
                        placeholder={"Cari Kelompok"}
                        style={
                            {
                                padding: 5,
                                borderBottomLeftRadius: 20,
                                borderBottomRightRadius: 20
                            }
                        }
                        onChangeText={(text) => setKeyword(text)}
                        value={keyword}
                        returnKeyType="done"
                        onSubmitEditing={() => getSosialisasiDatabase()}
                    />
                </View>
                <SafeAreaView style={{flex: 1}}>
                    {fetching === undefined ? (
                        <View style={stylesheet.loading}>
                            <ActivityIndicator size="large" color="#00ff00" />
                        </View>
                    ) : (
                        <View style={stylesheet.containerMain}>
                            <FlatList
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                enabledGestureInteraction={true}
                                renderItem={renderItem}
                                ListEmptyComponent={empty}
                            />
                        </View>
                    )}
                </SafeAreaView>
            </View>
        </View>
    )

    const renderHeaderModal = () => (
        <View
            style={[styles.MB16, styles.FDRow]}
        >
            <Text style={{ flex: 1, fontSize: 18 }}>PP{source} - GANG KELINCI</Text>
            <FontAwesome5 name="times-circle" size={22} color="#2e2e2e" onPress={() => setVisible(!visible)} />
        </View>
    )

    const renderBodyModal = () => (
        <View style={styles.F1}>
            <View>
                <Text>Tanggal PP 1</Text>
                <View style={[styles.P16, styles.MT8, { borderWidth: 1, borderRadius: 6 }]}>
                    <Text>{moment(date).format('LL')}</Text>
                </View>
            </View>
            <View style={[styles.FDRow, { alignItems: 'center', marginLeft: -8 }]}>
                <Checkbox
                    status={statusMelakukan ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setStatusMelakukan(!statusMelakukan);
                    }}
                />
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Melakukan PP{source}</Text>
            </View>
        </View>
    )

    const renderFooterModal = () => (
        <View style={styles.FDRow}>
            <View style={styles.F1} />
            <TouchableOpacity
                onPress={() => alert(JSON.stringify(statusMelakukan))}
            >
                <View style={[styles.buttonSubmitContainer, { padding: 8 }]}>
                    <Text style={styles.buttonSubmitText}>SIMPAN</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderModal = () => (
        <Modal            
            animationType={"fade"}  
            transparent={true}  
            visible={visible}  
            onRequestClose={() =>{ console.log("Modal has been closed.") } }
            KeyboardSpacer
        >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.modalContainer}>  
                    <View style={styles.modalBody}>
                        {renderHeaderModal()}
                        {renderSpace()}
                        {renderBodyModal()}
                        {renderFooterModal()}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )

    const renderSpace = () => (
        <View style={[styles.spaceGray, styles.MB8, { borderWidth: 1, borderColor: 'whitesmoke' }]} />
    )

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
            {renderModal()}
        </View>
    )
}

const stylesheet = StyleSheet.create({
    containerProspek: { 
        ...styles.F1,
        ...styles.MT16,
        ...styles.MH16,
        backgroundColor: colors.PUTIH
    },
    textProspek: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        margin: 16
    },
    containerSearch: { 
        ...styles.FDRow,
        ...styles.MH8,
        ...styles.MT4,
        borderWidth: 1, 
        alignItems: 'center', 
        backgroundColor: colors.PUTIH, 
        borderRadius: 16
    },
    containerMain: { 
        ...styles.MT16,
        justifyContent: 'space-between'
    },
    containerItem: { 
        ...styles.F1,
        ...styles.MH8,
        ...styles.M4,
        borderRadius: 16, 
        backgroundColor: colors.PUTIH, 
        borderWidth: 1, 
    },
    containerList: {
        ...styles.FDRow,
        ...styles.M16,
        width: "85%",
        alignContent: 'center',
        alignItems: 'center'
    },
    textList: {
        ...styles.MB4,
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.HITAM
    }
});

export default InisiasiFormPPH;
