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

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const withTextInput = dimension.width - (20 * 4) + 8;

const InisiasiFormProspekLamaList = ({ route }) => {
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [isTahapLanjut, setIsTahapLanjut] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        getUserData();
        setInfo();
        fetchData();
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

    const fetchData = () => {
        if (__DEV__) console.log('getData loaded');
        if (__DEV__) console.log('getData keyword:', keyword);

        const responseJSON = [
            {
                id: 1,
                name: 'Aminah Rasmaini',
                phone: '081399065432'
            },
            {
                id: 2,
                name: 'Bellanissa Zainuddin',
                phone: '081809659932'
            }
        ];

        setData(responseJSON);
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
                    <Text style={{ color: colors.PUTIH }}>DATA PROSPEK</Text>
                </View>
            </View>
        </ImageBackground>
    )

    const renderSearch = () => (
        <View style={[styles.FDRow, styles.MB16]}>
            <View style={[styles.F1, stylesheet.containerSearch, { alignItems: 'center' }]}>
                <FontAwesome5 name="search" size={15} color="#2e2e2e" style={{marginHorizontal: 10}} />
                <TextInput 
                    placeholder={"Cari prospek"}
                    style={
                        {
                            flex: 1,
                            padding: 5,
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20
                        }
                    }
                    onChangeText={(text) => setKeyword(text)}
                    value={keyword}
                    returnKeyType="done"
                    onSubmitEditing={() => getData()}
                />
            </View>
            <View style={[styles.FDRow, { alignItems: 'center' }]}>
                <Checkbox
                    status={isTahapLanjut ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setIsTahapLanjut(!isTahapLanjut);
                    }}
                />
                <Text>Tahap Lanjut</Text>
            </View>
        </View>
    )

    const renderList = () => data.map((x, i) => (
        <>
            <TouchableOpacity
                key={i}
                onPress={() => navigation.navigate('InisiasiFormProspekLama')}
            >
                <View
                    style={[styles.FDRow, styles.P8]}
                >
                    <Text style={styles.F1}>{x.name}</Text>
                    <Text style={{ textAlign:'right', color: 'gray' }}>{x.phone}</Text>
                </View>
            </TouchableOpacity>
            {i !== data.length - 1 && renderSpace()}
        </>
    ))

    const renderSpace = () => (
        <View style={stylesheet.greySpace} />
    )

    const renderBody = () => (
        <View style={[styles.bodyContainer, styles.P16]}>
            {renderSearch()}
            {renderList()}
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
    containerSearch: {
        borderWidth: 1, 
        marginHorizontal: 10, 
        marginTop: 5, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FFF', 
        borderRadius: 20
    },
    greySpace: {
        marginVertical: 8,
        height: 1,
        backgroundColor: colors.ABUABU
    }
})

export default InisiasiFormProspekLamaList;
