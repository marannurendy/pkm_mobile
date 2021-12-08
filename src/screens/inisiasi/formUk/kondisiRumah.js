import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ImageBackground, TextInput, ScrollView } from 'react-native';
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

const InisiasiFormUKKondisiRumah = ({ route }) => {
    const { groupName, namaNasabah } = route.params;
    const navigation = useNavigation();
    const [ currentDate, setCurrentDate ] = useState();
    const [openLuasBangunan, setOpenLuasBangunan] = useState(false);
    const [valueLuasBangunan, setValueLuasBangunan] = useState(null);
    const [itemsLuasBangunan, setItemsLuasBangunan] = useState(dataPilihan);
    const [openKondisiBangunan, setOpenKondisiBangunan] = useState(false);
    const [valueKondisiBangunan, setValueKondisiBangunan] = useState(null);
    const [itemsKondisiBangunan, setItemsKondisiBangunan] = useState(dataPilihan);
    const [openJenisAtap, setOpenJenisAtap] = useState(false);
    const [valueJenisAtap, setValueJenisAtap] = useState(null);
    const [itemsJenisAtap, setItemsJenisAtap] = useState(dataPilihan);
    const [openDinding, setOpenDinding] = useState(false);
    const [valueDinding, setValueDinding] = useState(null);
    const [itemsDinding, setItemsDinding] = useState(dataPilihan);
    const [openLantai, setOpenLantai] = useState(false);
    const [valueLantai, setValueLantai] = useState(null);
    const [itemsLantai, setItemsLantai] = useState(dataPilihan);

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

    const renderFormLuasBangunan = () => (
        <View style={styles.MT8}>
            <Text>Luas Bangunan (*)</Text>
            <DropDownPicker
                open={openLuasBangunan}
                value={valueLuasBangunan}
                items={itemsLuasBangunan}
                setOpen={setOpenLuasBangunan}
                setValue={setValueLuasBangunan}
                setItems={setItemsLuasBangunan}
                placeholder='Pilih Luas Bangunan'
                onChangeValue={() => null}
            />
        </View>
    )

    const renderFormKondisiBangunan = () => (
        <View style={styles.MT8}>
            <Text>Kondisi Bangunan (*)</Text>
            <DropDownPicker
                open={openKondisiBangunan}
                value={valueKondisiBangunan}
                items={itemsKondisiBangunan}
                setOpen={setOpenKondisiBangunan}
                setValue={setValueKondisiBangunan}
                setItems={setItemsKondisiBangunan}
                placeholder='Pilih Kondisi Bangunan'
                onChangeValue={() => null}
            />
        </View>
    )

    const renderFormJenisAtap = () => (
        <View style={styles.MT8}>
            <Text>Jenis Atap (*)</Text>
            <DropDownPicker
                open={openJenisAtap}
                value={valueJenisAtap}
                items={itemsJenisAtap}
                setOpen={setOpenJenisAtap}
                setValue={setValueJenisAtap}
                setItems={setItemsJenisAtap}
                placeholder='Pilih Jenis Atap'
                onChangeValue={() => null}
            />
        </View>
    )

    const renderFormDinding = () => (
        <View style={styles.MT8}>
            <Text>Dinding (*)</Text>
            <DropDownPicker
                open={openDinding}
                value={valueDinding}
                items={itemsDinding}
                setOpen={setOpenDinding}
                setValue={setValueDinding}
                setItems={setItemsDinding}
                placeholder='Pilih Dinding'
                onChangeValue={() => null}
            />
        </View>
    )

    const renderFormLantai = () => (
        <View style={styles.MT8}>
            <Text>Lantai (*)</Text>
            <DropDownPicker
                open={openLantai}
                value={valueLantai}
                items={itemsLantai}
                setOpen={setOpenLantai}
                setValue={setValueLantai}
                setItems={setItemsLantai}
                placeholder='Pilih Lantai'
                onChangeValue={() => null}
            />
        </View>
    )

    const renderFormSanitasi = () => (
        <View style={styles.MT8}>
            <Text style={[styles.FS18, styles.MB16]}>SANITASI</Text>
            <View style={styles.MT8}>
                <Text>Ada Akses Mendapat Air Bersih</Text>
                <View style={[styles.FDRow, styles.MT8]}>
                    <BouncyCheckbox onPress={(isChecked) => __DEV__ && console.log('onPress')} />
                    <Text style={styles.MR16}>Ya</Text>
                    <BouncyCheckbox onPress={(isChecked) => __DEV__ && console.log('onPress')} />
                    <Text>Tidak</Text>
                </View>
            </View>
            <View style={styles.MT16}>
                <Text>Ada Kamar Mandi/Toilet Milik Sendiri</Text>
                <View style={[styles.FDRow, styles.MT8]}>
                    <BouncyCheckbox onPress={(isChecked) => __DEV__ && console.log('onPress')} />
                    <Text style={styles.MR16}>Ya</Text>
                    <BouncyCheckbox onPress={(isChecked) => __DEV__ && console.log('onPress')} />
                    <Text>Tidak</Text>
                </View>
            </View>
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

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderFormLuasBangunan()}
            {renderFormKondisiBangunan()}
            {renderFormJenisAtap()}
            {renderFormDinding()}
            {renderFormLantai()}
            {renderButtonSaveDraft()}
            {renderSpace()}
            {renderFormSanitasi()}
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>Kondisi Rumah</Text>
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

export default InisiasiFormUKKondisiRumah;
