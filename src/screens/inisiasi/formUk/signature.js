import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SignatureScreen from "react-native-signature-canvas";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';

const InisiasiFormUKSignatureScreen = (props) => {
    const ref = useRef();
    const navigation = useNavigation();

    const handleOK = (signature) => {
        props.route.params.onSelectSign(props.route.params.key, signature);
        navigation.goBack();
    };

    const handleEmpty = () => {
        
    };

    const header = () => (
        <View style={styles.headerContainer}>
            <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={styles.headerButton}
            >
                <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                <Text style={styles.headerTitle}>Kembali</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={styles.F1}>
            {header()}
            <SignatureScreen
                ref={ref}
                onOK={handleOK}
                onEmpty={handleEmpty}
            />
        </View>
    );
};

export default InisiasiFormUKSignatureScreen;
