import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, TextInput, ScrollView } from 'react-native';
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
const dataPembiayaanLembagaLain = [
    { label: 'Keuangan Bank', value: '1' },
    { label: 'Keuangan Non Bank', value: '2' },
    { label: 'Lainnya', value: '3' }
];
const withTextInput = dimension.width - (20 * 4) + 8;

const InisiasiFormUKTingkatPendapatan = ({ route }) => {
    const { groupName, namaNasabah } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [valuePedapatanKotorPerhari, setValuePedapatanKotorPerhari] = useState('');
    const [valuePengeluaranKeluargaPerhari, setValuePengeluaranKeluargaPerhari] = useState('');
    const [valuePendapatanBersihPerhari, setValuePendapatanBersihPerhari] = useState('');
    const [valueJumlahHariUsahPerbulan, setValueJumlahHariUsahPerbulan] = useState('');
    const [valuePendapatanBersihPerbulan, setValuePendapatanBersihPerbulan] = useState('');
    const [valuePendapatanBersihPerminggu, setValuePendapatanBersihPerminggu] = useState('');
    const [openPembiayaanLembagaLain, setOpenPembiayaanLembagaLain] = useState(false);
    const [valuePembiayaanLembagaLain, setValuePembiayaanLembagaLain] = useState(null);
    const [valuePembiayaanLembagaLainFreetext, setIPembiayaanLembagaLainFreetext] = useState('');
    const [itemsPembiayaanLembagaLain, setItemsPembiayaanLembagaLain] = useState(dataPembiayaanLembagaLain);
    const [valueJumlahAngsuran, setValueJumlahAngsuran] = useState('');
    const [valuePedapatanKotorPerhariSuami, setValuePedapatanKotorPerhariSuami] = useState('');
    const [valuePengeluaranKeluargaPerhariSuami, setValuePengeluaranKeluargaPerhariSuami] = useState('');
    const [valuePendapatanBersihPerhariSuami, setValuePendapatanBersihPerhariSuami] = useState('');
    const [valueJumlahHariUsahPerbulanSuami, setValueJumlahHariUsahPerbulanSuami] = useState('');
    const [valuePendapatanBersihPerbulanSuami, setValuePendapatanBersihPerbulanSuami] = useState('');
    const [valuePendapatanBersihPermingguSuami, setValuePendapatanBersihPermingguSuami] = useState('');

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

    const renderFormPendapatanKotorPerhari = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Kotor Per Hari</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePedapatanKotorPerhari} 
                        onChangeText={(text) => setValuePedapatanKotorPerhari(text)}
                        placeholder='30000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPengeluaranKeluargaPerhari = () => (
        <View style={styles.MT8}>
            <Text>Pengeluaran Keluarga Per Hari</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePengeluaranKeluargaPerhari} 
                        onChangeText={(text) => setValuePengeluaranKeluargaPerhari(text)}
                        placeholder='10000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
            <Text style={styles.note}>Termasuk Jumlah angsuran dari Pembiayaan lain</Text>
        </View>
    )

    const renderFormPendapatanBersihPerhari = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Bersih Per Hari</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePendapatanBersihPerhari} 
                        onChangeText={(text) => setValuePendapatanBersihPerhari(text)}
                        placeholder='20000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormJumlahHariUsahPerbulan = () => (
        <View style={styles.MT8}>
            <Text>Jumlah Usaha Hari Per Bulan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueJumlahHariUsahPerbulan} 
                        onChangeText={(text) => setValueJumlahHariUsahPerbulan(text)}
                        placeholder='30'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPendapatanBersihPerbulan = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Bersih Per Bulan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePendapatanBersihPerbulan} 
                        onChangeText={(text) => setValuePendapatanBersihPerbulan(text)}
                        placeholder='600000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPendapatanBersihPerminggu = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Bersih Per Minggu</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePendapatanBersihPerminggu} 
                        onChangeText={(text) => setValuePendapatanBersihPerminggu(text)}
                        placeholder='150000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderPembiayaanDariLembaga = () => (
        <View style={styles.MT8}>
            <Text>Pembiayaan dari Lembaga</Text>
            <View style={styles.MT8}>
                <View style={styles.FDRow}>
                    <BouncyCheckbox onPress={(isChecked) => __DEV__ && console.log('onPress')} />
                    <Text style={styles.MR8}>Tidak Ada</Text>
                </View>
                <View style={[styles.FDRow, styles.MT8]}>
                    <BouncyCheckbox onPress={(isChecked) => __DEV__ && console.log('onPress')} />
                    <Text style={styles.MR8}>{`<= 2 Lembaga`}</Text>
                </View>
                <View style={[styles.FDRow, styles.MT8]}>
                    <BouncyCheckbox onPress={(isChecked) => __DEV__ && console.log('onPress')} />
                    <Text>{`> 2 Lembaga`}</Text>
                </View>
            </View>
        </View>
    )

    const renderFormJenisUsaha = () => (
        <View style={styles.MT16}>
            <Text>Pembiayaan Lembaga Lain</Text>
            <DropDownPicker
                open={openPembiayaanLembagaLain}
                value={valuePembiayaanLembagaLain}
                items={itemsPembiayaanLembagaLain}
                setOpen={setOpenPembiayaanLembagaLain}
                setValue={setValuePembiayaanLembagaLain}
                setItems={setItemsPembiayaanLembagaLain}
                placeholder='Pilih Pembiayaan Lembaga Lain'
                onChangeValue={() => null}
            />
            {['3'].includes(valuePembiayaanLembagaLain) && (
                <View style={[styles.textInputContainer, { width: withTextInput }]}>
                    <View style={styles.F1}>
                        <TextInput 
                            value={valuePembiayaanLembagaLainFreetext} 
                            onChangeText={(text) => setIPembiayaanLembagaLainFreetext(text)}
                            placeholder='Lainnya'
                            style={styles.F1}
                        />
                    </View>
                    <View />
                </View>
            )}
        </View>
    )

    const renderFormJumlahAngsuran = () => (
        <View style={styles.MT8}>
            <Text>Jumlah Angsuran</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueJumlahAngsuran} 
                        onChangeText={(text) => setValueJumlahAngsuran(text)}
                        placeholder='30'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPendapatanKotorPerhariSuami = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Kotor Per Hari</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePedapatanKotorPerhariSuami} 
                        onChangeText={(text) => setValuePedapatanKotorPerhariSuami(text)}
                        placeholder='30000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPengeluaranKeluargaPerhariSuami = () => (
        <View style={styles.MT8}>
            <Text>Pengeluaran Keluarga Per Hari</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePengeluaranKeluargaPerhariSuami} 
                        onChangeText={(text) => setValuePengeluaranKeluargaPerhariSuami(text)}
                        placeholder='10000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
            <Text style={styles.note}>Termasuk Jumlah angsuran dari Pembiayaan lain</Text>
        </View>
    )

    const renderFormPendapatanBersihPerhariSuami = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Bersih Per Hari</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePendapatanBersihPerhariSuami} 
                        onChangeText={(text) => setValuePendapatanBersihPerhariSuami(text)}
                        placeholder='20000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormJumlahHariUsahPerbulanSuami = () => (
        <View style={styles.MT8}>
            <Text>Jumlah Usaha Hari Per Bulan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valueJumlahHariUsahPerbulanSuami} 
                        onChangeText={(text) => setValueJumlahHariUsahPerbulanSuami(text)}
                        placeholder='30'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPendapatanBersihPerbulanSuami = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Bersih Per Bulan</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePendapatanBersihPerbulanSuami} 
                        onChangeText={(text) => setValuePendapatanBersihPerbulanSuami(text)}
                        placeholder='600000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPendapatanBersihPermingguSuami = () => (
        <View style={styles.MT8}>
            <Text>Pendapatan Bersih Per Minggu</Text>
            <View style={[styles.textInputContainer, { width: withTextInput }]}>
                <View style={styles.F1}>
                    <TextInput 
                        value={valuePendapatanBersihPermingguSuami} 
                        onChangeText={(text) => setValuePendapatanBersihPermingguSuami(text)}
                        placeholder='150000'
                        style={styles.F1}
                    />
                </View>
                <View />
            </View>
        </View>
    )

    const renderFormPendapatanSuami = () => (
        <View style={styles.MT8}>
            <Text style={[styles.FS18, styles.MB16]}>PENDAPATAN SUAMI</Text>
            {renderFormPendapatanKotorPerhariSuami()}
            {renderFormPengeluaranKeluargaPerhariSuami()}
            {renderFormPendapatanBersihPerhariSuami()}
            {renderFormJumlahHariUsahPerbulanSuami()}
            {renderFormPendapatanBersihPerbulanSuami()}
            {renderFormPendapatanBersihPermingguSuami()}
            {renderButtonSaveDraft()}
        </View>
    )

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderFormPendapatanKotorPerhari()}
            {renderFormPengeluaranKeluargaPerhari()}
            {renderFormPendapatanBersihPerhari()}
            {renderFormJumlahHariUsahPerbulan()}
            {renderFormPendapatanBersihPerbulan()}
            {renderFormPendapatanBersihPerminggu()}
            {renderPembiayaanDariLembaga()}
            {renderFormJenisUsaha()}
            {renderFormJumlahAngsuran()}
            {renderButtonSaveDraft()}
            {renderSpace()}
            {renderFormPendapatanSuami()}
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

    const renderSpace = () => (
        <View style={styles.spaceGray} />
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>Pendapatan Nasabah</Text>
            <ScrollView>
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

export default InisiasiFormUKTingkatPendapatan;
