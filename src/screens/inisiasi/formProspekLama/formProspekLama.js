import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, StyleSheet, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import db from '../../../database/Database'
import { Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const withTextInput = dimension.width - (20 * 4) + 8;

const InisiasiFormProspekLama = ({ route }) => {
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [isTahapLanjut, setIsTahapLanjut] = useState(false);
    const [valuePembiayaanTahap, setValuePembiayaanTahap] = useState(null);
    const [itemsPembiayaanTahap, setItemsPembiayaanTahap] = useState([]);

    useEffect(() => {
        getUserData();
        setInfo();
    }, []);

    const getUserData = () => {
        AsyncStorage.getItem('userData', (error, result) => {
            if (error) __DEV__ && console.log('userData error:', error);
            if (__DEV__) console.log('userData response:', result);
        });
    }

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');
        setCurrentDate(tanggal);
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
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: colors.PUTIH }}>PERSETUJUAN KELOMPOK</Text>
                </View>
            </View>
        </ImageBackground>
    )

    const renderInformasiNama = () => (
        <View style={[styles.FDRow, styles.MV4]}>
            <Text style={{ width: 100 }}>Nama</Text>
            <Text> : </Text>
            <Text style={styles.F1}>Bellanissa Zainuddin</Text>
        </View>
    )

    const renderInformasiIdentitas = () => (
        <View style={[styles.FDRow, styles.MV4]}>
            <View style={{ width: 100 }}>
                <Text>No. Identitas</Text>
                <Text style={{ color: 'gray' }}>KTP/KK</Text>
            </View>
            <Text> : </Text>
            <Text style={styles.F1}>356500013560001</Text>
        </View>
    )

    const renderInformasiKelompok = () => (
        <View style={[styles.FDRow, styles.MV4]}>
            <Text style={{ width: 100 }}>Nama</Text>
            <Text> : </Text>
            <Text style={styles.F1}>Gang Kelinci</Text>
        </View>
    )

    const renderFormPembiayaanTahap = () => (
        <View>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Jenis Kartu Identitas (*)</Text>
            <View style={{ borderWidth: 1, borderRadius: 6 }}>
                <Picker
                    selectedValue={valuePembiayaanTahap}
                    style={{ height: 50, width: withTextInput }}
                    onValueChange={(itemValue, itemIndex) => setValuePembiayaanTahap(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsPembiayaanTahap.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderForm = () => (
        <>
            {renderFormPembiayaanTahap()}
        </>
    )

    const renderSpace = () => (
        <View style={stylesheet.greySpace} />
    )

    const renderBody = () => (
        <View style={[styles.bodyContainer, styles.P16]}>
            <Text>Dengan data nasabah sebagai berikut:</Text>
            {renderInformasiNama()}
            {renderInformasiIdentitas()}
            {renderInformasiKelompok()}
            {renderForm()}
        </View>
    )

    return(
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
        </View>
    )
}

const stylesheet = StyleSheet.create({
})

export default InisiasiFormProspekLama;
