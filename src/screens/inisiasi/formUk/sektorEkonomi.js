import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, ScrollView } from 'react-native';
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

const InisiasiFormUKSektorEkonomi = ({ route }) => {
    const { groupName, namaNasabah } = route.params;
    const navigation = useNavigation();
    const [ currentDate, setCurrentDate ] = useState();
    const [openSektorEkonomi, setOpenSektorEkonomi] = useState(false);
    const [valueSektorEkonomi, setValueSektorEkonomi] = useState(null);
    const [itemsSektorEkonomi, setItemsSektorEkonomi] = useState(dataPilihan);
    const [openSubSektorEkonomi, setOpenSubSektorEkonomi] = useState(false);
    const [valueSubSektorEkonomi, setValueSubSektorEkonomi] = useState(null);
    const [itemsSubSektorEkonomi, setItemsSubSektorEkonomi] = useState(dataPilihan);
    const [openJenisUsaha, setOpenJenisUsaha] = useState(false);
    const [valueJenisUsaha, setValueJenisUsaha] = useState(null);
    const [itemsJenisUsaha, setItemsJenisUsaha] = useState(dataPilihan);

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

    const renderFormSektorEkonomi = () => (
        <View style={styles.MT8}>
            <Text>Sektor Ekonomi (*)</Text>
            <DropDownPicker
                open={openSektorEkonomi}
                value={valueSektorEkonomi}
                items={itemsSektorEkonomi}
                setOpen={setOpenSektorEkonomi}
                setValue={setValueSektorEkonomi}
                setItems={setItemsSektorEkonomi}
                placeholder='Pilih Sektor Ekonomi'
                onChangeValue={() => null}
            />
        </View>
    )

    const renderFormSubSektorEkonomi = () => (
        <View style={styles.MT8}>
            <Text>Sub Sektor Ekonomi (*)</Text>
            <DropDownPicker
                open={openSubSektorEkonomi}
                value={valueSubSektorEkonomi}
                items={itemsSubSektorEkonomi}
                setOpen={setOpenSubSektorEkonomi}
                setValue={setValueSubSektorEkonomi}
                setItems={setItemsSubSektorEkonomi}
                placeholder='Pilih Sub Sektor Ekonomi'
                onChangeValue={() => null}
            />
        </View>
    )

    const renderFormJenisUsaha = () => (
        <View style={styles.MT8}>
            <Text>Jenis Usaha (*)</Text>
            <DropDownPicker
                open={openJenisUsaha}
                value={valueJenisUsaha}
                items={itemsJenisUsaha}
                setOpen={setOpenJenisUsaha}
                setValue={setValueJenisUsaha}
                setItems={setItemsJenisUsaha}
                placeholder='Pilih Jenis Usaha'
                onChangeValue={() => null}
            />
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

    const renderForm = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderFormSektorEkonomi()}
            {renderFormSubSektorEkonomi()}
            {renderFormJenisUsaha()}
            {renderButtonSaveDraft()}
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>Sektor Ekonomi</Text>
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

export default InisiasiFormUKSektorEkonomi;
