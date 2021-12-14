import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';

const dimension = Dimensions.get('screen');

const InisiasiFormPPKelompokIntro = ({ route }) => {
    const navigation = useNavigation();

    const renderHeader = () => (
        <ImageBackground source={require("../../../../assets/Image/Banner.png")} style={styles.containerImageBackground} imageStyle={{ borderRadius: 20 }}>
            <View style={styles.headerContainer}> 
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.headerButton}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    <Text style={styles.headerTitle}>KELOMPOK</Text>
                </TouchableOpacity>
            </View> 
        </ImageBackground>
    )

    const renderButton = () => (
        <View style={styles.FDRow}>
            <View style={styles.F1} />
            <TouchableOpacity
                onPress={() => navigation.navigate('InisiasiFormPPKelompokList')}
                style={styles.P16}
            >
                <View
                    style={
                        {
                            backgroundColor: colors.DEFAULT,
                            padding: 12,
                            borderRadius: 6,
                            paddingHorizontal: 32
                        }
                    }
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>OK</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            <View style={[styles.F1, styles.P16]}>
                <Text style={{ textDecorationLine: 'underline', textAlign: 'center', fontSize: 16 }}>Pembuatan Kelompok</Text>
                <View style={[styles.FDRow, styles.MT16]}>
                    <Text style={{ width: 15 }}>1.</Text>
                    <Text style={styles.F1}>Setiap kelompok minimal beranggotakan 7 orang.</Text>
                </View>
                <View style={[styles.FDRow, styles.MT2]}>
                    <Text style={{ width: 15 }}>2.</Text>
                    <Text style={styles.F1}>Setiap kelompok wajib mempunyai satu ketua kelompok yang dipilih berdasarkan persetujuan anggota kelompok.</Text>
                </View>
                <View style={[styles.FDRow, styles.MT2]}>
                    <Text style={{ width: 15 }}>3.</Text>
                    <Text style={styles.F1}>Setiap kelompok minimal mempunyai dua sub kelompok, yang masing-masing dikoordinasikan oleh ketua sub kelompok.</Text>
                </View>
                <View style={[styles.FDRow, styles.MT2]}>
                    <Text style={{ width: 15 }}>4.</Text>
                    <Text style={styles.F1}>Ketua kelompok tidak boleh merangkap sebagai ketua sub kelompok.</Text>
                </View>
                <View style={[styles.FDRow, styles.MT2]}>
                    <Text style={{ width: 15 }}>5.</Text>
                    <Text style={styles.F1}>Hubungan persaudaraan dalam sub kelompok data di jelaskan sebagai berikut</Text>
                </View>
                <View style={[styles.FDRow, styles.MT2]}>
                    <Text style={{ width: 15 }}>{``}</Text>
                    <View style={styles.F1}>
                        <View style={[styles.FDRow, styles.MT2]}>
                            <Text style={{ width: 20 }}>{`5.1`}</Text>
                            <Text>Kelompok yang terdiri dari 2 sub, diperkenankan beranggotakan maksimal 2 pasang saudara</Text>
                        </View>
                        <View style={[styles.FDRow, styles.MT2]}>
                            <Text style={{ width: 20 }}>{`5.2`}</Text>
                            <Text>Kelompok yang terdiri dari 3 - 4 sub, diperkenankan beranggotakan maksimal 3 pasang saudara</Text>
                        </View>
                        <View style={[styles.FDRow, styles.MT2]}>
                            <Text style={{ width: 20 }}>{`5.3`}</Text>
                            <Text>Kelompok yang terdiri dari 5 - 6 sub, diperkenankan beranggotakan maksimal 5 pasang saudara</Text>
                        </View>
                    </View>
                </View>
            </View>
            {renderButton()}
        </View>
    )

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
        </View>
    )
}

export default InisiasiFormPPKelompokIntro;
