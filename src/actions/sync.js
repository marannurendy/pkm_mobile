import { ApiSync, ApiSyncInisiasi, Get_Date } from "../../dataconfig";
import { ToastAndroid } from 'react-native';
import db from '../database/Database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getSyncData = (params) => new Promise((resolve) => {
    if (__DEV__) console.log('ACTIONS GET SYNC DATA PARAMS', params);

    var getListGroup = ApiSync + 'GetListGroup' + '/' + params.cabangid + '/' + params.username;
    var getListCollection = ApiSync + 'GetCollectionList' + '/' + params.cabangid + '/' + params.username;
    var queryUP = ApiSync + 'Shit' + '/' + params.cabangid + '/' + params.username;
    var getPAR = ApiSync + 'GetCollectionListPAR' + '/' + params.cabangid + '/' + params.username;
    var getPKMIndividual = ApiSync + 'GetCollectionListPKMIndividual' + '/' + params.cabangid + '/' + params.username;
    var getMasterData = ApiSyncInisiasi + 'GetMasterData/';
    if (__DEV__) console.log('ACTIONS GET SYNC DATA VARIABEL', getListGroup, getListCollection, queryUP, getPAR, getPKMIndividual, getMasterData);

    const truncat = (reject, source) => {
        if (__DEV__) console.log('ACTIONS GET SYNC DATA TRUNCAT LOADED');

        return db.transaction(
            tx => {
                tx.executeSql("DELETE FROM ListGroup")
                tx.executeSql("DELETE FROM GroupList")
                tx.executeSql("DELETE FROM UpAccountList")
                tx.executeSql("DELETE FROM PAR_AccountList")
                tx.executeSql("DELETE FROM AccountList")
                tx.executeSql("DELETE FROM Totalpkm")
                tx.executeSql("DELETE FROM pkmTransaction")
                tx.executeSql("DELETE FROM parTransaction")
                tx.executeSql("DELETE FROM DetailKehadiran")
                tx.executeSql("DELETE FROM DetailUP")
                tx.executeSql("DELETE FROM DetailPAR")
                tx.executeSql("DELETE FROM Detailpkm")
            }, function(error) {
                ToastAndroid.show("SOMETHING WENT WRONG: " + JSON.stringify(error), ToastAndroid.SHORT);
                reject('GAGAL MEMPROSES DATA ' + source);
            }, function() {
                reject('DATA KOSONG ' + source)
            }
        )
    }

    const insertListGroup = (responseJson) => new Promise((resolve, reject) => {
        if (__DEV__) console.log('ACTIONS GET SYNC DATA GROUP INSERT');
        // if (__DEV__) console.log('ACTIONS GET SYNC DATA GROUP INSERT:', responseJson);

        try {
            if(responseJson !== null) {
                let query = 'INSERT INTO GroupList (OurBranchID, GroupName, GroupID, MeetingDay, AnggotaAktif, JumlahTagihan, MeetingPlace, MeetingTime, syncby) values ';
                for (let i = 0; i < responseJson.length; i++) {
                    query = query + "('"
                    + responseJson[i].OurBranchID
                    + "','"
                    + responseJson[i].GroupName
                    + "','"
                    + responseJson[i].GroupID
                    + "','"
                    + responseJson[i].MeetingDay
                    + "','"
                    + responseJson[i].AnggotaAktif
                    + "','"
                    + responseJson[i].JumlahTagihan
                    + "','"
                    + responseJson[i].MeetingPlace
                    + "','"
                    + responseJson[i].MeetingTime
                    + "','"
                    + params.username
                    + "')";

                    if (i != responseJson.length - 1) query = query + ",";
                }
                query = query + ";";
                if (__DEV__) console.log('ACTIONS GET SYNC DATA GROUP INSERT QUERY:', query);
    
                db.transaction(
                    tx => {
                        tx.executeSql(query);
                    }, function(error) {
                        if (__DEV__) console.log('ACTIONS GET SYNC DATA GROUP INSERT TRANSACTION ERROR:', error);
                        reject('GAGAL INPUT DATA GROUP');
                    }, function() {
                        resolve('BERHASIL');
                    }
                );
                return;
            } else {
                truncat(reject, 'GROUP');
                return;
            } 
        } catch(error) {
            if (__DEV__) console.log('ACTIONS GET SYNC DATA GROUP INSERT TRANSACTION TRY CATCH ERROR:', error);
            reject('GAGAL INPUT DATA GROUP KE LOCALSTORAGE');
            return;
        }
    });

    const insertListCollection = (responseJson) => new Promise((resolve, reject) => {
        if (__DEV__) console.log('ACTIONS GET SYNC DATA COLLECTION INSERT');
        // if (__DEV__) console.log('ACTIONS GET SYNC DATA COLLECTION INSERT:', responseJson);

        try {
            if(responseJson !== null) {
                var query = 'INSERT INTO AccountList (OurBranchID, GroupName, GroupID, MeetingDay, ClientID, ClientName, AccountID, ProductID, InstallmentAmount, rill, ke, VolSavingsBal, StatusPAR, syncby) values ';
                for (let i = 0; i < responseJson.length; i++) {
                    query = query + "('"
                    + responseJson[i].OurBranchID
                    + "','"
                    + responseJson[i].GroupName
                    + "','"
                    + responseJson[i].GroupID
                    + "','"
                    + responseJson[i].MeetingDay
                    + "','"
                    + responseJson[i].ClientID
                    + "','"
                    + responseJson[i].ClientName
                    + "','"
                    + responseJson[i].AccountID
                    + "','"
                    + responseJson[i].ProductID
                    + "','"
                    + responseJson[i].InstallmentAmount
                    + "','"
                    + responseJson[i].Rill
                    + "','"
                    + responseJson[i].Ke
                    + "','"
                    + responseJson[i].VolSavingsBal
                    + "','"
                    + responseJson[i].StatusPAR
                    + "','"
                    + params.username
                    + "')";
                    
                    if (i != responseJson.length - 1) query = query + ",";
                }
                query = query + ";";
                if (__DEV__) console.log('ACTIONS GET SYNC DATA COLLECTION INSERT QUERY:', query);
    
                db.transaction(
                    tx => {
                        tx.executeSql(query);
                    }, function(error) {
                        if (__DEV__) console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION ERROR:', error);
                        reject('GAGAL INPUT DATA COLLECTION');
                    }, function() {
                        resolve('BERHASIL');
                    }
                );
                return;
            } else {
                truncat(reject, 'COLLECTION');
                return;
            } 
        } catch(error) {
            if (__DEV__) console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR:', error);
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE');
            return;
        }
    });

    const insertListUP = (responseJson) => new Promise((resolve, reject) => {
        if (__DEV__) console.log('ACTIONS GET SYNC DATA UP INSERT');
        // if (__DEV__) console.log('ACTIONS GET SYNC DATA UP INSERT:', responseJson);

        try {
            if(responseJson !== null) {
                var query = 'INSERT INTO UpAccountList (OurBranchID, ClientID, ClientName, GroupID, GroupName, MeetingDay, JumlahUP, syncby) values ';
                for (let i = 0; i < responseJson.length; i++) {
                    query = query + "('"
                    + responseJson[i].OurBranchID
                    + "','"
                    + responseJson[i].ClientID
                    + "','"
                    + responseJson[i].ClientName
                    + "','"
                    + responseJson[i].GroupID
                    + "','"
                    + responseJson[i].GroupName
                    + "','"
                    + responseJson[i].MeetingDay
                    + "','"
                    + responseJson[i].CompSavingsBal
                    + "','"
                    + username
                    + "')";

                    if (i != responseJson.length - 1) query = query + ",";
                }
                query = query + ";";
                if (__DEV__) console.log('ACTIONS GET SYNC DATA UP INSERT QUERY:', query);
    
                db.transaction(
                    tx => {
                        tx.executeSql(query);
                    }, function(error) {
                        if (__DEV__) console.log('ACTIONS GET SYNC DATA UP INSERT TRANSACTION ERROR:', error);
                        reject('GAGAL INPUT DATA UP');
                    }, function() {
                        resolve('BERHASIL');
                    }
                );
                return;
            } else {
                truncat(reject, 'UP');
                return;
            } 
        } catch(error) {
            if (__DEV__) console.log('ACTIONS GET SYNC DATA UP INSERT TRANSACTION TRY CATCH ERROR:', error);
            reject('GAGAL INPUT DATA UP KE LOCALSTORAGE');
            return;
        }
    });

    const insertListPAR = (responseJson) => new Promise((resolve, reject) => {
        if (__DEV__) console.log('ACTIONS GET SYNC DATA PAR INSERT');
        // if (__DEV__) console.log('ACTIONS GET SYNC DATA PAR INSERT:', responseJson);

        try {
            if(responseJson !== null) {
                var query = 'INSERT INTO PAR_AccountList (OurBranchID, ClientID, ClientName, AccountID, ProductID, GroupID, GroupName, ODAmount, syncby) values ';
                for (let i = 0; i < responseJson.length; i++) {
                    query = query + "('"
                    + responseJson[i].OurBranchID
                    + "','"
                    + responseJson[i].ClientID
                    + "','"
                    + responseJson[i].ClientName
                    + "','"
                    + responseJson[i].AccountID
                    + "','"
                    + responseJson[i].ProductID
                    + "','"
                    + responseJson[i].GroupID
                    + "','"
                    + responseJson[i].GroupName
                    + "','"
                    + responseJson[i].InstallmentAmount
                    + "','"
                    + username
                    + "')";

                    if (i != responseJson.length - 1) query = query + ",";
                }
                query = query + ";";
                if (__DEV__) console.log('ACTIONS GET SYNC DATA PAR INSERT QUERY:', query);
    
                db.transaction(
                    tx => {
                        tx.executeSql(query);
                    }, function(error) {
                        if (__DEV__) console.log('ACTIONS GET SYNC DATA PAR INSERT TRANSACTION ERROR:', error);
                        reject('GAGAL INPUT DATA PAR');
                    }, function() {
                        resolve('BERHASIL');
                    }
                );
                return;
            } else {
                truncat(reject, 'PAR');
                return;
            } 
        } catch(error) {
            if (__DEV__) console.log('ACTIONS GET SYNC DATA PAR INSERT TRANSACTION TRY CATCH ERROR:', error);
            reject('GAGAL INPUT DATA PAR KE LOCALSTORAGE');
            return;
        }
    });

    const fetchWaterfall = async () => {
        const responseListGroup = await fetch(getListGroup);
        const jsonListGroup = await responseListGroup.json(responseListGroup);
        await insertListGroup(jsonListGroup);
        if (__DEV__) console.log('ACTIONS GET SYNC DATA GROUP DONE');

        const responseListCollection = await fetch(getListCollection);
        const jsonCollection = await responseListCollection.json(responseListCollection);
        await insertListCollection(jsonCollection)
        if (__DEV__) console.log('ACTIONS GET SYNC DATA COLLECTION DONE');

        const responseListUP = await fetch(queryUP);
        const jsonListUP = await responseListUP.json(responseListUP);
        await insertListUP(jsonListUP)
        if (__DEV__) console.log('ACTIONS GET SYNC DATA UP DONE');

        const responseListPAR = await fetch(getPKMIndividual);
        const jsongetPAR = await responseListPAR.json(responseListPAR);
        await insertListPAR(jsongetPAR);
        if (__DEV__) console.log('ACTIONS GET SYNC DATA PAR DONE');

        const getDate = await fetch(ApiSync+Get_Date);
        const jsonGetDate = await getDate.json(getDate);
        if (__DEV__) console.log('ACTIONS GET SYNC DATE:', jsonGetDate);

        const MasterData = await fetch(getMasterData);
        const jsonMasterData = await MasterData.json(MasterData);
        if (__DEV__) console.log('ACTIONS GET SYNC MASTER DATA:', jsonMasterData);

        AsyncStorage.setItem('SyncDate', jsonGetDate.currentDate);
        AsyncStorage.setItem('TransactionDate', jsonGetDate.currentDate);
        AsyncStorage.setItem('Absent', JSON.stringify(jsonMasterData.data.absent));
        AsyncStorage.setItem('Religion', JSON.stringify(jsonMasterData.data.religion));
        AsyncStorage.setItem('LivingType', JSON.stringify(jsonMasterData.data.livingType));
        AsyncStorage.setItem('IdentityType', JSON.stringify(jsonMasterData.data.identityType));
        AsyncStorage.setItem('PartnerJob', JSON.stringify(jsonMasterData.data.partnerJob));
        AsyncStorage.setItem('DwellingCondition', JSON.stringify(jsonMasterData.data.dwellingCondition));
        AsyncStorage.setItem('ResidenceLocation', JSON.stringify(jsonMasterData.data.residenceLocation));
        AsyncStorage.setItem('PembiayaanLain', JSON.stringify(jsonMasterData.data.pembiayaanLain));
        AsyncStorage.setItem('Education', JSON.stringify(jsonMasterData.data.education));
        AsyncStorage.setItem('Product', JSON.stringify(jsonMasterData.data.product));
        AsyncStorage.setItem('EconomicSector', JSON.stringify(jsonMasterData.data.economicSector));
        AsyncStorage.setItem('RelationStatus', JSON.stringify(jsonMasterData.data.relationStatus));
        AsyncStorage.setItem('MarriageStatus', JSON.stringify(jsonMasterData.data.marriageStatus));
        AsyncStorage.setItem('HomeStatus', JSON.stringify(jsonMasterData.data.homeStatus));
        AsyncStorage.setItem('Referral', JSON.stringify(jsonMasterData.data.referral));
        AsyncStorage.setItem('TransFund', JSON.stringify(jsonMasterData.data.transFund));

        return;
    }

    resolve(fetchWaterfall());
});
