import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { styles } from '../formUk/styles';
import { colors } from '../formUk/colors';

const dimension = Dimensions.get('screen');

const InisiasiFormPPKelompokSubMemberVerifikasi = ({ route }) => {
    const { value } = route.params;
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [data, setData] = useState([
        {
            id: 1,
            name: 'Sri Rahayu'
        },
        {
            id: 2,
            name: 'Sri Rezeki'
        },
        {
            id: 3,
            name: 'Umariyah'
        },
        {
            id: 4,
            name: 'Uun Widayanti'
        }
    ]);
    const [selectedItems, setSelectedItems] = useState([]);

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

    const renderList = () => data.map((x, i) => (
        <TouchableOpacity
            key={i}
            onPress={() => selectItems(x.id)}
            style={[styles.MB16]}
        >
            <View style={[styles.FDRow, styles.P16, { borderWidth: 1, borderRadius: 8, alignItems: 'center' }]}>
                <View style={styles.checkbox}>
                    {getSelected(x.id) ? <FontAwesome5 name="check" size={16} color={colors.DEFAULT} /> : <Text>{`     `}</Text>}
                </View>
                <Text style={styles.F1}>{x.name}</Text>
                <Text>Gang Kelinci</Text>
            </View>
        </TouchableOpacity>
    ))

    const renderMain = () => (
        <View style={[styles.F1, styles.P16]}>
            <ScrollView>
                {renderList()}
            </ScrollView>
        </View>
    )

    const renderButton = () => (
        <View style={[styles.FDRow, styles.P16]}>
            <TouchableOpacity
                onPress={() => alert(JSON.stringify(selectedItems))}
                style={[styles.F1, styles.MR16]}
            >
                <View style={styles.buttonSubmitContainer}>
                    <Text style={styles.buttonSubmitText}>TAMBAH</Text>
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
                <Text style={{ color: colors.PUTIH }}>{value}</Text>
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

export default InisiasiFormPPKelompokSubMemberVerifikasi;
