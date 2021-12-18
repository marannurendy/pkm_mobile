import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';
import db from '../../../database/Database'
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const withTextInput = dimension.width - (20 * 4) + 8;

const InisiasiFormProspekLama = ({ route }) => {
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [checked, setChecked] = useState('first');
    

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

    const doSubmit = () => {
        if (__DEV__) console.log('doSubmit loaded');
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
            <Text style={{ width: 130 }}>Nama</Text>
            <Text style={styles.MH8}>:</Text>
            <Text style={styles.F1}>Bellanissa Zainuddin</Text>
        </View>
    )

    const renderInformasiIdentitas = () => (
        <View style={[styles.FDRow, styles.MV4]}>
            <View style={{ width: 130 }}>
                <Text>No. Identitas</Text>
                <Text style={{ color: 'gray' }}>KTP/KK</Text>
            </View>
            <Text style={styles.MH8}>:</Text>
            <Text style={styles.F1}>356500013560001</Text>
        </View>
    )

    const renderInformasiKelompok = () => (
        <View style={[styles.FDRow, styles.MV4]}>
            <Text style={{ width: 130 }}>Nama</Text>
            <Text style={styles.MH8}>:</Text>
            <Text style={styles.F1}>Gang Kelinci</Text>
        </View>
    )

    const renderFormPembiayaanTahap = () => (
        <View style={[styles.FDRow, styles.MV4, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Pembiayaan Tahap</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, styles.P8, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Text>2</Text>
            </View>
        </View>
    )

    const renderFormPembiayaanDiajukan = () => (
        <View style={[styles.FDRow, styles.MV4, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Pembiayaan Diajukan</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, styles.P8, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Text>4.000.000</Text>
            </View>
        </View>
    )
    
    const renderFormJangkaWaktuPembiayaanDiajukan = () => (
        <View style={[styles.FDRow, styles.MV4, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Jangka Waktu Pembiayaan Diajukan</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, styles.P8, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Text>25</Text>
            </View>
        </View>
    )

    const renderFormTempatTinggalNasabah = () => (
        <View style={[styles.FDRow, styles.MV4, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Tempat Tinggal Nasabah</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, styles.P8, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Text>Sewa</Text>
            </View>
        </View>
    )

    const renderFormPerubahanStatusPernikahan = () => (
        <View style={[styles.FDRow, styles.MV4, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Perubahan Status Pernikahan</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, styles.P8, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Text>Tidak</Text>
            </View>
        </View>
    )

    const renderFormKeterangan = () => (
        <View style={styles.MT16}>
            <Text>Keterangan :</Text>
            <View style={[styles.MT8, styles.P16, { borderWidth: 1, borderRadius: 6, height: 100, width: 250 }]}>
                <Text>Tidak</Text>
            </View>
        </View>
    )

    const renderForm = () => (
        <View style={[styles.MV16]}>
            {renderFormPembiayaanTahap()}
            {renderFormPembiayaanDiajukan()}
            {renderFormJangkaWaktuPembiayaanDiajukan()}
            {renderFormTempatTinggalNasabah()}
            {renderFormPerubahanStatusPernikahan()}
            {renderFormKeterangan()}
        </View>
    )

    const renderLanjutUK = () => (
        <View style={styles.MT16}>
            <Text>Lanjut UK?</Text>
            <View style={[styles.FDRow, { alignItems: 'center' }]}>
                <RadioButton
                    value="first"
                    status={ checked === 'first' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('first')}
                />
                <Text>Iya</Text>
                <RadioButton
                    value="second"
                    status={ checked === 'second' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('second')}
                />
                <Text>Tidak</Text>
            </View>
        </View>
    )

    const renderButton = () => (
        <TouchableOpacity
            onPress={() => alert('ok')}
        >
            <View
                style={{ backgroundColor: '#3CB371', padding: 16, borderRadius: 8 }}
            >
                <Text style={{ color: 'white', textAlign: 'center' }}>Simpan</Text>
            </View>
        </TouchableOpacity>
    )

    const renderBody = () => (
        <View style={[styles.bodyContainer, styles.P16]}>
            <ScrollView>
                <Text style={styles.MB16}>Dengan data nasabah sebagai berikut:</Text>
                {renderInformasiNama()}
                {renderInformasiIdentitas()}
                {renderInformasiKelompok()}
                {renderForm()}
                {renderLanjutUK()}
            </ScrollView>
            {renderButton()}
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
