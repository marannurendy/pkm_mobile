import React, { useRef } from "react";
import { StyleSheet, View, Button, Image } from "react-native";
import SignatureScreen from "react-native-signature-canvas";

const Sign = ({signature, clearSignature, onOK, onBegin, onEnd }) => {
    const ref = useRef();

    const handleOK = (signature) => {
        if (__DEV__) console.log(signature);
        onOK(signature);
        onEnd();
    };

    const handleClear = () => {
        ref.current.clearSignature();
    };

    const handleConfirm = () => {
        if (__DEV__) console.log("end");
        ref.current.readSignature();
    };

    const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

    const renderSignature = () => {
        if (signature === '') {
            return (
                <>
                    <SignatureScreen 
                        ref={ref}
                        onOK={handleOK}
                        onBegin={onBegin}
                        onEnd={onEnd}
                        webStyle={style}
                    />
                    <View style={styles.row}>
                        <Button title="Hapus" onPress={handleClear} />
                        <Button title="Simpan" onPress={handleConfirm} />
                    </View>
                </>
            )
        }

        return (
            <>
                <Image
                    resizeMode={"contain"}
                    style={{ width: 335, height: 215 }}
                    source={{ uri: signature }}
                />
                <View style={styles.row}>
                    <Button title="Ganti" onPress={clearSignature} />
                </View>
            </>
        )
    }

    return (
        <View style={styles.container}>
            {renderSignature()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 250,
        borderWidth: 1,
        borderRadius: 6,
        marginTop: 4
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
    }
});

export default Sign;
