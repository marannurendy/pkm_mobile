import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import db from "../database/Database";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

const PkmBermakna = () => {

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const getDate = await AsyncStorage.getItem('TransactionDate')

            console.log(getDate)
        })
    }, [])


    return(
        <View>
            <Text>ini halaman pkm bermakna</Text>
        </View>
    )
}

export default PkmBermakna

const styles = StyleSheet.create({

})
