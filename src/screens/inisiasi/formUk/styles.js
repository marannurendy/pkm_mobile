import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const dimension = Dimensions.get('screen');
const windowWidth = dimension.width;

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#ECE9E4",
        flex: 1
    },
    bodyContainer: {
        flex: 1,
        marginVertical: 16,
        borderRadius: 16,
        marginHorizontal: 16,
        backgroundColor: 'white'
    },
    bodyTitle: {
        fontSize: 25, 
        fontWeight: 'bold', 
        margin: 16
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 42,
        alignItems: "center",
        paddingHorizontal: 16
    },
    headerBoxImageBackground: {
        height: dimension.height / 5,
        marginHorizontal: 32, 
        borderRadius: 16, 
        marginTop: 32
    },
    headerImageBackground: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 18,
        paddingHorizontal: 15,
        fontWeight: 'bold'
    },
    headerText: {
        marginHorizontal: 35,
        fontWeight: 'bold',
        color: '#FFF', 
        marginBottom: 5
    },
    headerButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#BCC8C6",
        borderRadius: 8
    },
    textInputContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1, 
        paddingVertical: 6,
        paddingHorizontal: 8, 
        borderRadius: 8,
        width: dimension.width / 3,
        height: 48
    },
    textInput: {
        fontSize: 15, 
        color: "#545454"
    },
    buttonSubmitContainer: {
        backgroundColor: '#0c5da0', 
        padding: 16, 
        borderRadius: 6, 
        alignItems: 'center'
    },
    buttonSubmitText: {
        color: 'white', 
        fontSize: 18
    },
    buttonContainer: {
        flexDirection:'row',
        marginVertical: 16
    },
    button: {
        borderRadius: 6, 
        borderWidth: 2, 
        borderColor: '#003049', 
        backgroundColor: '#003049',
        padding: 4
    },
    formContainerText: {
        flexDirection: 'row', 
        marginTop: 8, 
        alignContent: 'center', 
        alignItems: 'center'
    },
    note: {
        fontSize: 11,
        color: 'gray', 
        marginLeft: 16
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    checkbox: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        marginRight: 8,
        borderWidth: 1,
        borderColor: colors.HITAM,
        borderRadius: 4
    },
    spaceGray: {
        borderWidth: 3,
        borderColor: 'gray'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalBody: {
        width: windowWidth - 32,
        height: 300,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5
    },
    containerImageBackground: {
        resizeMode: "cover", 
        justifyContent: "center",
        borderRadius: 8,
        paddingVertical: 18
    },
    F1: {
        flex: 1
    },
    P2: {
        padding: 2
    },
    P4: {
        padding: 4
    },
    P8: {
        padding: 8
    },
    P16: {
        padding: 16
    },
    P32: {
        padding: 32
    },
    PV2: {
        paddingVertical: 2
    },
    PV4: {
        paddingVertical: 4
    },
    PV8: {
        paddingVertical: 8
    },
    PV16: {
        paddingVertical: 16
    },
    PH2: {
        paddingHorizontal: 2
    },
    PH4: {
        paddingHorizontal: 4
    },
    PH8: {
        paddingHorizontal: 8
    },
    PH16: {
        paddingHorizontal: 16
    },
    M2: {
        margin: 2
    },
    M4: {
        margin: 4
    },
    M8: {
        margin: 8
    },
    M16: {
        margin: 16
    },
    MT2: {
        marginTop: 2
    },
    MT4: {
        marginTop: 4
    },
    MT8: {
        marginTop: 8
    },
    MT16: {
        marginTop: 16
    },
    MB2: {
        marginBottom: 2
    },
    MB4: {
        marginBottom: 4
    },
    MB8: {
        marginBottom: 8
    },
    MB16: {
        marginBottom: 16
    },
    MB32: {
        marginBottom: 32
    },
    MR2: {
        marginRight: 2
    },
    MR4: {
        marginRight: 4
    },
    MR8: {
        marginRight: 8
    },
    MR16: {
        marginRight: 16
    },
    ML2: {
        marginLeft: 2
    },
    ML4: {
        marginLeft: 4
    },
    ML8: {
        marginLeft: 8
    },
    ML16: {
        marginLeft: 16
    },
    MH2: {
        marginHorizontal: 2
    },
    MH4: {
        marginHorizontal: 4
    },
    MH8: {
        marginHorizontal: 8
    },
    MH16: {
        marginHorizontal: 16
    },
    MV2: {
        marginHorizontal: 2
    },
    MV4: {
        marginHorizontal: 4
    },
    MV8: {
        marginHorizontal: 8
    },
    MV16: {
        marginVertical: 16
    },
    FS18: {
        fontSize: 18
    },
    FWBold: {
        fontWeight: 'bold'
    },
    FWNormal: {
        fontWeight: 'normal'
    },
    FDRow: {
        flexDirection: 'row'
    }
});

export { styles }
