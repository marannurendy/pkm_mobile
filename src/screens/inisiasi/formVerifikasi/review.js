import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../formUk/styles';

const dimension = Dimensions.get('screen');
const images = {
    banner: require("../../../../assets/Image/Banner.png")
};
const withTextInput = dimension.width - (20 * 4) + 8;

const VerifikasiFormReview = ({ route }) => {
    const { groupName, namaNasabah } = route.params;
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState();
    const [isReview, setIsReview] = useState(false);

    useEffect(() => {
        setInfo();
    }, [])

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate');
        setCurrentDate(tanggal);
    }

    const onSelectSign = (key, data) => {
        if (__DEV__) console.log('onSelectSign loaded');
        if (__DEV__) console.log('onSelectSign key:', key);
        if (__DEV__) console.log('onSelectSign data:', data);

        ToastAndroid.show('Berhasil Approve', ToastAndroid.SHORT)
        navigation.navigate('Verifikasi', { groupName: groupName });
    };

    const renderHeader = () => (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.replace('Verifikasi', { groupName: groupName })} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>VERIFIKASI</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerBoxImageBackground}>
                <ImageBackground source={images.banner} style={styles.headerImageBackground} imageStyle={{ borderRadius: 20 }}>
                    <Text style={[styles.headerText, { fontSize: 30 }]}>Verifikasi</Text>
                    <Text style={[styles.headerText, { fontSize: 20 }]}>{groupName}</Text>
                    <Text style={[styles.headerText, { fontSize: 15 }]}>{namaNasabah}</Text>
                    <Text style={[styles.headerText, { fontSize: 15 }]}>{currentDate}</Text>
                </ImageBackground>
            </View>
        </>
    )

    const renderReview = () => (
        <View 
            style={
                {
                    marginHorizontal: 20,
                    alignItems: 'flex-end'
                }
            }
        >
            <TouchableOpacity
                onPress={() => ToastAndroid.show('Revisi', ToastAndroid.SHORT)}
            >
                <View
                    style={
                        {
                            backgroundColor: '#003049',
                            padding: 12,
                            borderRadius: 6,
                            paddingHorizontal: 32
                        }
                    }
                >
                    <Text style={{ color: 'white' }}>Revisi</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderButton = () => (
        <View
            style={
                {
                    flexDirection: 'row',
                    margin: 16
                }
            }
        >
            <TouchableOpacity
                onPress={() => isReview && navigation.navigate('InisiasiFormUKSignatureScreen', { key: 'tandaTanganApprove', onSelectSign: onSelectSign })}
                style={[styles.F1, styles.MR16]}
            >
                <View
                    style={
                        {
                            backgroundColor: isReview ?  '#008080' : 'gray',
                            padding: 12,
                            borderRadius: 6,
                            paddingHorizontal: 32
                        }
                    }
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Approve</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => isReview && ToastAndroid.show('Revisi', ToastAndroid.SHORT)}
                style={[styles.F1, styles.ML16]}
            >
                <View
                    style={
                        {
                            backgroundColor: isReview ? '#CD5C5C' : 'gray',
                            padding: 12,
                            borderRadius: 6,
                            paddingHorizontal: 32
                        }
                    }
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Reject</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <View style={styles.F1}>
                <Text 
                    style={
                        [
                            styles.bodyTitle,
                            { textDecorationLine: 'underline', color: 'blue' }
                        ]
                    } 
                    onPress={() => navigation.navigate('VerifikasiFormPreview', { uriPdf: 'http://reportdpm.pnm.co.id:8080/jasperserver/rest_v2/reports/reports/INISIASI/FP_KONVE_TL.pdf?ID_Prospek=4', setIsReview: setIsReview })}
                >
                    Review FP4
                </Text>
                {renderReview()}
            </View>
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

export default VerifikasiFormReview;
