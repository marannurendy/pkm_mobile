import { ApiSync, ApiSyncInisiasi, Get_Date } from "../../dataconfig";
import { ToastAndroid, Alert } from 'react-native';
import db from '../database/Database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { fetchWithTimeout } from '../utils/Functions'

export const getSyncData = (params) => new Promise((resolve) => {
    if (__DEV__) console.log('ACTIONS GET SYNC DATA PARAMS', params);

    var getListGroup = ApiSync + 'GetListGroup' + '/' + params.cabangid + '/' + params.username;
    var getListCollection = ApiSync + 'GetCollectionList' + '/' + params.cabangid + '/' + params.username;
    var queryUP = ApiSync + 'Shit' + '/' + params.cabangid + '/' + params.username;
    var getPAR = ApiSync + 'GetCollectionListPAR' + '/' + params.cabangid + '/' + params.username;
    var getPKMIndividual = ApiSync + 'GetCollectionListPKMIndividual' + '/' + params.cabangid + '/' + params.username;
    var getMasterData = ApiSyncInisiasi + 'GetMasterData/' + params.cabangid;
    var postGetSosialisasiMobile = ApiSyncInisiasi + 'GetSosialisasiMobile';
    var getDataPencairan = ApiSyncInisiasi + 'GetPencairanMobile/'+ params.cabangid + '/undefined'; 
    if (__DEV__) console.log('ACTIONS GET SYNC DATA VARIABEL', getListGroup, getListCollection, queryUP, getPAR, getPKMIndividual, getMasterData);

    const truncat = (reject, source) => {
        if (__DEV__) console.log('ACTIONS GET SYNC DATA TRUNCAT LOADED');

        return db.transaction(
            tx => {
                tx.executeSql("DELETE FROM ListGroup");
                tx.executeSql("DELETE FROM GroupList");
                tx.executeSql("DELETE FROM UpAccountList");
                tx.executeSql("DELETE FROM PAR_AccountList");
                tx.executeSql("DELETE FROM AccountList");
                tx.executeSql("DELETE FROM Totalpkm");
                tx.executeSql("DELETE FROM pkmTransaction");
                tx.executeSql("DELETE FROM parTransaction");
                tx.executeSql("DELETE FROM DetailKehadiran");
                tx.executeSql("DELETE FROM DetailUP");
                tx.executeSql("DELETE FROM DetailPAR");
                tx.executeSql("DELETE FROM Detailpkm");
                tx.executeSql("DELETE FROM Table_Pencairan");
                tx.executeSql("DELETE FROM Table_Pencairan_Nasabah");
                tx.executeSql("DELETE FROM Table_Pencairan_Post");
            }, function(error) {
                ToastAndroid.show("SOMETHING WENT WRONG: " + JSON.stringify(error), ToastAndroid.SHORT);
                reject('GAGAL MEMPROSES DATA ' + source);
            }, function() {
                reject('DATA KOSONG ' + source)
            }
        )
    }

    const clearData = () => new Promise((resolve, reject) => {
        resolve(truncat(reject, 'GROUP'));
    });

    const insertKelompokPencairan = (responseJson) => new Promise((resolve, reject) => {
        if (__DEV__) console.log('ACTIONS GET SYNC DATA PENCAIRAN INSERT', responseJson.data);
        const groupPencairan = responseJson.data?.pencairan || [];
        const ListPencairan = responseJson.data?.pencairan_nasabah || [];

        try {
            if(groupPencairan.length  > 0 && ListPencairan.length > 0) {
                let query = 'INSERT INTO Table_Pencairan (kelompok_Id, Nama_Kelompok, Jumlah_Kelompok, syncby) values ';
                let querylistPencairan = 'INSERT INTO Table_Pencairan_Nasabah (' +
                    'Alamat_Domisili,' +
                    'Angsuran_Per_Minggu, ' +
                    'Foto_Pencairan, ' +
                    'Jasa, ' +
                    'Jenis_Pembiayaan, ' +
                    'Jumlah_Pinjaman, ' +
                    'Kelompok_ID, ' +
                    'LRP_TTD_AO, ' +
                    'LRP_TTD_Nasabah, ' +
                    'Nama_Kelompok, ' +
                    'Nama_Penjamin, ' +
                    'Nama_Prospek, ' +
                    'Nomor_Identitas, ' +
                    'TTD_KC, ' +
                    'TTD_KK, ' +
                    'TTD_KSK, ' +
                    'TTD_Nasabah, ' +
                    'TTD_Nasabah_2, ' +
                    'Term_Pembiayaan, ClientID, Nama_Tipe_Pencairan, ID_Prospek, syncby) values ';

                for (let i = 0; i < groupPencairan.length; i++) {
                    const queryDeletePencairan = "DELETE FROM Table_Pencairan WHERE kelompok_Id = '" + groupPencairan[i].Kelompok_ID + "'";
                    db.transaction(
                        tx => {
                            tx.executeSql(queryDeletePencairan, [], (tx, results) => {
                                if (__DEV__) console.log(`${queryDeletePencairan} RESPONSE:`, results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log(`${queryDeletePencairan} ERROR:`, error);
                        }, function() {}
                    );
                    query = query + "('"
                    + groupPencairan[i].Kelompok_ID
                    + "','"
                    + groupPencairan[i].Nama_Kelompok
                    + "','"
                    + groupPencairan[i].Jml_ID_Prospek
                    + "','"
                    + params.username
                    + "')";

                    if (i != groupPencairan.length - 1) query = query + ",";
                }

                for (let i = 0; i < ListPencairan.length ; i++) {
                    const queryDeletePencairanNasabah = "DELETE FROM Table_Pencairan_Nasabah WHERE ID_Prospek = '" + ListPencairan[i].ID_Prospek + "'";
                    db.transaction(
                        tx => {
                            tx.executeSql(queryDeletePencairanNasabah, [], (tx, results) => {
                                if (__DEV__) console.log(`${queryDeletePencairanNasabah} RESPONSE:`, results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log(`${queryDeletePencairanNasabah} ERROR:`, error);
                        }, function() {}
                    );
                    querylistPencairan = querylistPencairan + "('"
                    + ListPencairan[i].Alamat_Domisili
                    + "','"
                    + ListPencairan[i].Angsuran_Per_Minggu
                    + "','"
                    + null
                    + "','"
                    + ListPencairan[i].Jasa
                    + "','"
                    + ListPencairan[i].Nama_Produk
                    + "','"
                    + ListPencairan[i].Jumlah_Pinjaman
                    + "','"
                    + ListPencairan[i].Kelompok_ID
                    + "','"
                    + null
                    + "','"
                    + null
                    + "','"
                    + ListPencairan[i].Nama_Kelompok
                    + "','"
                    + ListPencairan[i].Nama_Penjamin
                    + "','"
                    + ListPencairan[i].Nama_Prospek
                    + "','"
                    + ListPencairan[i].Nomor_Identitas
                    + "','"
                    + null
                    + "','"
                    + null
                    + "','"
                    + null
                    + "','"
                    + null
                    + "','"
                    + null
                    + "','"
                    + ListPencairan[i].Term_Pembiayaan
                    + "','"
                    + ListPencairan[i].ClientID
                    + "','"
                    + ListPencairan[i].Nama_Tipe_Pencairan
                    + "','"
                    + ListPencairan[i].ID_Prospek
                    + "','"
                    + params.username
                    + "')";

                    if (i != ListPencairan.length - 1) querylistPencairan = querylistPencairan + ",";
                }

                query = query + ";";
                querylistPencairan = querylistPencairan + ";";
                //if (__DEV__) console.log('ACTIONS GET SYNC DATA PENCAIRAN INSERT QUERY:', querylistPencairan);
    
                db.transaction(
                    tx => { tx.executeSql(query); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET DATA PENCAIRAN INSERT TRANSACTION ERROR:', error);
                        reject('GAGAL INPUT DATA GROUP');
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET DATA PENCAIRAN INSERT TRANSACTION DONE');
                        // resolve('BERHASIL');
                    }
                );
                db.transaction(
                    tx => { tx.executeSql(querylistPencairan); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET DATA PENCAIRAN LIST INSERT TRANSACTION ERROR:', error);
                        reject('GAGAL INPUT DATA GROUP');
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET DATA PENCAIRAN LIST INSERT TRANSACTION DONE');
                        // resolve('BERHASIL');
                    }
                );
                return resolve('BERHASIL');
            } else {
                // truncat(reject, 'GROUP');
                resolve('BERHASIL');
                return;
            } 
        } catch(error) {
            if (__DEV__) console.log('ACTIONS GET SYNC DATA PENCAIRAN INSERT TRANSACTION TRY CATCH ERROR:', error);
            reject('GAGAL INPUT DATA PENCAIRAN KE LOCALSTORAGE');
            return;
        }
    });

    const insertListGroup = (responseJson) => new Promise((resolve, reject) => {
        if (__DEV__) console.log('ACTIONS GET SYNC DATA GROUP INSERT');
        // if (__DEV__) console.log('ACTIONS GET SYNC DATA GROUP INSERT:', responseJson);

        try {
            if(responseJson !== null) {
                let query = 'INSERT OR IGNORE INTO GroupList (OurBranchID, GroupName, GroupID, MeetingDay, AnggotaAktif, JumlahTagihan, MeetingPlace, MeetingTime, syncby) values ';
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

//Rendy                // if (__DEV__) console.log('ACTIONS GET SYNC DATA GROUP INSERT QUERY:', query);
    
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
                // truncat(reject, 'GROUP');
                resolve('BERHASIL');
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
                var query = 'INSERT OR IGNORE INTO AccountList (OurBranchID, GroupName, GroupID, MeetingDay, ClientID, ClientName, AccountID, ProductID, InstallmentAmount, rill, ke, VolSavingsBal, StatusPAR, totalSetor, syncby) values ';
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
                    + responseJson[i].InstallmentAmount
                    + "','"
                    + params.username
                    + "')";
                    
                    if (i != responseJson.length - 1) query = query + ",";
                }
                query = query + ";";

//Rendy                // if (__DEV__) console.log('ACTIONS GET SYNC DATA COLLECTION INSERT QUERY:', query);
    
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
                // truncat(reject, 'COLLECTION');
                resolve('BERHASIL');
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
                var query = 'INSERT OR IGNORE INTO UpAccountList (OurBranchID, ClientID, ClientName, GroupID, GroupName, MeetingDay, JumlahUP, syncby) values ';
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
                    + params.username
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
                // truncat(reject, 'UP');
                resolve('BERHASIL');
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
                var query = 'INSERT OR IGNORE INTO PAR_AccountList (OurBranchID, ClientID, ClientName, AccountID, ProductID, GroupID, GroupName, ODAmount, syncby) values ';
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
                    + params.username
                    + "')";

                    if (i != responseJson.length - 1) query = query + ",";
                }
                query = query + ";";

//Rendy                // if (__DEV__) console.log('ACTIONS GET SYNC DATA PAR INSERT QUERY:', query);
    
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
                // truncat(reject, 'PAR');
                resolve('BERHASIL');
                return;
            } 
        } catch(error) {
            if (__DEV__) console.log('ACTIONS GET SYNC DATA PAR INSERT TRANSACTION TRY CATCH ERROR:', error);
            reject('GAGAL INPUT DATA PAR KE LOCALSTORAGE');
            return;
        }
    });

    const insertGetSosialisasiMobile = (responseJson) => new Promise((resolve, reject) => {
        // if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT');
        // if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT', responseJson);

        const sosialisai = responseJson.data?.sosialisai || [];
        const uk = responseJson.data?.uk || [];
        const uk_detail = responseJson.data?.uk_detail || [];
        const uk_client_data = responseJson.data?.uk_client_data || [];
        const pp_kelompok = responseJson.data?.pp_kelompok || [];
        const pp_2_kelompok = responseJson.data?.pp_2_kelompok || [];
        const pp_3_kelompok = responseJson.data?.pp_3_kelompok || [];
        const persetujuan_pembiayaan_kelompok = responseJson.data?.persetujuan_pembiayaan_kelompok || [];
        const persetujuan_pembiayaan_client_kelompok = responseJson.data?.persetujuan_pembiayaan_client_kelompok || [];

        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT sosialisai:', sosialisai.length);
        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT uk:', uk.length);
        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT uk_detail:', uk_detail.length);
        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT uk_client_data:', uk_client_data.length);
        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT pp_kelompok:', pp_kelompok.length);
        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT pp_2_kelompok:', pp_2_kelompok.length);
        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT pp_3_kelompok:', pp_3_kelompok.length);
        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT persetujuan_pembiayaan_kelompok:', persetujuan_pembiayaan_kelompok.length);
        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT persetujuan_pembiayaan_client_kelompok:', persetujuan_pembiayaan_client_kelompok.length);
        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT persetujuan_pembiayaan_client_kelompok:', persetujuan_pembiayaan_client_kelompok.length);

        let mappingProspek = [];

        if (uk_client_data.length > 0) {
            try {
                var query = 'INSERT INTO Sosialisasi_Database (id, tanggalInput, sumberId, namaCalonNasabah, nomorHandphone, status, tanggalSosialisas, lokasiSosialisasi, type, verifikasiTanggal, verifikasiStatus, verifikasiReason, kelompokID, subKelompok, id_prospek) values ';
                // var queryUKMaster = 'INSERT INTO Table_UK_Master (namaNasabah, status, idSosialisasiDatabase, id_prospek) values ';
                var queryUKDataDiri = 'INSERT INTO Table_UK_DataDiri (foto_Kartu_Identitas, jenis_Kartu_Identitas, nomor_Identitas, nama_lengkap, tempat_lahir, tanggal_Lahir, status_Perkawinan, alamat_Identitas, alamat_Domisili, foto_Surat_Keterangan_Domisili, provinsi, kabupaten, kecamatan, kelurahan, foto_kk, no_kk, nama_ayah, nama_gadis_ibu, no_tlp_nasabah, jumlah_anak, pendidikan_anak, jumlah_tanggungan, status_rumah_tinggal, lama_tinggal, nama_suami, usaha_pekerjaan_suami, jumlah_tenaga_kerja_suami, foto_ktp_suami, suami_diluar_kota, status_hubungan_keluarga, nama_penjamin, foto_ktp_penjamin, longitude, latitude, agama, status_Verif, status_UK_Pass, status_Verifikasi_Pass, id_prospek, is_pernyataan_dibaca, lokasi_sosialisasi, is_alamat_domisili_sesuai_ktp, siklus_pembiayaan, idSosialisasiDatabase, created_by) values ';
                var queryUKPembiayaan = 'INSERT INTO Table_UK_ProdukPembiayaan (nama_lengkap, nomor_Identitas, jenis_Pembiayaan, nama_Produk, produk_Pembiayaan, jumlah_Pinjaman, term_Pembiayaan, kategori_Tujuan_Pembiayaan, tujuan_Pembiayaan, type_Pencairan, frekuensi_Pembayaran, status_Rekening_Bank, nama_Bank, no_Rekening, pemilik_Rekening, id_prospek, idSosialisasiDatabase) values ';
                var queryUKKondisiRumah = 'INSERT INTO Table_UK_KondisiRumah (nama_lengkap, nomor_Identitas, luas_Bangunan, kondisi_Bangunan, jenis_Atap, dinding, lantai, sanitasi_Akses_AirBersih, sanitasi_KamarMandi, id_prospek, idSosialisasiDatabase) values ';
                var queryUKSektorEkonomi = 'INSERT INTO Table_UK_SektorEkonomi (nama_lengkap, nomor_Identitas, sektor_Ekonomi, sub_Sektor_Ekonomi, jenis_Usaha, id_prospek, idSosialisasiDatabase) values ';
                var queryUKPendapatanNasabah = 'INSERT INTO Table_UK_PendapatanNasabah (nama_lengkap, nomor_Identitas, pendapatan_Kotor_perhari, pengeluaran_Keluarga_Perhari, pendapatan_Bersih_Perhari, jumlah_Hari_Usaha_Perbulan, pendapatan_Bersih_Perbulan, pendapatan_Bersih_Perminggu, pembiayaan_Dari_Lembaga, Pembiayaan_Dari_LembagaLain, Pembiayaan_Dari_LembagaLainFreetext, jumlah_Angsuran, pendapatanSuami_Kotor_Perhari, pendapatanSuami_Pengeluaran_Keluarga_Perhari, pendapatanSuami_Pendapatan_Bersih_Perhari, pendapatanSuami_jumlah_Hari_Usaha_Perbulan, pendapatanSuami_pendapatan_Bersih_Perbulan, pendapatanSuami_pendapatan_Bersih_Perminggu, id_prospek, idSosialisasiDatabase) values ';
                var queryUKPermohonanPembiayaan = 'INSERT INTO Table_UK_PermohonanPembiayaan (nama_lengkap, nomor_Identitas, produk_Pembiayaan, jumlah_Pembiayaan_Diajukan, jangka_Waktu, frekuensi_Pembiayaan, tanda_Tangan_AOSAO, tanda_Tangan_Nasabah, tanda_Tangan_SuamiPenjamin, tanda_Tangan_Ketua_SubKelompok, tanda_Tangan_Ketua_Kelompok, nama_tanda_Tangan_Nasabah, nama_tanda_Tangan_SuamiPenjamin, nama_tanda_Tangan_Ketua_SubKelompok, nama_tanda_Tangan_Ketua_Kelompok, id_prospek, idSosialisasiDatabase) values ';
                var queryUKDisiplinNasabah = 'INSERT INTO Table_UK_DisipinNasabah (nama_lengkap, kehadiran_pkm, angsuran_pada_saat_pkm, id_prospek, idSosialisasiDatabase) values ';
                var queryPPKelompok = 'INSERT OR IGNORE INTO Table_PP_ListNasabah ( kelompok_Id, kelompok, subKelompok_Id, subKelompok, Nasabah_Id, Nama_Nasabah, is_Ketua_Kelompok, is_KetuaSubKelompok, lokasiSos, branchid, syncBy, jumlah_pembiayaan, jangka_waktu, jasa, Angsuran_per_minggu, status, isSisipan, Nama_TTD_AO ) values ';
                var queryPPGroup = 'INSERT OR IGNORE INTO Table_PP_Kelompok ( kelompok_Id, kelompok, branchid, isSisipan, status ) values ';

                var queryPPSisipan = 'INSERT OR IGNORE INTO Table_PP_Kelompok ( kelompok_Id, kelompok, branchid, isSisipan, status ) values ';
                
                var queryPPKelompokTahapLanjut = 'INSERT OR IGNORE INTO Table_PP_ListNasabah ( kelompok_Id, kelompok, subKelompok_Id, Nasabah_Id, Nama_Nasabah, is_Ketua_Kelompok, is_KetuaSubKelompok, lokasiSos, branchid, syncBy, jumlah_pembiayaan, jangka_waktu, jasa, Angsuran_per_minggu, status, isTahapLanjut, Nama_TTD_AO ) values ';
                var queryPPSisipanTahapLanjut = 'INSERT OR IGNORE INTO Table_PP_Kelompok ( kelompok_Id, kelompok, branchid, isTahapLanjut, status ) values ';

                for (let i = 0; i < uk_client_data.length; i++) {
                    let uniqueNumber = (new Date().getTime()).toString(36);
                    let namaNasabah = uk_client_data[i].Nama_Lengkap || '';

                    let isVerifPass = "";
                    if (uk_client_data[i].PostStatus === 1 || uk_client_data[i].PostStatus === 2 || uk_client_data[i].PostStatus === 3) isVerifPass = "1";
                    else isVerifPass = uk_client_data[i].Is_VerifPass;

                    let isAlamatDomisiliSesuaiKtp = "0"
                    if (uk_client_data[i].Alamat_Sesuai_ID === uk_client_data[i].Alamat_Domisili) isAlamatDomisiliSesuaiKtp = "1";

                    let Pendidikan_Anak = "0";
                    if (uk_client_data[i].Pendidikan_Anak && typeof uk_client_data[i].Pendidikan_Anak !== 'undefined') Pendidikan_Anak = uk_client_data[i].Pendidikan_Anak;


                    const key_dataPenjamin = `formUK_dataPenjamin_${uk_client_data[i].ID_Prospek}_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_dataSuami = `formUK_dataSuami_${uk_client_data[i].ID_Prospek}_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_kartuKeluarga = `formUK_kartuKeluarga_${uk_client_data[i].ID_Prospek}_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_keteranganDomisili = `formUK_keteranganDomisili_${uk_client_data[i].ID_Prospek}_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_kartuIdentitas = `formUK_kartuIdentitas_${uk_client_data[i].ID_Prospek}_${namaNasabah.replace(/\s+/g, '')}`;

                    const key_tandaTanganAOSAO = `formUK_tandaTanganAOSAO_${uk_client_data[i].ID_Prospek}_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_tandaTanganNasabah = `formUK_tandaTanganNasabah_${uk_client_data[i].ID_Prospek}_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_tandaTanganSuamiPenjamin = `formUK_tandaTanganSuamiPenjamin_${uk_client_data[i].ID_Prospek}_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_tandaTanganKetuaSubKemlompok = `formUK_tandaTanganKetuaSubKemlompok_${uk_client_data[i].ID_Prospek}_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_tandaTanganKetuaKelompok = `formUK_tandaTanganKetuaKelompok_${uk_client_data[i].ID_Prospek}_${namaNasabah.replace(/\s+/g, '')}`;

                    AsyncStorage.setItem(key_dataPenjamin, 'data:image/jpeg;base64,' + uk_client_data[i].Foto_KTP_Penjamin);
                    AsyncStorage.setItem(key_kartuIdentitas, 'data:image/jpeg;base64,' + uk_client_data[i].Foto_Kartu_Identitas);
                    AsyncStorage.setItem(key_dataSuami, 'data:image/jpeg;base64,' + uk_client_data[i].Foto_KTP_Suami);
                    AsyncStorage.setItem(key_kartuKeluarga, 'data:image/jpeg;base64,' + uk_client_data[i].Foto_KK);
                    AsyncStorage.setItem(key_keteranganDomisili, 'data:image/jpeg;base64,' + uk_client_data[i].Foto_Suket_Domisili);

                    AsyncStorage.setItem(key_tandaTanganAOSAO, 'data:image/jpeg;base64,' + uk_client_data[i].TTD_AO);
                    AsyncStorage.setItem(key_tandaTanganNasabah, 'data:image/jpeg;base64,' + uk_client_data[i].TTD_Nasabah);
                    AsyncStorage.setItem(key_tandaTanganSuamiPenjamin, 'data:image/jpeg;base64,' + uk_client_data[i].TTD_Penjamin);
                    AsyncStorage.setItem(key_tandaTanganKetuaSubKemlompok, 'data:image/jpeg;base64,' + uk_client_data[i].TTD_KSK);
                    AsyncStorage.setItem(key_tandaTanganKetuaKelompok, 'data:image/jpeg;base64,' + uk_client_data[i].TTD_KK);

                    // if (__DEV__) console.log('fotoDataPenjamin :', key_dataPenjamin, uk_client_data[i].Foto_KTP_Penjamin);
                    // if (__DEV__) console.log('fotoDataSuami :', key_dataSuami, uk_client_data[i].Foto_KTP_Suami);
                    // if (__DEV__) console.log('fotoKartuKeluarga :', key_kartuKeluarga, uk_client_data[i].Foto_KK);
                    // if (__DEV__) console.log('fotoKeteranganDomisili :', key_keteranganDomisili, uk_client_data[i].Foto_Suket_Domisili);
                    // if (__DEV__) console.log('fotoKartuIdentitas :', key_kartuIdentitas, uk_client_data[i].Foto_Kartu_Identitas);

                    // if (__DEV__) console.log('tandaTanganAOSAO :', key_tandaTanganAOSAO, uk_client_data[i].TTD_AO);
                    // if (__DEV__) console.log('tandaTanganNasabah :', key_tandaTanganNasabah, uk_client_data[i].TTD_Nasabah);
                    // if (__DEV__) console.log('tandaTanganSuamiPenjamin :', key_tandaTanganSuamiPenjamin, uk_client_data[i].TTD_Penjamin);
                    // if (__DEV__) console.log('tandaTanganKetuaSubKemlompok :', key_tandaTanganKetuaSubKemlompok, uk_client_data[i].TTD_KSK);
                    // if (__DEV__) console.log('tandaTanganKetuaKelompok :', key_tandaTanganKetuaKelompok, uk_client_data[i].TTD_KK);

                    /* ============== START HAPUS SOSIALISASI & UK LAMA DARI SQLITE KALAU PAS NARIK ADA ID_PROSPEK YANG SAMA ============== */
                    const queryDelete = "DELETE FROM Sosialisasi_Database WHERE id_prospek = '" + uk_client_data[i].ID_Prospek + "'";
                    const queryDeleteUKMaster = "DELETE FROM Table_UK_Master WHERE id_prospek = '" + uk_client_data[i].ID_Prospek + "'";
                    const queryDeleteUKDataDiri = "DELETE FROM Table_UK_DataDiri WHERE id_prospek = '" + uk_client_data[i].ID_Prospek + "'";
                    const queryDeleteUKProdukPembiayaan = "DELETE FROM Table_UK_ProdukPembiayaan WHERE id_prospek = '" + uk_client_data[i].ID_Prospek + "'";
                    const queryDeleteUKKondisiRumah = "DELETE FROM Table_UK_KondisiRumah WHERE id_prospek = '" + uk_client_data[i].ID_Prospek + "'";
                    const queryDeleteUKSektorEkonomi = "DELETE FROM Table_UK_SektorEkonomi WHERE id_prospek = '" + uk_client_data[i].ID_Prospek + "'";
                    const queryDeleteUKPendapatanNasabah = "DELETE FROM Table_UK_PendapatanNasabah WHERE id_prospek = '" + uk_client_data[i].ID_Prospek + "'";
                    const queryDeleteUKPermohonanPembiayaan = "DELETE FROM Table_UK_PermohonanPembiayaan WHERE id_prospek = '" + uk_client_data[i].ID_Prospek + "'";
                    const queryDeleteUKDisiplinNasabah = "DELETE FROM Table_UK_DisipinNasabah WHERE id_prospek = '" + uk_client_data[i].ID_Prospek + "'";

                    const queryDeletePPNasabah = "DELETE FROM Table_PP_ListNasabah WHERE Nasabah_Id = '" + uk_client_data[i].ID_Prospek + "'";
                    
                    db.transaction(
                        tx => {
                            tx.executeSql(queryDelete, [], (tx, results) => {
                                if (__DEV__) console.log(`${queryDelete} RESPONSE:`, results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log(`${queryDelete} ERROR:`, error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql(queryDeleteUKMaster, [], (tx, results) => {
                                if (__DEV__) console.log(`${queryDeleteUKMaster} RESPONSE:`, results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log(`${queryDeleteUKMaster} ERROR:`, error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql(queryDeleteUKDataDiri, [], (tx, results) => {
                                if (__DEV__) console.log(`${queryDeleteUKDataDiri} RESPONSE:`, results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log(`${queryDeleteUKDataDiri} ERROR:`, error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql(queryDeleteUKProdukPembiayaan, [], (tx, results) => {
                                if (__DEV__) console.log(`${queryDeleteUKProdukPembiayaan} RESPONSE:`, results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log(`${queryDeleteUKProdukPembiayaan} ERROR:`, error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql(queryDeleteUKKondisiRumah, [], (tx, results) => {
                                if (__DEV__) console.log(`${queryDeleteUKKondisiRumah} RESPONSE:`, results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log(`${queryDeleteUKKondisiRumah} ERROR:`, error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql(queryDeleteUKSektorEkonomi, [], (tx, results) => {
                                if (__DEV__) console.log(`${queryDeleteUKSektorEkonomi} RESPONSE:`, results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log(`${queryDeleteUKSektorEkonomi} ERROR:`, error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql(queryDeleteUKPendapatanNasabah, [], (tx, results) => {
                                if (__DEV__) console.log(`${queryDeleteUKPendapatanNasabah} RESPONSE:`, results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log(`${queryDeleteUKPendapatanNasabah} ERROR:`, error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql(queryDeleteUKPermohonanPembiayaan, [], (tx, results) => {
                                if (__DEV__) console.log(`${queryDeleteUKPermohonanPembiayaan} RESPONSE:`, results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log(`${queryDeleteUKPermohonanPembiayaan} ERROR:`, error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql(queryDeleteUKDisiplinNasabah, [], (tx, results) => {
                                if (__DEV__) console.log(`${queryDeleteUKDisiplinNasabah} RESPONSE:`, results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log(`${queryDeleteUKDisiplinNasabah} ERROR:`, error);
                        }, function() {}
                    );

                    db.transaction(
                        tx => {
                            tx.executeSql(queryDeletePPNasabah, [], (tx, results) => {
                                if (__DEV__) console.log(`${queryDeletePPNasabah} RESPONSE:`, results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log(`${queryDeletePPNasabah} ERROR:`, error);
                        }, function() {}
                    );

                    /* ============== FINISH HAPUS SOSIALISASI & UK LAMA DARI SQLITE KALAU PAS NARIK ADA ID_PROSPEK YANG SAMA ============== */
                    if (uk_client_data[i].PostStatus === 3) {
                        let isSisipan = 2;
                        if (uk_client_data[i].Is_Sisipan === '1' || uk_client_data[i].Is_Sisipan === 1) isSisipan = 1;
                        if (uk_client_data[i].Siklus_Pembiayaan === 'Tahap Lanjut') isSisipan = 3;

                        query = query + "('"
                        + uniqueNumber
                        + "','"
                        + moment(uk_client_data[i].Tanggal_Input).format('YYYY-MM-DD')
                        + "','"
                        + uk_client_data[i].ID_Sumber
                        + "','"
                        + uk_client_data[i].Nama_Lengkap
                        + "','"
                        + ""
                        + "','"
                        + isSisipan
                        + "','"
                        + moment(uk_client_data[i].Tanggal_Sos).format('YYYY-MM-DD') 
                        + "','"
                        + uk_client_data[i].Lokasi_Sos
                        + "','"
                        + ""
                        + "','"
                        + moment(uk_client_data[i].Tanggal_Verif).format('YYYY-MM-DD')
                        + "','"
                        + uk_client_data[i].PostStatus
                        + "','"
                        + uk_client_data[i].Reason
                        + "','"
                        + uk_client_data[i].Kelompok_ID
                        + "','"
                        + uk_client_data[i].Sub_Kelompok
                        + "','"
                        + uk_client_data[i].ID_Prospek
                        + "')";

                        queryUKDisiplinNasabah = queryUKDisiplinNasabah + "('"
                        + uk_client_data[i].Nama_Lengkap
                        + "','"
                        + uk_client_data[i].Kualitas_KehadiranPKM
                        + "','"
                        + uk_client_data[i].Kualitas_Pembayaran
                        + "','"
                        + uk_client_data[i].ID_Prospek
                        + "','"
                        + uniqueNumber
                        + "')";

                        // queryUKMaster = queryUKMaster + "('"
                        // + uk_client_data[i].Nama_Lengkap
                        // + "','"
                        // + "6"
                        // + "','"
                        // + uniqueNumber
                        // + "','"
                        // + uk_client_data[i].ID_Prospek
                        // + "')";
                    } else {
                        query = query + "('"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "')";

                        queryUKDisiplinNasabah = queryUKDisiplinNasabah + "('"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "','"
                        + ""
                        + "')";

                        // queryUKMaster = queryUKMaster + "('"
                        // + ""
                        // + "','"
                        // + ""
                        // + "','"
                        // + ""
                        // + "','"
                        // + ""
                        // + "')";
                    }

                    queryUKDataDiri = queryUKDataDiri + "('"
                    + ""
                    + "','"
                    + uk_client_data[i].Jenis_Identitas
                    + "','"
                    + uk_client_data[i].Nomor_Identitas
                    + "','"
                    + uk_client_data[i].Nama_Lengkap
                    + "','"
                    + uk_client_data[i].Tempat_Lahir
                    + "','"
                    + moment(uk_client_data[i].Tanggal_Lahir).format('YYYY-MM-DD')
                    + "','"
                    + uk_client_data[i].Status_Perkawinan
                    + "','"
                    + uk_client_data[i].Alamat_Sesuai_ID
                    + "','"
                    + uk_client_data[i].Alamat_Domisili
                    + "','"
                    + ""
                    + "','"
                    + uk_client_data[i].Provinsi
                    + "','"
                    + uk_client_data[i].Kabupaten
                    + "','"
                    + uk_client_data[i].Kecamatan
                    + "','"
                    + uk_client_data[i].Kelurahan
                    + "','"
                    + ""
                    + "','"
                    + uk_client_data[i].No_KK
                    + "','"
                    + uk_client_data[i].Nama_Ayah
                    + "','"
                    + uk_client_data[i].Nama_Gadis_Ibu_Kandung
                    + "','"
                    + uk_client_data[i].No_Telp
                    + "','"
                    + uk_client_data[i].Jml_Anak
                    + "','"
                    + Pendidikan_Anak
                    + "','"
                    + uk_client_data[i].Jml_Tanggungan
                    + "','"
                    + uk_client_data[i].StatusRumah
                    + "','"
                    + uk_client_data[i].Lama_Tinggal
                    + "','"
                    + uk_client_data[i].Nama_Suami
                    + "','"
                    + uk_client_data[i].Pekerjaan
                    + "','"
                    + uk_client_data[i].Jml_Tenaga_Kerja
                    + "','"
                    + ""
                    + "','"
                    + uk_client_data[i].Is_Ditempat
                    + "','"
                    + uk_client_data[i].Status_Penjamin
                    + "','"
                    + uk_client_data[i].Nama_Penjamin
                    + "','"
                    + ""
                    + "','"
                    + uk_client_data[i].Longitude
                    + "','"
                    + uk_client_data[i].Latitude
                    + "','"
                    + uk_client_data[i].ID_Agama
                    + "','"
                    + uk_client_data[i].Is_Layak
                    + "','"
                    + uk_client_data[i].Is_UKPass
                    + "','"
                    + isVerifPass
                    + "','"
                    + uk_client_data[i].ID_Prospek
                    + "','"
                    + uk_client_data[i].Is_Pernyataan_Dibaca
                    + "','"
                    + uk_client_data[i].Lokasi_Sos
                    + "','"
                    + isAlamatDomisiliSesuaiKtp
                    + "','"
                    + uk_client_data[i].Siklus_Pembiayaan
                    + "','"
                    + uniqueNumber
                    + "','"
                    + uk_client_data[i].Created_By
                    + "')";

                    queryUKPembiayaan = queryUKPembiayaan + "('"
                    + uk_client_data[i].Nama_Lengkap
                    + "','"
                    + uk_client_data[i].Nomor_Identitas
                    + "','"
                    + uk_client_data[i].Jenis_Pembiayaan
                    + "','"
                    + uk_client_data[i].ID_Produk
                    + "','"
                    + uk_client_data[i].ID_Produk_Pembiayaan
                    + "','"
                    + uk_client_data[i].Jumlah_Pinjaman
                    + "','"
                    + uk_client_data[i].Term_Pembiayaan
                    + "','"
                    + uk_client_data[i].Kategori_Tujuan_Pembiayaan
                    + "','"
                    + uk_client_data[i].Tujuan_Pembiayaan
                    + "','"
                    + uk_client_data[i].Type_Pencairan
                    + "','"
                    + uk_client_data[i].Frekuensi_Pembiayaan
                    + "','"
                    + uk_client_data[i].Is_Ada_Rekening_Bank
                    + "','"
                    + uk_client_data[i].Nama_Bank
                    + "','"
                    + uk_client_data[i].No_Rekening
                    + "','"
                    + uk_client_data[i].Pemilik_Rekening
                    + "','"
                    + uk_client_data[i].ID_Prospek
                    + "','"
                    + uniqueNumber
                    + "')";

                    queryUKKondisiRumah = queryUKKondisiRumah + "('"
                    + uk_client_data[i].Nama_Lengkap
                    + "','"
                    + uk_client_data[i].Nomor_Identitas
                    + "','"
                    + uk_client_data[i].Luas_Bangunan
                    + "','"
                    + uk_client_data[i].Kondisi_Bangunan
                    + "','"
                    + uk_client_data[i].Jenis_Atap
                    + "','"
                    + uk_client_data[i].Dinding
                    + "','"
                    + uk_client_data[i].Lantai
                    + "','"
                    + uk_client_data[i].Is_AdaAksesAirBersih
                    + "','"
                    + uk_client_data[i].Is_AdaAdaToiletPribadi
                    + "','"
                    + uk_client_data[i].ID_Prospek
                    + "','"
                    + uniqueNumber
                    + "')";

                    queryUKSektorEkonomi = queryUKSektorEkonomi + "('"
                    + uk_client_data[i].Nama_Lengkap
                    + "','"
                    + uk_client_data[i].Nomor_Identitas
                    + "','"
                    + uk_client_data[i].ID_SektorEkonomi
                    + "','"
                    + uk_client_data[i].ID_SubSektorEkonomi
                    + "','"
                    + uk_client_data[i].Jenis_Usaha
                    + "','"
                    + uk_client_data[i].ID_Prospek
                    + "','"
                    + uniqueNumber
                    + "')";

                    queryUKPendapatanNasabah = queryUKPendapatanNasabah + "('"
                    + uk_client_data[i].Nama_Lengkap
                    + "','"
                    + uk_client_data[i].Nomor_Identitas
                    + "','"
                    + parseInt(uk_client_data[i].PendapatanKotor_perHari || 0)
                    + "','"
                    + parseInt(uk_client_data[i].PengeluaranKel_perHari || 0)
                    + "','"
                    + parseInt(uk_client_data[i].PendapatanBersih_perHari || 0)
                    + "','"
                    + uk_client_data[i].JmlHariUsaha_perBulan
                    + "','"
                    + parseInt(uk_client_data[i].PendapatanBersih_perBulan || 0)
                    + "','"
                    + parseInt(uk_client_data[i].PendapatanBersih_perMinggu || 0)
                    + "','"
                    + uk_client_data[i].Is_AdaPembiayaanLain
                    + "','"
                    + uk_client_data[i].Nama_Pembiayaan_Lembaga_Lain
                    + "','"
                    + ""
                    + "','"
                    + parseInt(uk_client_data[i].Kemampuan_Angsuran || 0)
                    + "','"
                    + parseInt(uk_client_data[i].PendapatanKotor_perHari_Suami || 0)
                    + "','"
                    + parseInt(uk_client_data[i].PengeluaranKel_perHari_Suami || 0)
                    + "','"
                    + parseInt(uk_client_data[i].PendapatanBersih_perHari_Suami || 0)
                    + "','"
                    + uk_client_data[i].JmlHariUsaha_perBulan_Suami
                    + "','"
                    + parseInt(uk_client_data[i].PendapatanBersih_perBulan_Suami || 0)
                    + "','"
                    + parseInt(uk_client_data[i].PendapatanBersih_perMinggu_Suami || 0)
                    + "','"
                    + uk_client_data[i].ID_Prospek
                    + "','"
                    + uniqueNumber
                    + "')";

                    queryUKPermohonanPembiayaan = queryUKPermohonanPembiayaan + "('"
                    + uk_client_data[i].Nama_Lengkap
                    + "','"
                    + uk_client_data[i].Nomor_Identitas
                    + "','"
                    + uk_client_data[i].Produk_Pembiayaan
                    + "','"
                    + uk_client_data[i].Jumlah_Pinjaman
                    + "','"
                    + uk_client_data[i].Term_Pembiayaan
                    + "','"
                    + uk_client_data[i].Frekuensi_Pembiayaan
                    + "','"
                    + ""
                    + "','"
                    + ""
                    + "','"
                    + ""
                    + "','"
                    + ""
                    + "','"
                    + ""
                    + "','"
                    + uk_client_data[i].Nama_TTD_Nasabah
                    + "','"
                    + uk_client_data[i].Nama_TTD_Penjamin
                    + "','"
                    + uk_client_data[i].Nama_TTD_KSK
                    + "','"
                    + uk_client_data[i].Nama_TTD_KK
                    + "','"
                    + uk_client_data[i].ID_Prospek
                    + "','"
                    + uniqueNumber
                    + "')";

                    

                    if(uk_client_data[i].Is_UKPass === '1' && uk_client_data[i].Is_VerifPass === '1' && uk_client_data[i].Siklus_Pembiayaan !== 'Tahap Lanjut' ) {
                        let statusKelompok = 0

                        if(uk_client_data[i].Is_Sisipan === 1 || uk_client_data[i].Is_Sisipan === '1') {
                            statusKelompok = 1
                        }

                        if(uk_client_data[i].ID_MPP === 1 || uk_client_data[i].ID_MPP === '1') {
                            statusKelompok = 2
                        }else if(uk_client_data[i].ID_MPP === 2 || uk_client_data[i].ID_MPP === '2') {
                            if(uk_client_data[i].Is_Sisipan === 1 || uk_client_data[i].Is_Sisipan === '1') {
                                statusKelompok = 4
                            }else{
                                statusKelompok = 3
                            }
                        }else if(uk_client_data[i].ID_MPP === 3 || uk_client_data[i].ID_MPP === '3') {
                            statusKelompok = 4
                        }

                        queryPPKelompok = queryPPKelompok + "('"
                            + uk_client_data[i].Kelompok_ID
                            + "','"
                            + uk_client_data[i].Nama_Kelompok
                            + "','"
                            + uk_client_data[i].Sub_Kelompok
                            + "','"
                            + uk_client_data[i].Sub_Kelompok
                            + "','"
                            + uk_client_data[i].ID_Prospek
                            + "','"
                            + uk_client_data[i].Nama_Lengkap
                            + "','"
                            + uk_client_data[i].Is_Ketua_Kelompok
                            + "','"
                            + uk_client_data[i].Is_Ketua_Sub_Kelompok
                            + "','"
                            + uk_client_data[i].Lokasi_Sos
                            + "','"
                            + uk_client_data[i].OurBranchID
                            + "', '"
                            + params.username
                            + "', '"
                            + uk_client_data[i].Jumlah_Pinjaman
                            + "', '"
                            + uk_client_data[i].Term_Pembiayaan
                            + "', '"
                            + uk_client_data[i].Jasa
                            + "', '"
                            + uk_client_data[i].Angsuran_Perminggu
                            + "', '"
                            + statusKelompok
                            + "', '"
                            + uk_client_data[i].Is_Sisipan
                            + "', '"
                            + uk_client_data[i].Nama_TTD_AO
                            + "')";

                            if(uk_client_data[i].ID_MPP !== 0 || uk_client_data[i].ID_MPP !== '0') {

                                let statusSisipan = null

                                if(uk_client_data[i].Is_Sisipan === 1 || uk_client_data[i].Is_Sisipan === '1') {
                                    statusSisipan = 1
                                }
                                queryPPGroup = queryPPGroup + "('"
                                    + uk_client_data[i].Kelompok_ID
                                    + "', '"
                                    + uk_client_data[i].Nama_Kelompok
                                    + "', '"
                                    + uk_client_data[i].OurBranchID
                                    + "', '"
                                    + statusSisipan
                                    + "', '"
                                    + statusKelompok
                                    + "')";
                            }else{
                                queryPPGroup = queryPPGroup + "('"
                                    + ""
                                    + "', '"
                                    + ""
                                    + "', '"
                                    + ""
                                    + "', '"
                                    + ""
                                    + "', '"
                                    + ""
                                    + "')";
                            }

                    }else{
                        queryPPKelompok = queryPPKelompok + "('"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + null
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "')";
                        
                        queryPPGroup = queryPPGroup + "('"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "')";
                    }

                    // if(uk_client_data[i].Is_Sisipan === 1 || uk_client_data[i].Is_Sisipan === '1') {

                    //     let statusSisipan = 1

                    //     if(uk_client_data[i].ID_MPP === 2 || uk_client_data[i].ID_MPP === '2') {
                    //         statusSisipan = 4
                    //     }

                    //     queryPPSisipan = queryPPSisipan + "('"
                    //     + uk_client_data[i].Kelompok_ID
                    //     + "','"
                    //     + uk_client_data[i].Nama_Kelompok
                    //     + "','"
                    //     + uk_client_data[i].OurBranchID
                    //     + "','"
                    //     + 1
                    //     + "','"
                    //     + 1
                    //     + "')";
                    // }else{
                    //     queryPPSisipan = queryPPSisipan + "('"
                    //     + ""
                    //     + "','"
                    //     + ""
                    //     + "','"
                    //     + ""
                    //     + "','"
                    //     + ""
                    //     + "','"
                    //     + null
                    //     + "')";
                    // }

                    if(uk_client_data[i].Is_UKPass === '1' && uk_client_data[i].Is_VerifPass === '1' && uk_client_data[i].Siklus_Pembiayaan === 'Tahap Lanjut') {
                        queryPPKelompokTahapLanjut = queryPPKelompokTahapLanjut + "('"
                            + uk_client_data[i].Kelompok_ID
                            + "','"
                            + uk_client_data[i].Nama_Kelompok
                            + "','"
                            + uk_client_data[i].Sub_Kelompok
                            + "','"
                            + uk_client_data[i].ID_Prospek
                            + "','"
                            + uk_client_data[i].Nama_Lengkap
                            + "','"
                            + uk_client_data[i].Is_Ketua_Kelompok
                            + "','"
                            + uk_client_data[i].Is_Ketua_Sub_Kelompok
                            + "','"
                            + uk_client_data[i].Lokasi_Sos
                            + "','"
                            + uk_client_data[i].OurBranchID
                            + "', '"
                            + params.username
                            + "', '"
                            + uk_client_data[i].Jumlah_Pinjaman
                            + "', '"
                            + uk_client_data[i].Term_Pembiayaan
                            + "', '"
                            + uk_client_data[i].Jasa
                            + "', '"
                            + uk_client_data[i].Angsuran_Perminggu
                            + "', '"
                            + 4
                            + "', '"
                            + 1
                            + "', '"
                            + uk_client_data[i].Nama_TTD_AO
                            + "')";

                        queryPPSisipanTahapLanjut = queryPPSisipanTahapLanjut + "('"
                            + uk_client_data[i].Kelompok_ID
                            + "','"
                            + uk_client_data[i].Nama_Kelompok
                            + "','"
                            + uk_client_data[i].OurBranchID
                            + "','"
                            + 1
                            + "','"
                            + 1
                            + "')";
                    }else{
                        queryPPKelompokTahapLanjut = queryPPKelompokTahapLanjut + "('"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "', '"
                            + null
                            + "', '"
                            + ""
                            + "', '"
                            + ""
                            + "')";

                        queryPPSisipanTahapLanjut = queryPPSisipanTahapLanjut + "('"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + ""
                            + "','"
                            + null
                            + "')";
                    }

                    if (i != uk_client_data.length - 1) {
                        query = query + ",";
                        // queryUKMaster = queryUKMaster + ",";
                        queryUKDataDiri = queryUKDataDiri + ",";
                        queryUKPembiayaan = queryUKPembiayaan + ",";
                        queryUKKondisiRumah = queryUKKondisiRumah + ",";
                        queryUKSektorEkonomi = queryUKSektorEkonomi + ",";
                        queryUKPendapatanNasabah = queryUKPendapatanNasabah + ",";
                        queryUKPermohonanPembiayaan = queryUKPermohonanPembiayaan + ",";
                        queryUKDisiplinNasabah = queryUKDisiplinNasabah + ",";

                            queryPPKelompok = queryPPKelompok + ","
                            // queryPPSisipan = queryPPSisipan + ","

                            queryPPKelompokTahapLanjut = queryPPKelompokTahapLanjut + ","
                            queryPPSisipanTahapLanjut = queryPPSisipanTahapLanjut + ","

                            queryPPGroup = queryPPGroup + ","

                    }

                    mappingProspek.push(uk_client_data[i].ID_Prospek)
                }

                query = query + ";";
                // queryUKMaster = queryUKMaster + ";";
                queryUKDataDiri = queryUKDataDiri + ";";
                queryUKPembiayaan = queryUKPembiayaan + ";";
                queryUKKondisiRumah = queryUKKondisiRumah + ";";
                queryUKSektorEkonomi = queryUKSektorEkonomi + ";";
                queryUKPendapatanNasabah = queryUKPendapatanNasabah + ";";
                queryUKPermohonanPembiayaan = queryUKPermohonanPembiayaan + ";";
                queryUKDisiplinNasabah = queryUKDisiplinNasabah + ";";
                queryPPKelompok = queryPPKelompok + ";";
                // queryPPSisipan = queryPPSisipan + ";";

                queryPPKelompokTahapLanjut = queryPPKelompokTahapLanjut + ";";
                queryPPSisipanTahapLanjut = queryPPSisipanTahapLanjut + ";";

                queryPPGroup = queryPPGroup + ";";

                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT QUERY:', query);
                // if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT UK MASTER QUERY:', queryUKMaster);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK DATA DIRI INSERT QUERY:', queryUKDataDiri);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK DATA PEMBIAYAAN INSERT QUERY:', queryUKPembiayaan);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK KONDISI RUMAH INSERT QUERY:', queryUKKondisiRumah);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK SEKTOR EKONOMI INSERT QUERY:', queryUKSektorEkonomi);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK PENDAPATAN NASABAH INSERT QUERY:', queryUKPendapatanNasabah);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK PERMOHONAN PEMBIAYAAN INSERT QUERY:', queryUKPermohonanPembiayaan);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK DISIPLIN NASABAH INSERT QUERY:', queryUKDisiplinNasabah);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP KELOMPOK INSERT QUERY:', queryPPKelompok);
                // if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP KELOMPOK INSERT QUERY:', queryPPSisipan);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP KELOMPOK INSERT QUERY:', queryPPGroup);

                db.transaction(
                    tx => { tx.executeSql(query); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT TRANSACTION DONE');
                    }
                );
                // db.transaction(
                //     tx => { tx.executeSql(queryUKMaster); }, function(error) {
                //         if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK MASTER INSERT TRANSACTION ERROR:', error);
                //     }, function() {
                //         if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK MASTER INSERT TRANSACTION DONE');
                //     }
                // );
                db.transaction(
                    tx => { tx.executeSql(queryUKDataDiri); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK DATA DIRI INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK DATA DIRI INSERT TRANSACTION DONE');
                    }
                );
                db.transaction(
                    tx => { tx.executeSql(queryUKPembiayaan); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK PEMBIAYAAN INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK PEMBIAYAAN INSERT TRANSACTION DONE');
                    }
                );
                db.transaction(
                    tx => { tx.executeSql(queryUKKondisiRumah); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK KONDISI RUMAH INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK KONDISI RUMAH INSERT TRANSACTION DONE');
                    }
                );
                db.transaction(
                    tx => { tx.executeSql(queryUKSektorEkonomi); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK SEKTOR EKONOMI INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK SEKTOR EKONOMI INSERT TRANSACTION DONE');
                    }
                );
                db.transaction(
                    tx => { tx.executeSql(queryUKPendapatanNasabah); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK PENDAPATAN NASABAH INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK PENDAPATAN NASABAH INSERT TRANSACTION DONE');
                    }
                );
                db.transaction(
                    tx => { tx.executeSql(queryUKPermohonanPembiayaan); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK PERMOHONAN PEMBIAYAAN INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK PERMOHONAN PEMBIAYAAN INSERT TRANSACTION DONE');
                    }
                );
                db.transaction(
                    tx => { tx.executeSql(queryUKDisiplinNasabah); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK DISIPLIN NASABAH INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK DISIPLIN NASABAH INSERT TRANSACTION DONE');
                    }
                );

                db.transaction(
                    tx => { tx.executeSql(queryPPKelompok); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP KELOMPOK INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP KELOMPOK INSERT TRANSACTION DONE');
                    }
                );

                db.transaction(
                    tx => { tx.executeSql(queryPPGroup); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP KELOMPOK INSERT GROUP TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP KELOMPOK INSERT GROUP TRANSACTION DONE');
                    }
                );

                // db.transaction(
                //     tx => { tx.executeSql(queryPPSisipan); }, function(error) {
                //         if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP SISIPAN KELOMPOK INSERT TRANSACTION ERROR:', error);
                //     }, function() {
                //         if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP SISIPAN KELOMPOK INSERT TRANSACTION DONE');
                //     }
                // );

                db.transaction(
                    tx => { tx.executeSql(queryPPKelompokTahapLanjut); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP KELOMPOK TAHAP LANJUT INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP KELOMPOK TAHAP LANJUT INSERT TRANSACTION DONE');
                    }
                );

                db.transaction(
                    tx => { tx.executeSql(queryPPSisipanTahapLanjut); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP SISIPAN TAHAP LANJUT KELOMPOK INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE PP SISIPAN TAHAP LANJUT KELOMPOK INSERT TRANSACTION DONE');
                    }
                );

                db.transaction(
                    tx => {
                        tx.executeSql("DELETE FROM Sosialisasi_Database WHERE id = ''", [], (tx, results) => {
                            if (__DEV__) console.log('DELETE SOSIALISASI MOBILE IS NULL RESPONSE:', results.rows);
                        })
                    }, function(error) {
                        if (__DEV__) console.log('SOSIALISASI MOBILE ERROR:', error);
                    }, function() {}
                );
                db.transaction(
                    tx => {
                        tx.executeSql("DELETE FROM Table_UK_Master WHERE idSosialisasiDatabase = ''", [], (tx, results) => {
                            if (__DEV__) console.log('DELETE SOSIALISASI MOBILE UK MASTER IS NULL RESPONSE:', results.rows);
                        })
                    }, function(error) {
                        if (__DEV__) console.log('SOSIALISASI MOBILE ERROR:', error);
                    }, function() {}
                );

                if (__DEV__) {
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Sosialisasi_Database", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE ERROR:', error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_UK_Master", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE UK MASTER RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE UK MASTER ERROR:', error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_UK_DataDiri", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE UK DATA DIRI RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE UK DATA DIRI ERROR:', error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_UK_ProdukPembiayaan", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE UK PRODUK PEMBIAYAAN RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE UK PRODUK PEMBIAYAAN ERROR:', error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_UK_KondisiRumah", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE UK KONDISI RUMAH RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE UK KONDISI RUMAH ERROR:', error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_UK_SektorEkonomi", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE UK SEKTOR EKONOMI RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE UK SEKTOR EKONOMI ERROR:', error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_UK_PendapatanNasabah", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE UK PENDAPATAN NASABAH RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE UK PENDAPATAN NASABAH ERROR:', error);
                        }, function() {}
                    );
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_UK_PermohonanPembiayaan", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE UK PERMOHONAN PEMBIAYAAN RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE UK PERMOHONAN PEMBIAYAAN ERROR:', error);
                        }, function() {}
                    );
                }
                AsyncStorage.setItem('ProspekMap', JSON.stringify(mappingProspek));
            } catch (error) {
                truncat(reject, 'SOSIALISASI MOBILE UK');
                return;
            }
        }

        if (pp_kelompok.length > 0) {}
        if (pp_2_kelompok.length > 0) {}
        if (pp_3_kelompok.length > 0) {}
        if (persetujuan_pembiayaan_kelompok.length > 0) {}
        if (persetujuan_pembiayaan_client_kelompok.length > 0) {}
        
        resolve('BERHASIL');
        return;
    });

    const fetchWaterfall = async () => {
        // await clearData();
        // if (__DEV__) console.log('ACTIONS GET SYNC DATA NEW SYNC CLEAR DATA');

        const roleUser = await AsyncStorage.getItem('roleUser');
        if (__DEV__) console.log('ACTIONS ROLE USER', roleUser);

        const token = await AsyncStorage.getItem('token');
        if (__DEV__) console.log('ACTIONS TOKEN', token);

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

        const PencairanData = await fetch(getDataPencairan, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const jsonPencairanData = await PencairanData.json(PencairanData);
        await insertKelompokPencairan(jsonPencairanData);
        if (__DEV__) console.log('ACTIONS GET SYNC DATA PENCAIRAN DONE');

        let checkIdProspek = "0";
        if (["AO", "SAO"].includes(roleUser)) checkIdProspek = "1";

        if (![2].includes(params.prospekFilter)) {
            const body = JSON.stringify({
                "CreatedBy": "",
                "ID_Prospek": params.prospekMap,
                "IsPickClient": "1",
                "OurBranchID": params.cabangid.toString(),
                "Check_ID_Prospek": checkIdProspek,
                "Check_ID_By": params.username
            });
            if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE BODY', body);
            
            try {
                const responseGetSosialisasiMobile = await fetchWithTimeout(postGetSosialisasiMobile, {
                    timeout: 360000, // 6 menit
                    method: 'POST',
                    headers: {
                        Authorization: token,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                        },
                    body: body
                });
    
                const jsonGetSosialisasiMobile = await responseGetSosialisasiMobile.json(responseGetSosialisasiMobile);

                if (jsonGetSosialisasiMobile.responseCode !== 200) {
                    ToastAndroid.show(jsonGetSosialisasiMobile.responseDescription, ToastAndroid.LONG);
                }

                await insertGetSosialisasiMobile(jsonGetSosialisasiMobile);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE DONE', jsonGetSosialisasiMobile);
            } catch (error) {
                if (__DEV__) console.log('$post /post_inisiasi/post_prospek_uk error:', error)

                let message = JSON.stringify(error);
                if (error.name === 'AbortError') {
                    message = 'Request timeout';
                }

                Alert.alert('Error', message);
                return 'SYNC FAILED TIMEOUT';
            }
        }

        const getDate = await fetch(ApiSync+Get_Date);
        const jsonGetDate = await getDate.json(getDate);
        if (__DEV__) console.log('ACTIONS GET SYNC DATE:', jsonGetDate);

        let jsonMasterData = null;
        if (params.isGetMaster) {
            const MasterData = await fetch(getMasterData, {
                method: 'GET',
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            jsonMasterData = await MasterData.json(MasterData);
            if (__DEV__) console.log('ACTIONS GET SYNC MASTER DATA:', jsonMasterData);
        }

        // if (__DEV__) console.log('ACTIONS GET SYNC MASTER DATA:', jsonPencairanData);

        // let dataLogin = [{
        //     userName: params.username
        // }]
        // const syncBy = await AsyncStorage.getItem('SyncBy')
        // const loginData = JSON.parse(syncBy)
        // dataLogin.push(loginData)
        // AsyncStorage.setItem('SyncBy', dataLogin);
        // AsyncStorage.removeItem('SyncBy')

        const syncBy = await AsyncStorage.getItem('SyncBy')
        let loginData = JSON.parse(syncBy)
        if (loginData === null) {
            if (__DEV__) console.log('loginData baru:', loginData);

            let newData = [];
            newData.push({userName: params.username});
            AsyncStorage.setItem('SyncBy', JSON.stringify(newData));
        } else {
            if (__DEV__) console.log('loginData tambah:', loginData);

            let lengthData = loginData.filter((x) => x.userName === params.username).length || 0

            if(lengthData === 0) {
                loginData.push({userName: params.username});
                AsyncStorage.setItem('SyncBy', JSON.stringify(loginData))
            }
            
        }

        // AsyncStorage.removeItem('userData')
        // navigation.replace('Login')

        AsyncStorage.setItem('SyncDate', jsonGetDate.currentDate);
        AsyncStorage.setItem('TransactionDate', jsonGetDate.currentDate);

        if (params.isGetMaster) {
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
            AsyncStorage.setItem('JenisPembiayaan', JSON.stringify(jsonMasterData.data.jenisPembiayaan));
            AsyncStorage.setItem('SubjenisPembiayaan', JSON.stringify(jsonMasterData.data.subjenisPembiayaan));
            AsyncStorage.setItem('TujuanPembiayaan', JSON.stringify(jsonMasterData.data.tujuanPembiayaan));
            AsyncStorage.setItem('KategoritujuanPembiayaan', JSON.stringify(jsonMasterData.data.kategoritujuanPembiayaan));
            AsyncStorage.setItem('Frekuensi', JSON.stringify(jsonMasterData.data.Frekuensi));
            AsyncStorage.setItem('WilayahMobile', JSON.stringify(jsonMasterData.data.WilayahMobile));
            AsyncStorage.setItem('SetUKtimeOut', JSON.stringify(jsonMasterData.data.SetUKtimeOut));
            AsyncStorage.setItem('MasterAvailableSubGroup', JSON.stringify(jsonMasterData.data.MasterAvailableSubGroup));
            AsyncStorage.setItem('MasterGroupProduct', JSON.stringify(jsonMasterData.data.MasterGroupProduct));
        }

        return 'SYNC DONE';
    }

    resolve(fetchWaterfall());
});