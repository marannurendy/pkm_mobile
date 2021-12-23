import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    Text,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const colors = {
    HITAM: '#000',
    PUTIH: '#FFF',
    DEFAULT: '#0D67B2'
}

export default({
    title = 'Pencarian',
    placeholderTitle = 'Cari nama prospek',
    visible,
    onDismiss,
    datas = [],
    selectedItems = [],
    doSearch = null,
    doSubmit = null
}) => {
    const [keyword, setKeyword] = useState('');
    const [selectedItemsProspek, setSelectedItemsProspek] = useState(selectedItems);

    const getSelectedProspek = propspek => selectedItemsProspek.includes(JSON.stringify(propspek));

    const selectItemsProspek = prospek => {
        if (selectedItemsProspek.includes(JSON.stringify(prospek))) {
            const newListItems = selectedItemsProspek.filter(
                listItem => listItem !== JSON.stringify(prospek)
            );
            return setSelectedItemsProspek([...newListItems]);
        }
        setSelectedItemsProspek([...selectedItemsProspek, JSON.stringify(prospek)]);
    };

    useEffect(() => {
        setSelectedItemsProspek(selectedItems);
    }, [selectedItems]);

    const header = () => (
        <View
            style={
                {
                    flexDirection: 'row',
                    marginBottom: 16,
                    alignItems: 'center'
                }
            }
        >
            <Text style={{ flex: 1, fontSize: 18 }}>{title}</Text>
            <FontAwesome5 name="times-circle" size={22} color="#2e2e2e" onPress={() => onDismiss()} />
        </View>
    )

    const search = () => (
        <View
            style={
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1, 
                    borderColor: colors.HITAM,
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    marginBottom: 12
                }
            }
        >
            <FontAwesomeIcon name="search" size={18} color={colors.HITAM} />
            <TextInput 
                style={
                    {
                        flex: 1,
                        marginLeft: 8,
                        height: 36
                    }
                }
                placeholder={placeholderTitle}
                onChangeText={(text) => setKeyword(text)}
                value={keyword}
                returnKeyType="done"
                onSubmitEditing={() => doSearch(keyword)}
            />
        </View>
    )

    const renderProspekResultList = () => {
        if (datas.length === 0) {
            return (
                <Text>Data kosong</Text>
            )
        }

        return datas.map((item, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => selectItemsProspek(item)}
            >
                <View
                    style={
                        {
                            flexDirection: 'row',
                            marginBottom: 12
                        }
                    }
                >
                    <View style={
                        [
                            styles.checkbox,
                            {
                                backgroundColor: getSelectedProspek(item) ? colors.DEFAULT : colors.PUTIH
                            }
                        ]
                    }>
                        {getSelectedProspek(item) ? <FontAwesomeIcon name="check" size={16} color={colors.PUTIH} /> : <Text>{`     `}</Text>}
                    </View>
                    <Text style={{ flex: 1 }} numberOfLines={1}>{item.Nama}</Text>
                </View>
            </TouchableOpacity>
        ))
    }

    const body = () => (
        <View style={{ flex: 1 }}>
            {search()}
            <ScrollView>
                {renderProspekResultList()}
                <View style={{ backgroundColor: 'orange', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, color: 'white' }}>"Jika data tidak ada silahkan cari berdasarkan nama. (List hanya menampilkan data per 100)"</Text>
                </View>
            </ScrollView>
            <View 
                style={
                    {
                        borderWidth: 1,
                        height: 1,
                        borderColor: 'whitesmoke'
                    }
                }
            />
            {button()}
        </View>
    )

    const button = () => (
        <TouchableOpacity
            onPress={() => doSubmit(selectedItemsProspek)}
            style={
                {
                    backgroundColor: colors.DEFAULT,
                    width: 60,
                    padding: 8,
                    borderRadius: 8,
                    marginTop: 8
                }
            }
        >
            <Text style={{ color: colors.PUTIH, textAlign: 'center' }}>OK</Text>
        </TouchableOpacity>
    )

    return (
        <Modal            
            animationType={"fade"}  
            transparent={true}  
            visible={visible}  
            onRequestClose={() =>{ console.log("Modal has been closed.") } }
            KeyboardSpacer
        >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.modal}>  
                    <View style={styles.container}>
                        {header()}
                        {body()}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    container: {
        width: windowWidth - 32,
        height: 450,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 4,
    },
    checkbox: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        marginRight: 8,
        borderWidth: 1,
        borderColor: colors.HITAM,
        borderRadius: 4
    }
});
