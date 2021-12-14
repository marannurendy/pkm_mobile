import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, Alert, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';

const dimension = Dimensions.get('screen');
const withTextInput = dimension.width - (20 * 4) + 16;

const InisiasiFormPPKelompokDetail = ({ route }) => {
    const { groupName } = route.params;
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [data, setData] = useState([
        {
            id: 1,
            name: 'Vina Rosmawaty',
            subGroup: 'KELINCI 1',
            isKK: true,
            isSK: false
        },
        {
            id: 2,
            name: 'Vivie Anggraeni',
            subGroup: 'KELINCI 1',
            isKK: false,
            isSK: true
        },
        {
            id: 3,
            name: 'Lusianawati',
            subGroup: 'KELINCI 2',
            isKK: false,
            isSK: false
        },
        {
            id: 4,
            name: 'Monalisa',
            subGroup: 'KELINCI 2',
            isKK: false,
            isSK: false
        },
        {
            id: 5,
            name: 'Miranti Ekadini',
            subGroup: 'KELINCI 2',
            isKK: false,
            isSK: true
        }
    ]);
    const [dataGroup, setDataGroup] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        generateGroupData();
    }, []);

    const generateGroupData = () => {
        let _dataGroup = data.reduce((r, a) => {
            r[a.subGroup] = [...r[a.subGroup] || [], a];
            return r;
        }, {});

        setDataGroup(_dataGroup);
        if (__DEV__) console.log('generateGroupData groupData:', _dataGroup);
    }

    const getSelected = (id) => selectedItems.includes(id);

    const selectItems = (id) => {
        if (selectedItems.includes(id)) {
            const newListItems = selectedItems.filter(
                listItem => listItem !== id
            );
            return setSelectedItems([...newListItems]);
        }
        setSelectedItems([...selectedItems, id]);
    };

    const onConfirmKKKS = (nama) => {
        Alert.alert(
            "Konfirmasi",
            `Jadikan ${nama} sebagai?`,
            [
                {
                    text: "Batal",
                    onPress: () => console.log("Ask me later pressed")
                },
                {
                    text: "Ketua Sub",
                    onPress: () => ToastAndroid.show('Berhasil Jadikan Sub KK', ToastAndroid.SHORT),
                    style: "cancel"
                },
                { 
                    text: "Ketua Kelompok", 
                    onPress: () => ToastAndroid.show('Berhasil Jadikan KK', ToastAndroid.SHORT)
                }
            ]
        );
    }

    const renderList = () => Object.keys(dataGroup).map(keyGroup => (
        <View
            style={styles.MT16}
        >
            <Text style={[styles.headerTitle, { paddingLeft: 0, marginBottom: 8 }]}>{keyGroup} ({dataGroup[keyGroup].length})</Text>
            {dataGroup[keyGroup].map((group, indexGroup) => (
                <View 
                    style={[styles.textInputContainer, { width: withTextInput, marginBottom: indexGroup === dataGroup[keyGroup].length - 1 ? 0 : 8, borderColor: 'gray' }]}
                >
                    <TouchableOpacity 
                        key={indexGroup}
                        onPress={() => selectItems(group.id)}
                    >
                        <View style={styles.checkbox}>
                            {getSelected(group.id) ? <FontAwesome5 name="check" size={16} color={colors.DEFAULT} /> : <Text>{`     `}</Text>}
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.F1} onPress={() => onConfirmKKKS(group.name)}>{group.name}</Text>
                    {group.isKK && !group.isSK && (
                        <>
                            <FontAwesome5 name="star" size={16} color={colors.OREN} />
                            <FontAwesome5 name="star" size={16} color={colors.OREN} />
                        </>
                    )}
                    {group.isSK && (
                        <>
                            <FontAwesome5 name="star" size={16} color={colors.OREN} />
                        </>
                    )}
                </View>
            ))}
        </View>
    ))

    const renderInformation = () => (
        <View style={styles.MB8}>
            <Text style={[styles.MB8]}>Informasi</Text>
            <View style={[styles.FDRow]}>
                <FontAwesome5 name="star" size={16} color={colors.OREN} />
                <FontAwesome5 name="star" size={16} color={colors.OREN} />
                <Text style={[styles.ML8]}>Ketua Kelompok</Text>
            </View>
            <View style={[styles.FDRow, styles.MT8]}>
                <FontAwesome5 name="star" size={16} color={colors.OREN} />
                <Text style={[styles.ML8]}>Sub Ketua Kelompok</Text>
            </View>
        </View>
    )

    const renderMain = () => (
        <View style={[styles.F1, styles.P16]}>
            {renderInformation()}
            {renderList()}
        </View>
    )

    const renderButton = () => (
        <View style={[styles.FDRow, styles.P16]}>
            <View style={styles.F1} />
            <TouchableOpacity
                onPress={() => navigation.navigate('InisiasiFormPPKelompokSub')}
            >
                <View style={[styles.buttonSubmitContainer, { backgroundColor: colors.MEDIUM_SEA_GREEN, padding: 8, paddingHorizontal: 16 }]}>
                    <FontAwesome5 name="plus" size={35} color={colors.PUTIH} />
                </View>
            </TouchableOpacity>
        </View>
    )

    const renderBody = () => (
        <View style={styles.bodyContainer}>
            {renderMain()}
            {renderButton()}
        </View>
    )

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
                <Text style={{ color: colors.PUTIH }}>{groupName}</Text>
            </View>
        </ImageBackground>
    )

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}
            {renderBody()}
        </View>
    )
}

export default InisiasiFormPPKelompokDetail;
