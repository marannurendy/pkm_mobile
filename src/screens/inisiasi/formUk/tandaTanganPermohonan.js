import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, ScrollView, StyleSheet, Dimensions, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { styles } from './styles';
import Sign from '../../../components/Sign';

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const dataPilihan = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' }
];
const withTextInput = dimension.width - (20 * 4) + 8;

const InisiasiFormUKTandaTanganPermohonan = ({ route }) => {
    const { groupName, namaNasabah } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [openProdukPembiayaan, setOpenProdukPembiayaan] = useState(false);
    const [valueProdukPembiayaan, setValueProdukPembiayaan] = useState(null);
    const [itemsProdukPembiayaan, setItemsProdukPembiayaan] = useState(dataPilihan);
    const [valueJumlahPembiayaanYangDiajukan, setValueJumlahPembiayaanYangDiajukan] = useState('');
    const [valueJangkaWaktu, setValueJangkaWaktu] = useState('');
    const [openFrekuensiPembiayaan, setOpenFrekuensiPembiayaan] = useState(false);
    const [valueFrekuensiPembiayaan, setValueFrekuensiPembiayaan] = useState(null);
    const [itemsFrekuensiPembiayaan, setItemsFrekuensiPembiayaan] = useState(dataPilihan);
    const [valueTandaTanganNasabah, setValueTandaTanganNasabah] = useState(null);
    const [valueTandaTanganSuamiPenjamin, setValueTandaTanganSuamiPenjamin] = useState(null);
    const [valueTandaTanganKetuaSubKemlompok, setValueTandaTanganKetuaSubKemlompok] = useState(null);
    const [valueTandaTanganKetuaKelompok, setValueTandaTanganKetuaKemlompok] = useState(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);

    useEffect(() => {
        setInfo()
    }, [])

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

    const onSelectSign = (key, data) => {
        if (__DEV__) console.log('onSelectSign loaded');
        if (__DEV__) console.log('onSelectSign key:', key);
        if (__DEV__) console.log('onSelectSign data:', data);

        if (key === 'tandaTanganNasabah') return setValueTandaTanganNasabah(data);
        if (key === 'tandaTanganSuamiPenjamin') return setValueTandaTanganSuamiPenjamin(data);
        if (key === 'tandaTanganKetuaSubKemlompok') return setValueTandaTanganKetuaSubKemlompok(data);
        if (key === 'tandaTanganKetuaKemlompok') return setValueTandaTanganKetuaKemlompok(data);
    };

    const renderHeader = () => (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.replace('UjiKelayakan', { groupName: groupName })} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>UJI KELAYAKAN</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerBoxImageBackground}>
                <ImageBackground source={images.banner} style={styles.headerImageBackground} imageStyle={{ borderRadius: 20 }}>
                    <Text style={[styles.headerText, { fontSize: 30 }]}>Form Uji Kelayakan</Text>
                    <Text style={[styles.headerText, { fontSize: 20 }]}>{groupName}</Text>
                    <Text style={[styles.headerText, { fontSize: 15 }]}>{namaNasabah}</Text>
                    <Text style={[styles.headerText, { fontSize: 15 }]}>{currentDate}</Text>
                </ImageBackground>
            </View>
        </>
    )

    const renderFormSiklusPembiayaan = () => (
        <View style={stylesheet.siklusContainer}>
            <Text style={styles.FS18}>SIKLUS PEMBIAYAAN</Text>
            <Text style={styles.FWBold}>Pertama</Text>
        </View>
    )

    const renderFormProdukPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Produk Pembiayaan</Text>
            <DropDownPicker
                open={openProdukPembiayaan}
                value={valueProdukPembiayaan}
                items={itemsProdukPembiayaan}
                setOpen={setOpenProdukPembiayaan}
                setValue={setValueProdukPembiayaan}
                setItems={setItemsProdukPembiayaan}
                placeholder='Pilih Produk Pembiayaan'
                onChangeValue={() => null}
            />
        </View>
    )

    const renderFormJumlahPembiayaanYangDiajukan = () => (
        <View style={styles.MT8}>
            <Text>Jumlah Pembiayaan Yang Diajukan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueJumlahPembiayaanYangDiajukan} 
                        onChangeText={(text) => setValueJumlahPembiayaanYangDiajukan(text)}
                        placeholder='3000000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormJangkaWaktu = () => (
        <View style={styles.MT8}>
            <Text>Jangka Waktu</Text>
            <View style={[styles.textInputContainer]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueJangkaWaktu} 
                        onChangeText={(text) => setValueJangkaWaktu(text)}
                        placeholder='25'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormFrekuensiPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Frekuensi Pembiayaan</Text>
            <DropDownPicker
                open={openFrekuensiPembiayaan}
                value={valueFrekuensiPembiayaan}
                items={itemsFrekuensiPembiayaan}
                setOpen={setOpenFrekuensiPembiayaan}
                setValue={setValueFrekuensiPembiayaan}
                setItems={setItemsFrekuensiPembiayaan}
                placeholder='Frekuensi Pembiayaan'
                onChangeValue={() => null}
            />
        </View>
    )

    const renderFormTandaTanganNasabah = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Nasabah (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganNasabah && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganNasabah }}
                    />
                )}
                <Text style={[styles.note, { color: 'red', marginLeft: 0 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={valueTandaTanganNasabah ? "Ganti TTD" : "Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganNasabah', onSelectSign: onSelectSign })} />
            </View>
            {/* <Sign 
                signature={valueTandaTanganNasabah}
                clearSignature={() => setValueTandaTanganNasabah('')}
                onOK={(sign) => setValueTandaTanganNasabah(sign)}
                onBegin={() => setScrollEnabled(false)}
                onEnd={() => setScrollEnabled(true)}
            />
            <Text style={[styles.note, { color: 'red', marginLeft: 0 }]}>*isi tanda tangan dengan benar</Text> */}
        </View>
    )

    const renderFormTandaTanganSuamiPenjamin = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Suami/Penjamin (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganSuamiPenjamin && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganSuamiPenjamin }}
                    />
                )}
                <Text style={[styles.note, { color: 'red', marginLeft: 0 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={valueTandaTanganSuamiPenjamin ? "Ganti TTD" : "Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganSuamiPenjamin', onSelectSign: onSelectSign })} />
            </View>
            {/* <Sign 
                signature={valueTandaTanganSuamiPenjamin}
                clearSignature={() => setValueTandaTanganSuamiPenjamin('')}
                onOK={(sign) => setValueTandaTanganSuamiPenjamin(sign)}
                onBegin={() => setScrollEnabled(false)}
                onEnd={() => setScrollEnabled(true)}
            />
            <Text style={[styles.note, { color: 'red', marginLeft: 0 }]}>*isi tanda tangan dengan benar</Text> */}
        </View>
    )

    const renderFormTandaTanganKetuaSubKelompok = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Ketua Sub Kelompok (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganKetuaSubKemlompok && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganKetuaSubKemlompok }}
                    />
                )}
                <Text style={[styles.note, { color: 'red', marginLeft: 0 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={valueTandaTanganKetuaSubKemlompok ? "Ganti TTD" : "Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganKetuaSubKemlompok', onSelectSign: onSelectSign })} />
            </View>
            {/* <Sign 
                signature={valueTandaTanganKetuaSubKemlompok}
                clearSignature={() => setValueTandaTanganKetuaSubKemlompok('')}
                onOK={(sign) => setValueTandaTanganKetuaSubKemlompok(sign)}
                onBegin={() => setScrollEnabled(false)}
                onEnd={() => setScrollEnabled(true)}
            />
            <Text style={[styles.note, { color: 'red', marginLeft: 0 }]}>*isi tanda tangan dengan benar</Text> */}
        </View>
    )

    const renderFormTandaTanganKetuaKelompok = () => (
        <View style={styles.MT8}>
            <Text>Tanda Tangan Ketua Kelompok (*)</Text>
            <View style={stylesheet.boxTTD}>
                {valueTandaTanganKetuaKelompok && (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 215 }}
                        source={{ uri: valueTandaTanganKetuaKelompok }}
                    />
                )}
                <Text style={[styles.note, { color: 'red', marginLeft: 0 }]}>*isi tanda tangan dengan benar</Text>
                <Button title={valueTandaTanganKetuaKelompok ? "Ganti TTD" : "Buat TTD"} onPress={() => navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganKetuaKemlompok', onSelectSign: onSelectSign })} />
            </View>
            {/* <Sign 
                signature={valueTandaTanganKetuaKelompok}
                clearSignature={() => setValueTandaTanganKetuaKemlompok('')}
                onOK={(sign) => setValueTandaTanganKetuaKemlompok(sign)}
                onBegin={() => setScrollEnabled(false)}
                onEnd={() => setScrollEnabled(true)}
            />
            <Text style={[styles.note, { color: 'red', marginLeft: 0 }]}>*isi tanda tangan dengan benar</Text> */}
        </View>
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderFormSiklusPembiayaan()}
            {renderFormProdukPembiayaan()}
            {renderFormJumlahPembiayaanYangDiajukan()}
            {renderFormJangkaWaktu()}
            {renderFormFrekuensiPembiayaan()}
            {renderFormTandaTanganNasabah()}
            {renderFormTandaTanganSuamiPenjamin()}
            {renderFormTandaTanganKetuaSubKelompok()}
            {renderFormTandaTanganKetuaKelompok()}
            {renderButtonSaveDraft()}
        </View>
    )

    const renderButtonSaveDraft = () => (
        <View style={styles.buttonContainer}>
            <View style={styles.F1} />
            <TouchableOpacity
                onPress={() => null}
            >
                <View style={styles.button}>
                    <Text>Save Draft</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderButtonSimpan = () => (
        <View style={styles.P16}>
            <TouchableOpacity
                onPress={() => null}
            >
                <View style={styles.buttonSubmitContainer}>
                    <Text style={styles.buttonSubmitText}>SIMPAN</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>Produk Pembiayaan</Text>
            <ScrollView scrollEnabled={scrollEnabled}>
                {renderForm()}
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
    siklusContainer: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        width: 200
    },
    boxTTD: {
        borderRadius: 6,
        borderWidth: 1
    }
});

export default InisiasiFormUKTandaTanganPermohonan;
