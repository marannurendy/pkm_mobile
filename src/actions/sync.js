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
    var getMasterData = ApiSyncInisiasi + 'GetMasterData/' + params.cabangid;
    var postGetSosialisasiMobile = ApiSyncInisiasi + 'GetSosialisasiMobile';
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
                    + params.username
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
        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT');
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
        
        if (sosialisai.length > 0) {
            try {
                var query = 'INSERT INTO Sosialisasi_Database (tanggalInput, sumberId, namaCalonNasabah, nomorHandphone, status, tanggalSosialisas, lokasiSosialisasi, type) values ';
                for (let i = 0; i < sosialisai.length; i++) {
                    query = query + "('" + null + "','" + null + "','" + sosialisai[i].CalonNasabah + "','" + null + "','" + null + "','" + sosialisai[i].TanggalSos + "','" + sosialisai[i].Lokasi_Sos + "','" + null + "')";
                    if (i != sosialisai.length - 1) query = query + ",";
                }
                query = query + ";";
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT QUERY:', query);
    
                db.transaction(
                    tx => { tx.executeSql(query); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE INSERT TRANSACTION DONE');
                    }
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
                }

                return;
            } catch (error) {
                truncat(reject, 'SOSIALISASI MOBILE');
                return;
            }
        }

        if (uk.length > 0) {
            try {
                var query = 'INSERT INTO Table_UK (date, lokasiSos) values ';
                for (let i = 0; i < uk.length; i++) {
                    query = query + "('" + uk[i].date + "','" + uk[i].lokasiSos + "')";
                    if (i != uk.length - 1) query = query + ",";
                }
                query = query + ";";
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK INSERT QUERY:', query);
    
                db.transaction(
                    tx => { tx.executeSql(query); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK INSERT TRANSACTION DONE');
                    }
                );

                if (__DEV__) {
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_UK", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE UK RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE UK ERROR:', error);
                        }, function() {}
                    );
                }

                return;
            } catch (error) {
                truncat(reject, 'SOSIALISASI MOBILE UK');
                return;
            }
        }

        if (uk_detail.length > 0) {
            try {
                var query = 'INSERT INTO Table_UK_Detail (date, lokasiSos, namaProspek) values ';
                for (let i = 0; i < uk_detail.length; i++) {
                    query = query + "('" + uk_detail[i].date + "','" + uk_detail[i].lokasiSos + "','" + uk_detail[i].namaProspek + "')";
                    if (i != uk_detail.length - 1) query = query + ",";
                }
                query = query + ";";
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK DETAIL INSERT QUERY:', query);

                db.transaction(
                    tx => { tx.executeSql(query); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK DETAIL INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK DETAIL INSERT TRANSACTION DONE');
                    }
                );

                if (__DEV__) {
                    db.transaction(
                        tx => {
                            tx.executeSql("SELECT * FROM Table_UK_Detail", [], (tx, results) => {
                                if (__DEV__) console.log('SOSIALISASI MOBILE UK DETAIL RESPONSE:', results.rows);
                            })
                        }, function(error) {
                            if (__DEV__) console.log('SOSIALISASI MOBILE UK DETAIL ERROR:', error);
                        }, function() {}
                    );
                }

                return;
            } catch (error) {
                truncat(reject, 'SOSIALISASI MOBILE UK DETAIL');
                return;
            }
        }

        if (uk_client_data.length > 0) {
            try {
                var queryUKDataDiri = 'INSERT INTO Table_UK_DataDiri (foto_Kartu_Identitas, jenis_Kartu_Identitas, nomor_Identitas, nama_lengkap, tempat_lahir, tanggal_Lahir, status_Perkawinan, alamat_Identitas, alamat_Domisili, foto_Surat_Keterangan_Domisili, provinsi, kabupaten, kecamatan, kelurahan, foto_kk, no_kk, nama_ayah, no_tlp_nasabah, jumlah_anak, jumlah_tanggungan, status_rumah_tinggal, lama_tinggal, nama_suami, usaha_pekerjaan_suami, jumlah_tenaga_kerja_suami, foto_ktp_suami, suami_diluar_kota, status_hubungan_keluarga, nama_penjamin, foto_ktp_penjamin, status_Verif, status_UK_Pass, status_Verifikasi_Pass, id_prospek) values ';
                var queryUKPembiayaan = 'INSERT INTO Table_UK_ProdukPembiayaan (nama_lengkap, jenis_Pembiayaan, nama_Produk, produk_Pembiayaan, jumlah_Pinjaman, term_Pembiayaan, kategori_Tujuan_Pembiayaan, tujuan_Pembiayaan, type_Pencairan, frekuensi_Pembayaran, status_Rekening_Bank, nama_Bank, no_Rekening, pemilik_Rekening) values ';
                var queryUKKondisiRumah = 'INSERT INTO Table_UK_KondisiRumah (nama_lengkap, luas_Bangunan, kondisi_Bangunan, jenis_Atap, dinding, lantai, sanitasi_Akses_AirBersih, sanitasi_KamarMandi) values ';
                var queryUKSektorEkonomi = 'INSERT INTO Table_UK_SektorEkonomi (nama_lengkap, sektor_Ekonomi, sub_Sektor_Ekonomi, jenis_Usaha) values ';
                var queryUKPendapatanNasabah = 'INSERT INTO Table_UK_PendapatanNasabah (nama_lengkap, pendapatan_Kotor_perhari, pengeluaran_Keluarga_Perhari, pendapatan_Bersih_Perhari, jumlah_Hari_Usaha_Perbulan, pendapatan_Bersih_Perbulan, pendapatan_Bersih_Perminggu, pembiayaan_Dari_Lembaga, Pembiayaan_Dari_LembagaLain, Pembiayaan_Dari_LembagaLainFreetext, jumlah_Angsuran, pendapatanSuami_Kotor_Perhari, pendapatanSuami_Pengeluaran_Keluarga_Perhari, pendapatanSuami_Pendapatan_Bersih_Perhari, pendapatanSuami_jumlah_Hari_Usaha_Perbulan, pendapatanSuami_pendapatan_Bersih_Perbulan, pendapatanSuami_pendapatan_Bersih_Perminggu) values ';
                var queryUKPermohonanPembiayaan = 'INSERT INTO Table_UK_PermohonanPembiayaan (nama_lengkap, produk_Pembiayaan, jumlah_Pembiayaan_Diajukan, jangka_Waktu, frekuensi_Pembiayaan, tanda_Tangan_AOSAO, tanda_Tangan_Nasabah, tanda_Tangan_SuamiPenjamin, tanda_Tangan_Ketua_SubKelompok, tanda_Tangan_Ketua_Kelompok, nama_tanda_Tangan_Nasabah, nama_tanda_Tangan_SuamiPenjamin, nama_tanda_Tangan_Ketua_SubKelompok, nama_tanda_Tangan_Ketua_Kelompok) values ';
                
                for (let i = 0; i < uk_client_data.length; i++) {
                    let namaNasabah = uk_client_data[i].Nama_Lengkap || '';

                    const key_dataPenjamin = `formUK_dataPenjamin_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_dataSuami = `formUK_dataSuami_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_kartuKeluarga = `formUK_kartuKeluarga_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_keteranganDomisili = `formUK_keteranganDomisili_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_kartuIdentitas = `formUK_kartuIdentitas_${namaNasabah.replace(/\s+/g, '')}`;

                    const key_tandaTanganAOSAO = `formUK_tandaTanganAOSAO_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_tandaTanganNasabah = `formUK_tandaTanganNasabah_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_tandaTanganSuamiPenjamin = `formUK_tandaTanganSuamiPenjamin_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_tandaTanganKetuaSubKemlompok = `formUK_tandaTanganKetuaSubKemlompok_${namaNasabah.replace(/\s+/g, '')}`;
                    const key_tandaTanganKetuaKelompok = `formUK_tandaTanganKetuaKelompok_${namaNasabah.replace(/\s+/g, '')}`;

                    AsyncStorage.setItem(key_kartuIdentitas, 'data:image/jpeg;base64,' + uk_client_data[i].Foto_Kartu_Identitas);
                    AsyncStorage.setItem(key_dataSuami, 'data:image/jpeg;base64,' + uk_client_data[i].Foto_KTP_Suami);
                    AsyncStorage.setItem(key_kartuKeluarga, 'data:image/jpeg;base64,' + uk_client_data[i].Foto_KK);
                    AsyncStorage.setItem(key_keteranganDomisili, 'data:image/jpeg;base64,' + uk_client_data[i].Foto_Suket_Domisili);

                    AsyncStorage.setItem(key_tandaTanganNasabah, 'data:image/jpeg;base64,' + uk_client_data[i].TTD_Nasabah);
                    AsyncStorage.setItem(key_tandaTanganKetuaSubKemlompok, 'data:image/jpeg;base64,' + uk_client_data[i].TTD_KSK);
                    AsyncStorage.setItem(key_tandaTanganKetuaKelompok, 'data:image/jpeg;base64,' + uk_client_data[i].TTD_KK);

                    queryUKDataDiri = queryUKDataDiri + "('"
                    + key_dataPenjamin
                    + "','"
                    + uk_client_data[i].Jenis_Identitas
                    + "','"
                    + uk_client_data[i].Nomor_Identitas
                    + "','"
                    + uk_client_data[i].Nama_Lengkap
                    + "','"
                    + uk_client_data[i].Tempat_Lahir
                    + "','"
                    + uk_client_data[i].Tanggal_Lahir
                    + "','"
                    + uk_client_data[i].Status_Perkawinan
                    + "','"
                    + uk_client_data[i].Alamat_Sesuai_ID
                    + "','"
                    + uk_client_data[i].Alamat_Domisili
                    + "','"
                    + key_keteranganDomisili
                    + "','"
                    + uk_client_data[i].Nama_Provinsi
                    + "','"
                    + uk_client_data[i].Nama_KabKot
                    + "','"
                    + uk_client_data[i].Nama_Kecamatan
                    + "','"
                    + uk_client_data[i].Nama_KelurahanDesa
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
                    + "','"
                    + ""
                    + "','"
                    + ""
                    + "','"
                    + uk_client_data[i].Is_Layak
                    + "','"
                    + uk_client_data[i].Is_UKPass
                    + "','"
                    + uk_client_data[i].Is_VerifPass
                    + "','"
                    + uk_client_data[i].ID_Prospek
                    + "')";

                    queryUKPembiayaan = queryUKPembiayaan + "('"
                    + uk_client_data[i].Nama_Lengkap
                    + "','"
                    + uk_client_data[i].Jenis_Pembiayaan
                    + "','"
                    + uk_client_data[i].Nama_Produk
                    + "','"
                    + uk_client_data[i].Produk_Pembiayaan
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
                    + "')";

                    queryUKKondisiRumah = queryUKKondisiRumah + "('"
                    + uk_client_data[i].Nama_Lengkap
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
                    + "')";

                    queryUKSektorEkonomi = queryUKSektorEkonomi + "('"
                    + uk_client_data[i].Nama_Lengkap
                    + "','"
                    + uk_client_data[i].ID_SektorEkonomi
                    + "','"
                    + uk_client_data[i].ID_SubSektorEkonomi
                    + "','"
                    + uk_client_data[i].Jenis_Usaha
                    + "')";

                    queryUKPendapatanNasabah = queryUKPendapatanNasabah + "('"
                    + uk_client_data[i].Nama_Lengkap
                    + "','"
                    + uk_client_data[i].PendapatanKotor_perHari
                    + "','"
                    + uk_client_data[i].PengeluaranKel_perHari
                    + "','"
                    + uk_client_data[i].PendapatanBersih_perHari
                    + "','"
                    + uk_client_data[i].JmlHariUsaha_perBulan
                    + "','"
                    + uk_client_data[i].PendapatanBersih_perBulan
                    + "','"
                    + uk_client_data[i].PendapatanBersih_perMinggu
                    + "','"
                    + uk_client_data[i].Nama_Pembiayaan_Lembaga_Lain
                    + "','"
                    + uk_client_data[i].Nama_Pembiayaan_Lembaga_Lain
                    + "','"
                    + ""
                    + "','"
                    + uk_client_data[i].Kemampuan_Angsuran
                    + "','"
                    + uk_client_data[i].PendapatanKotor_perHari_Suami
                    + "','"
                    + uk_client_data[i].PengeluaranKel_perHari_Suami
                    + "','"
                    + uk_client_data[i].PendapatanBersih_perHari_Suami
                    + "','"
                    + uk_client_data[i].JmlHariUsaha_perBulan_Suami
                    + "','"
                    + uk_client_data[i].PendapatanBersih_perBulan_Suami
                    + "','"
                    + uk_client_data[i].PendapatanBersih_perMinggu_Suami
                    + "')";

                    queryUKPermohonanPembiayaan = queryUKPermohonanPembiayaan + "('"
                    + uk_client_data[i].Nama_Lengkap
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
                    + key_tandaTanganNasabah
                    + "','"
                    + ""
                    + "','"
                    + key_tandaTanganKetuaSubKemlompok
                    + "','"
                    + key_tandaTanganKetuaKelompok
                    + "','"
                    + ""
                    + "','"
                    + ""
                    + "','"
                    + ""
                    + "','"
                    + ""
                    + "')";

                    if (i != uk_client_data.length - 1) {
                        queryUKDataDiri = queryUKDataDiri + ",";
                        queryUKPembiayaan = queryUKPembiayaan + ",";
                        queryUKKondisiRumah = queryUKKondisiRumah + ",";
                        queryUKSektorEkonomi = queryUKSektorEkonomi + ",";
                        queryUKPendapatanNasabah = queryUKPendapatanNasabah + ",";
                        queryUKPermohonanPembiayaan = queryUKPermohonanPembiayaan + ",";
                    }
                }

                queryUKDataDiri = queryUKDataDiri + ";";
                queryUKPembiayaan = queryUKPembiayaan + ";";
                queryUKKondisiRumah = queryUKKondisiRumah + ";";
                queryUKSektorEkonomi = queryUKSektorEkonomi + ";";
                queryUKPendapatanNasabah = queryUKPendapatanNasabah + ";";
                queryUKPermohonanPembiayaan = queryUKPermohonanPembiayaan + ";";

                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK DATA DIRI INSERT QUERY:', queryUKDataDiri);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK DATA PEMBIAYAAN INSERT QUERY:', queryUKPembiayaan);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK KONDISI RUMAH INSERT QUERY:', queryUKKondisiRumah);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK SEKTOR EKONOMI INSERT QUERY:', queryUKSektorEkonomi);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK PENDAPATAN NASABAH INSERT QUERY:', queryUKPendapatanNasabah);
                if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK PERMOHONAN PEMBIAYAAN INSERT QUERY:', queryUKPermohonanPembiayaan);

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
                    tx => { tx.executeSql(queryUKPermohonanPembiayaan); }, function(error) {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK PERMOHONAN PEMBIAYAAN INSERT TRANSACTION ERROR:', error);
                    }, function() {
                        if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE UK PERMOHONAN PEMBIAYAAN INSERT TRANSACTION DONE');
                    }
                );

                if (__DEV__) {
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

        if (![2].includes(params.prospekFilter)) {
            const body = JSON.stringify({
                "CreatedBy": "",
                "ID_Prospek": params.prospekMap,
                "IsPickClient": "1",
                "OurBranchID": params.cabangid.toString()
            });
            if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE BODY', body);

            const responseGetSosialisasiMobile = await fetch(postGetSosialisasiMobile, {
                method: 'POST',
                headers: {
                    Accept:
                        'application/json',
                        'Content-Type': 'application/json'
                    },
                body: body
            });

            const jsonGetSosialisasiMobile = await responseGetSosialisasiMobile.json(responseGetSosialisasiMobile);
            await insertGetSosialisasiMobile(jsonGetSosialisasiMobile);
            if (__DEV__) console.log('ACTIONS POST SYNC GET SOSIALISASI MOBILE DONE', jsonGetSosialisasiMobile);
        }

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
        AsyncStorage.setItem('JenisPembiayaan', JSON.stringify(jsonMasterData.data.jenisPembiayaan));
        AsyncStorage.setItem('SubjenisPembiayaan', JSON.stringify(jsonMasterData.data.subjenisPembiayaan));
        AsyncStorage.setItem('TujuanPembiayaan', JSON.stringify(jsonMasterData.data.tujuanPembiayaan));
        AsyncStorage.setItem('KategoritujuanPembiayaan', JSON.stringify(jsonMasterData.data.kategoritujuanPembiayaan));
        AsyncStorage.setItem('Frekuensi', JSON.stringify(jsonMasterData.data.Frekuensi));
        AsyncStorage.setItem('WilayahMobile', JSON.stringify(jsonMasterData.data.WilayahMobile));

        return;
    }

    resolve(fetchWaterfall());
});
