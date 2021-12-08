import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { styles } from './styles';

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

const ProdukPembiayaan = ({ route }) => {
    const { groupName, namaNasabah } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [openJenisPembiayaan, setOpenJenisPembiayaan] = useState(false);
    const [valueJenisPembiayaan, setValueJenisPembiayaan] = useState(null);
    const [itemsJenisPembiayaan, setItemsJenisPembiayaan] = useState(dataPilihan);
    const [openNamaProduk, setOpenNamaProduk] = useState(false);
    const [valueNamaProduk, setValueNamaProduk] = useState(null);
    const [itemsNamaProduk, setItemsNamaProduk] = useState(dataPilihan);
    const [openProdukPembiayaan, setOpenProdukPembiayaan] = useState(false);
    const [valueProdukPembiayaan, setValueProdukPembiayaan] = useState(null);
    const [itemsProdukPembiayaan, setItemsProdukPembiayaan] = useState(dataPilihan);
    const [openJumlahPinjaman, setOpenJumlahPinjaman] = useState(false);
    const [valueJumlahPinjaman, setValueJumlahPinjaman] = useState(null);
    const [itemsJumlahPinjaman, setItemsJumlahPinjaman] = useState(dataPilihan);
    const [openKategoriTujuanPembiayaan, setOpenKategoriTujuanPembiayaan] = useState(false);
    const [valueKategoriTujuanPembiayaan, setValueKategoriTujuanPembiayaan] = useState(null);
    const [itemsKategoriTujuanPembiayaan, setItemsKategoriTujuanPembiayaan] = useState(dataPilihan);
    const [openTujuanPembiayaan, setOpenTujuanPembiayaan] = useState(false);
    const [valueTujuanPembiayaan, setValueTujuanPembiayaan] = useState(null);
    const [itemsTujuanPembiayaan, setItemsTujuanPembiayaan] = useState(dataPilihan);
    const [openTypePencairan, setOpenTypePencairan] = useState(false);
    const [valueTypePencairan, setValueTypePencairan] = useState(null);
    const [itemsTypePencairan, setItemsTypePencairan] = useState(dataPilihan);
    const [openFrekuensiPembayaran, setOpenFrekuensiPembayaran] = useState(false);
    const [valueFrekuensiPembayaran, setValueFrekuensiPembayaran] = useState(null);
    const [itemsFrekuensiPembayaran, setItemsFrekuensiPembayaran] = useState(dataPilihan);
    const [valueTermPembiayaan, setValueTermPembiayaan] = useState(null);
    const [valueNamaBank, setValueNamaBank] = useState('');
    const [valueNoRekening, setValueNoRekening] = useState('');
    const [valuePemilikRekening, setValuePemilikRekening] = useState('');

    useEffect(() => {
        setInfo()
    }, [])

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

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

    const renderFormJenisPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Jenis Pembiayaan</Text>
            <DropDownPicker
                open={openJenisPembiayaan}
                value={valueJenisPembiayaan}
                items={itemsJenisPembiayaan}
                setOpen={setOpenJenisPembiayaan}
                setValue={setValueJenisPembiayaan}
                setItems={setItemsJenisPembiayaan}
                placeholder='Pilih Jenis Pembiayaan'
                onChangeValue={() => null}
                zIndex={10000}
            />
        </View>
    )

    const renderFormNamaProduk = () => (
        <View style={styles.MT8}>
            <Text>Nama Produk</Text>
            <DropDownPicker
                open={openNamaProduk}
                value={valueNamaProduk}
                items={itemsNamaProduk}
                setOpen={setOpenNamaProduk}
                setValue={setValueNamaProduk}
                setItems={setItemsNamaProduk}
                placeholder='Pilih Nama Produk'
                onChangeValue={() => null}
                zIndex={9000}
            />
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
                zIndex={8000}
            />
        </View>
    )

    const renderFormJumlahPinjaman = () => (
        <View style={styles.MT8}>
            <Text>Jumlah Pinjaman</Text>
            <DropDownPicker
                open={openJumlahPinjaman}
                value={valueJumlahPinjaman}
                items={itemsJumlahPinjaman}
                setOpen={setOpenJumlahPinjaman}
                setValue={setValueJumlahPinjaman}
                setItems={setItemsJumlahPinjaman}
                placeholder='Pilih Jumlah Pinjaman'
                onChangeValue={() => null}
                zIndex={7000}
            />
        </View>
    )

    const renderFormTermPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Term Pembiayaan</Text>
            <View style={styles.textInputContainer}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueTermPembiayaan} 
                        onChangeText={(text) => setValueTermPembiayaan(text)} 
                        keyboardType='numeric'
                        placeholder="0" 
                        style={styles.F1}
                    />
                </View>
                <View>
                    <FontAwesome5 name={'id-badge'} size={18} />
                </View>
            </View>
        </View>
    )

    const renderFormKategoriTujuanPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Kategori Tujuan Pembiayaan</Text>
            <DropDownPicker
                open={openKategoriTujuanPembiayaan}
                value={valueKategoriTujuanPembiayaan}
                items={itemsKategoriTujuanPembiayaan}
                setOpen={setOpenKategoriTujuanPembiayaan}
                setValue={setValueKategoriTujuanPembiayaan}
                setItems={setItemsKategoriTujuanPembiayaan}
                placeholder='Pilih Kategori Tujuan Pembiayaan'
                onChangeValue={() => null}
                zIndex={6000}
            />
        </View>
    )

    const renderFormTujuanPembiayaan = () => (
        <View style={styles.MT8}>
            <Text>Tujuan Pembiayaan</Text>
            <DropDownPicker
                open={openTujuanPembiayaan}
                value={valueTujuanPembiayaan}
                items={itemsTujuanPembiayaan}
                setOpen={setOpenTujuanPembiayaan}
                setValue={setValueTujuanPembiayaan}
                setItems={setItemsTujuanPembiayaan}
                placeholder='Pilih Tujuan Pembiayaan'
                onChangeValue={() => null}
                zIndex={5000}
            />
        </View>
    )

    const renderFormTypePencairan = () => (
        <View style={styles.MT8}>
            <Text>Type Pencairan</Text>
            <DropDownPicker
                open={openTypePencairan}
                value={valueTypePencairan}
                items={itemsTypePencairan}
                setOpen={setOpenTypePencairan}
                setValue={setValueTypePencairan}
                setItems={setItemsTypePencairan}
                placeholder='Pilih Type Pencairan'
                onChangeValue={() => null}
                zIndex={4000}
            />
        </View>
    )

    const renderFormFrekuensiPembayaran = () => (
        <View style={styles.MT8}>
            <Text>Frekuensi Pembayaran</Text>
            <DropDownPicker
                open={openFrekuensiPembayaran}
                value={valueFrekuensiPembayaran}
                items={itemsFrekuensiPembayaran}
                setOpen={setOpenFrekuensiPembayaran}
                setValue={setValueFrekuensiPembayaran}
                setItems={setItemsFrekuensiPembayaran}
                placeholder='Pilih Frekuensi Pembayaran'
                onChangeValue={() => null}
            />
        </View>
    )

    const renderFormRekeningBank = () => (
        <View style={styles.MT8}>
            <Text style={{ width: 100 }}>Rekening Bank</Text>
            <View style={[styles.FDRow, styles.MT4]}>
                <BouncyCheckbox onPress={(isChecked) => __DEV__ && console.log('onPress')} />
                <Text style={styles.MR16}>Ada</Text>
                <BouncyCheckbox onPress={(isChecked) => __DEV__ && console.log('onPress')} />
                <Text>Tidak Ada</Text>
            </View>
        </View>
    )

    const renderFormNamaBank = () => (
        <View style={styles.formContainerText}>
            <Text style={{ width: 100 }}>Nama Bank</Text>
            <View style={[styles.textInputContainer, styles.ML8]}>
                <TextInput 
                    value={valueNamaBank} 
                    onChangeText={(text) => setValueNamaBank(text)}
                    placeholder="" 
                    style={styles.F1}
                />
            </View>
        </View>
    )

    const renderFormNoRekening = () => (
        <View style={styles.formContainerText}>
            <Text style={{ width: 100 }}>No. Rekening</Text>
            <View style={[styles.textInputContainer, styles.ML8]}>
                <TextInput 
                    value={valueNoRekening} 
                    onChangeText={(text) => setValueNoRekening(text)}
                    placeholder="" 
                    style={styles.F1}
                />
            </View>
        </View>
    )

    const renderFormPemilikRekening = () => (
        <View style={styles.formContainerText}>
            <Text style={{ width: 100 }}>Pemilik Rekening</Text>
            <View style={[styles.textInputContainer, styles.ML8]}>
                <TextInput 
                    value={valuePemilikRekening} 
                    onChangeText={(text) => setValuePemilikRekening(text)}
                    placeholder="" 
                    style={styles.F1}
                />
            </View>
        </View>
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderFormSiklusPembiayaan()}
            {renderFormJenisPembiayaan()}
            {renderFormNamaProduk()}
            {renderFormProdukPembiayaan()}
            {renderFormJumlahPinjaman()}
            {renderFormTermPembiayaan()}
            {renderFormKategoriTujuanPembiayaan()}
            {renderFormTujuanPembiayaan()}
            {renderFormTypePencairan()}
            {renderFormFrekuensiPembayaran()}
            {renderFormRekeningBank()}
            {renderFormNamaBank()}
            {renderFormNoRekening()}
            {renderFormPemilikRekening()}
        </View>
    )

    const renderButton = () => (
        <>
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
            <View style={styles.P16}>
                <TouchableOpacity
                    onPress={() => null}
                >
                    <View style={styles.buttonSubmitContainer}>
                        <Text style={styles.buttonSubmitText}>SIMPAN</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>Produk Pembiayaan</Text>
            <ScrollView>
                {renderForm()}
                {renderButton()}
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
    }
});

export default ProdukPembiayaan;
