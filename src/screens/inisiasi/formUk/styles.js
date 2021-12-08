import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

const dimension = Dimensions.get('screen');

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#ECE9E4",
        flex: 1
    },
    bodyContainer: {
        flex: 1,
        marginTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginHorizontal: 20,
        backgroundColor: 'white'
    },
    bodyTitle: {
        fontSize: 25, 
        fontWeight: 'bold', 
        margin: 20
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 40,
        alignItems: "center",
        paddingHorizontal: 20
    },
    headerBoxImageBackground: {
        height: dimension.height / 5,
        marginHorizontal: 30, 
        borderRadius: 20, 
        marginTop: 30
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
        borderRadius: 10
    },
    textInputContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1, 
        paddingVertical: 5,
        paddingHorizontal: 10, 
        borderRadius: 10,
        width: dimension.width / 3
    },
    textInput: {
        fontSize: 15, 
        color: "#545454"
    },
    buttonSubmitContainer: {
        backgroundColor: 'blue', 
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
        borderColor: 'blue', 
        padding: 8
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
    spaceGray: {
        borderWidth: 3,
        borderColor: 'gray'
    },
    F1 : {
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
