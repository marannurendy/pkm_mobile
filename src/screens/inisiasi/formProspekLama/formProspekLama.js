import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, StyleSheet, TextInput, ScrollView, Image, Button } from 'react-native';
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
const pilihanYaTidak = [{ label: 'Ya', value: '1' }, { label: 'Tidak', value: '0' }];

const InisiasiFormProspekLama = ({ route }) => {
    const { name, clientId } = route.params
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [checked, setChecked] = useState('first');
    const [valuePembiayaanDiajukan, setValuePembiayaanDiajukan] = useState(null);
    const [itemsPembiayaanDiajukan, setItemsPembiayaanDiajukan] = useState([]);
    const [valueJangkaWaktuPembiayaanDiajukan, setValueJangkaWaktuPembiayaanDiajukan] = useState(null);
    const [itemsJangkaWaktuPembiayaanDiajukan, setItemsJangkaWaktuPembiayaanDiajukan] = useState([]);
    const [valueTempatTinggalNasabah, setValueTempatTinggalNasabah] = useState(null);
    const [itemsTempatTinggalNasabah, setItemsTempatTinggalNasabah] = useState([]);
    const [valuePerubahanStatusPernikahan, setValuePerubahanStatusPernikahan] = useState(null);
    const [itemsPerubahanStatusPernikahan, setItemsPerubahanStatusPernikahan] = useState(pilihanYaTidak);
    const [valuePerubahanStatusTanggungan, setValuePerubahanStatusTanggungan] = useState(null);
    const [itemsPerubahanStatusTanggungan, setItemsPerubahanStatusTanggungan] = useState(pilihanYaTidak);
    const [valueKehadiranPKM, setValueKehadiranPKM] = useState(null);
    const [itemsKehadiranPKM, setItemsKehadiranPKM] = useState([{ label: '100% H', value: '1' },{ label: '1-5x TH', value: '2' }, { label: '6-10x TH', value: '3' }, { label: '11-15x TH', value: '4' }, { label: '>16x TH', value: '5' }]);
    const [valuePembayaran, setValuePembayaran] = useState(null);
    const [itemsPembayaran, setItemsPembayaran] = useState([{ label: '100% B', value: '1' }, { label: '3x TR', value: '1' }]);
    const [valuePerubahanUsaha, setValuePerubahanUsaha] = useState(null);
    const [itemsPerubahanUsaha, setItemsPerubahanUsaha] = useState(pilihanYaTidak);
    const [valueTandaTanganKetuaSubKelompok, setValueTandaTanganKetuaSubKelompok] = useState(null);
    const [valueTandaTanganKetuaKelompok, setValueTandaTanganKetuaKelompok] = useState(null);
    const [valueTandaTanganAO, setValueTandaTanganAO] = useState(null);
    

    useEffect(() => {
        setInfo();
        getUserData();
        getStorageRumahTinggal();
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

    const getStorageRumahTinggal = async () => {
        if (__DEV__) console.log('getStorageRumahTinggal loaded');

        try {
            const response = await AsyncStorage.getItem('HomeStatus');
            if (response !== null) {
                const responseJSON = JSON.parse(response);
                if (responseJSON.length > 0 ?? false) {
                    var responseFiltered = responseJSON.map((data, i) => {
                        return { label: data.homeStatusDetail, value: data.id };
                    }) ?? [];
                    if (__DEV__) console.log('getStorageRumahTinggal responseFiltered:', responseFiltered);
                    setItemsTempatTinggalNasabah(responseFiltered);
                    return;
                }
            }
            setItemsTempatTinggalNasabah([]);
        } catch (error) {
            setItemsTempatTinggalNasabah([]);
        }
    }

    const onSelectSign = (key, data) => {
        if (__DEV__) console.log('onSelectSign loaded');
        if (__DEV__) console.log('onSelectSign key:', key);
        if (__DEV__) console.log('onSelectSign data:', data);

        if (key === 'tandaTanganKetuaSubKelompok') setValueTandaTanganKetuaSubKelompok(data);
        if (key === 'tandaTanganKetuaKelompok') setValueTandaTanganKetuaKelompok(data);
        if (key === 'tandaTanganAO') setValueTandaTanganAO(data);
    };

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
            <Text style={{ width: 100 }}>Nama</Text>
            <Text style={styles.MH8}>:</Text>
            <Text style={styles.F1}>{name}</Text>
        </View>
    )

    const renderInformasiIdentitas = () => (
        <View style={[styles.FDRow, styles.MV4]}>
            <View style={{ width: 100 }}>
                <Text>No. Identitas</Text>
                <Text style={{ color: 'gray' }}>KTP/KK</Text>
            </View>
            <Text style={styles.MH8}>:</Text>
            <Text style={styles.F1}>-</Text>
        </View>
    )

    const renderInformasiKelompok = () => (
        <View style={[styles.FDRow, styles.MV4]}>
            <Text style={{ width: 100 }}>Kelompok</Text>
            <Text style={styles.MH8}>:</Text>
            <Text style={styles.F1}>-</Text>
        </View>
    )

    const renderFormPembiayaanTahap = () => (
        <View style={[styles.MV4]}>
            <Text style={styles.MB8}>Pembiayaan Tahap</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valuePembiayaanDiajukan}
                    onValueChange={(itemValue, itemIndex) => setValuePembiayaanDiajukan(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsPembiayaanDiajukan.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormPembiayaanDiajukan = () => (
        <View style={[styles.MV4]}>
            <Text style={styles.MB8}>Pembiayaan Diajukan</Text>
            <View style={[styles.F1, styles.P8, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <TextInput 
                    onChangeText={(text) => { }}
                    keyboardType="number-pad" 
                    style={{ fontSize: 15, color: "#545454" }}
                />
            </View>
        </View>
    )
    
    const renderFormJangkaWaktuPembiayaanDiajukan = () => (
        <View style={[styles.MV4]}>
            <Text style={styles.MB8}>Jangka Waktu Pembiayaan Diajukan</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valueJangkaWaktuPembiayaanDiajukan}
                    onValueChange={(itemValue, itemIndex) => setValueJangkaWaktuPembiayaanDiajukan(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsJangkaWaktuPembiayaanDiajukan.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormTempatTinggalNasabah = () => (
        <View style={[styles.MV4]}>
            <Text style={styles.MB8}>Tempat Tinggal Nasbah</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valueTempatTinggalNasabah}
                    onValueChange={(itemValue, itemIndex) => setValueTempatTinggalNasabah(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsTempatTinggalNasabah.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormPerubahanStatusPernikahan = () => (
        <View style={[styles.FDRow, styles.MV4, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Perubahan Status Pernikahan</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valuePerubahanStatusPernikahan}
                    onValueChange={(itemValue, itemIndex) => setValuePerubahanStatusPernikahan(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsPerubahanStatusPernikahan.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormPerubahanStatusTanggungan = () => (
        <View style={[styles.FDRow, styles.MV4, styles.MT16, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Perubahan Status Tanggungan</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valuePerubahanStatusTanggungan}
                    onValueChange={(itemValue, itemIndex) => setValuePerubahanStatusTanggungan(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsPerubahanStatusTanggungan.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKehadiranPKM = () => (
        <View style={[styles.FDRow, styles.MV4, styles.MT16, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Kehadiran PKM</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valueKehadiranPKM}
                    onValueChange={(itemValue, itemIndex) => setValueKehadiranPKM(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsKehadiranPKM.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormKeterangan = () => (
        <View style={styles.MV16}>
            <Text>Keterangan :</Text>
            <View style={[styles.MT8]}>
                <TextInput
                    multiline={true}
                    numberOfLines={4}
                    style={{
                        borderWidth:1,
                        borderRadius:5,
                        height: 100,
                        padding: 8
                    }}
                    textAlignVertical="top"
                />
            </View>
        </View>
    )

    const renderFormPembayaran = () => (
        <View style={[styles.FDRow, styles.MV4, styles.MT16, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Pembayaran</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valuePembayaran}
                    onValueChange={(itemValue, itemIndex) => setValuePembayaran(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsPembayaran.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormPerubahanUsaha = () => (
        <View style={[styles.FDRow, styles.MV4, styles.MT16, { alignItems: 'center' }]}>
            <Text style={{ width: 130 }}>Perubahan Usaha</Text>
            <Text style={styles.MH8}>:</Text>
            <View style={[styles.F1, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}>
                <Picker
                    selectedValue={valuePerubahanUsaha}
                    onValueChange={(itemValue, itemIndex) => setValuePerubahanUsaha(itemValue)}
                >
                    <Picker.Item key={'-1'} label={'-- Pilih --'} value={null} />
                    {itemsPerubahanUsaha.map((x, i) => <Picker.Item key={i} label={x.label} value={x.value} />)}
                </Picker>
            </View>
        </View>
    )

    const renderFormAggrement = () => (
        <Text style={styles.MV16}>Dengan ini kelompok kami MENYETUJUI nasabah tersebut untuk diajukan menerima pembiayaan Mekaar Tahap Lanjutan, dan kami bersedia bertanggung jawab Bersama apabila nasabah tersebut diatas tidak memenuhi kewajiban.</Text>
    )

    const renderFormDate = () => (
        <View style={[styles.FDRow,  styles.MV16, { alignItems: 'center' }]}>
            <TextInput
                placeholder='Jakarta'
                style={[styles.F1, styles.MR16, { borderWidth: 1, borderRadius: 6, borderColor: 'gray' }]}
            />
            <Text>, 14 Juni 2021</Text>
        </View>
    )

    const renderFormTandaTanganKetuaSubKelompok = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Ketua Sub Kelompok</Text>
            <View style={[stylesheet.boxTTD, styles.MT8]}>
                {valueTandaTanganKetuaSubKelompok && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganKetuaSubKelompok }}
                    />
                )}
                <Text style={[styles.note, { color: 'red', marginVertical: 16}]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganKetuaSubKelompok', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTandaTanganKetuaKelompok = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Ketua Kelompok</Text>
            <View style={[stylesheet.boxTTD, styles.MT8]}>
                {valueTandaTanganKetuaKelompok && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganKetuaKelompok }}
                    />
                )}
                <Text style={[styles.note, { color: 'red', marginVertical: 16}]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganKetuaKelompok', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTandaTanganAO = () => (
        <View style={styles.MT8}>
            <Text>Account Officer</Text>
            <View style={[stylesheet.boxTTD, styles.MT8]}>
                {valueTandaTanganAO && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganAO }}
                    />
                )}
                <Text style={[styles.note, { color: 'red', marginBottom: 16 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={"Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganAO', onSelectSign: onSelectSign })} />
            </View>
        </View>
    )

    const renderFormTTD = () => (
        <View style={styles.MV16}>
            <Text style={styles.MB16}>Disetujui atas nama Kelompok Gang Kancil</Text>
            {renderFormTandaTanganKetuaSubKelompok()}
            {renderFormTandaTanganKetuaKelompok()}
            {renderFormTandaTanganAO()}
        </View>
    )

    const renderFormOne = () => (
        <View style={[styles.MV16]}>
            {renderFormPembiayaanTahap()}
            {renderFormPembiayaanDiajukan()}
            {renderFormJangkaWaktuPembiayaanDiajukan()}
            {renderFormTempatTinggalNasabah()}
            {renderFormPerubahanStatusPernikahan()}
            {renderFormKeterangan()}
            {renderFormPerubahanStatusTanggungan()}
            {renderFormKeterangan()}
            {renderFormKehadiranPKM()}
            {renderButtonSaveDraft()}
        </View>
    )

    const renderFormTwo = () => (
        <View style={[styles.MV16]}>
            {renderFormPembayaran()}
            {renderFormPerubahanUsaha()}
            {renderFormKeterangan()}
            {renderButtonSaveDraft()}
            {renderFormAggrement()}
            {renderFormDate()}
            {renderSpace()}
            {renderFormTTD()}
        </View>
    )

    const renderButtonSaveDraft = () => (
        <View style={styles.buttonContainer}>
            <View style={styles.F1} />
            <TouchableOpacity
                onPress={() => null}
            >
                <View style={styles.button}>
                    <Text style={{ color: 'white' }}>Save Draft</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderButtonSimpan = () => (
        <View style={styles.MT16}>
            <TouchableOpacity
                onPress={() => null}
            >
                <View style={styles.buttonSubmitContainer}>
                    <Text style={styles.buttonSubmitText}>SUBMIT</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderSpace = () => (
        <View style={styles.spaceGray} />
    )

    const renderBody = () => (
        <View style={[styles.bodyContainer, styles.P16]}>
            <ScrollView>
                <Text style={[styles.MB16]}>Dengan data nasabah sebagai berikut:</Text>
                {renderInformasiNama()}
                {renderInformasiIdentitas()}
                {renderInformasiKelompok()}
                {renderFormOne()}
                {renderSpace()}
                {renderFormTwo()}
                {renderSpace()}
                {renderButtonSimpan()}
            </ScrollView>
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
    boxTTD: {
        borderRadius: 6,
        borderWidth: 1
    }
})

export default InisiasiFormProspekLama;
