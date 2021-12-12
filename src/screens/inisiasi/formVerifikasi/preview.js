import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ToastAndroid, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../formUk/styles';
import { WebView } from 'react-native-webview';

const dimension = Dimensions.get('screen');

const VerifikasiFormPreview = ({ route }) => {
    const { uriPdf } = route.params;
    const navigation = useNavigation();
    const [pdf, setPdf] = useState('');
    const [statusMounting, setStatusMounting] = useState(false);

    useEffect(() => {
        setInfo();
        check();
    }, [])

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

    const check = () => {
        setPdf(`https://drive.google.com/viewerng/viewer?embedded=true&url=${uriPdf}`);
    }

    const doSubmit = () => {
        route.params.setIsReview(true);
        navigation.goBack();
    };

    const renderLoadingView = () => {
        const dimensions = Dimensions.get('window');
        const marginTop = 0;
    
        return (
            <ActivityIndicator
                animating = {true}
                color = '#0076BE'
                size = 'large'
                hidesWhenStopped={true}
                style={{ marginTop }}
            />
        );
    }

    const renderHeader = () => (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>KEMBALI</Text>
                </TouchableOpacity>
            </View>
        </>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <WebView
                renderLoading={renderLoadingView}
                onLoad={() => setStatusMounting(true)}
                source={{ uri: pdf }}
                startInLoadingState={true}
                style={styles.F1}
            />
            {renderButton()}
        </View>
    )

    const renderButton = () => (
        <TouchableOpacity
            onPress={() => statusMounting && doSubmit()}
        >
            <View 
                style={
                    {
                        marginHorizontal: 32,
                        marginVertical: 16,
                        padding: 16,
                        backgroundColor: statusMounting ? '#003049' : 'gray',
                        borderRadius: 6
                    }
                }
            >
                <Text style={{ fontSize: 18, textAlign: 'center', color: 'white' }}>OK</Text>
            </View>
        </TouchableOpacity>
    )

    return(
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
        </View>
    )
}

export default VerifikasiFormPreview;
