import React, {useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, StyleSheet, SafeAreaView, ScrollView, ToastAndroid, Alert } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Button } from 'react-native-elements'
import db from '../../database/Database';
import { ApiSyncPostInisiasi } from '../../../dataconfig/apisync/apisync'

const FormUjiKelayakan = ({route}) => {
    const { groupName, namaNasabah, nomorHandphone } = route.params;
    const dimension = Dimensions.get('screen');
    const navigation = useNavigation();

    let [currentDate, setCurrentDate] = useState('');
    let [dataDiri, setDataDiri] = useState(false);
    let [screenState, setScreenState] = useState(0);
    let [submitted, setSubmitted] = useState(false);
    let [branchId, setBranchId] = useState('');
    let [branchName, setBranchName] = useState('');
    let [uname, setUname] = useState('');
    let [aoName, setAoName] = useState('');
    let [nip, setNip] = useState('');

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setInfo();
            getUserData();
            getUKMaster();
        });
        return unsubscribe;
    }, [navigation]);

    const getUserData = () => {
        AsyncStorage.getItem('userData', (error, result) => {
            if (error) __DEV__ && console.log('userData error:', error);

            __DEV__ && console.log('userData response:', result);
            let data = JSON.parse(result);
            setBranchId(data.kodeCabang);
            setBranchName(data.namaCabang);
            setUname(data.userName);
            setAoName(data.AOname);
            setNip(data.nip);
        });
    }

    const setInfo = async () => {
        const tanggal = await AsyncStorage.getItem('TransactionDate')
        setCurrentDate(tanggal)
    }

    const getUKMaster = () => {
        let queryUKDataDiri = `SELECT * FROM Table_UK_Master WHERE namaNasabah = '` + namaNasabah + `';`
        db.transaction(
            tx => {
                tx.executeSql(queryUKDataDiri, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_Master length:', dataLength);
                    if (dataLength > 0) {
                        let data = results.rows.item(0);
                        setScreenState(parseInt(data.status));
                    }
                    
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_Master error:', error.message);
                })
            }
        )
    }

    const submitHandler = () => null

    const doSubmit = () => {
        if (__DEV__) console.log('doSubmit loaded');

        if (submitted) return true;

        setSubmitted(true);

        let query = 'SELECT a.*, b.jenis_Pembiayaan, b.nama_Produk, b.produk_Pembiayaan as value_produk_Pembiayaan, b.jumlah_Pinjaman, b.term_Pembiayaan, b.kategori_Tujuan_Pembiayaan, b.tujuan_Pembiayaan, b.type_Pencairan, b.frekuensi_Pembayaran, b.status_Rekening_Bank, b.nama_Bank, b.no_Rekening, b.pemilik_Rekening, c.luas_Bangunan, c.kondisi_Bangunan, c.jenis_Atap, c.dinding, c.lantai, c.sanitasi_Akses_AirBersih, c.sanitasi_KamarMandi, d.sektor_Ekonomi, d.sub_Sektor_Ekonomi, d.jenis_Usaha, e.pendapatan_Kotor_perhari, e.pengeluaran_Keluarga_Perhari, e.pendapatan_Bersih_Perhari, e.jumlah_Hari_Usaha_Perbulan, e.pendapatan_Bersih_Perbulan, e.pendapatan_Bersih_Perminggu, e.pembiayaan_Dari_Lembaga, e.Pembiayaan_Dari_LembagaLain, e.Pembiayaan_Dari_LembagaLainFreetext, e.jumlah_Angsuran, e.pendapatanSuami_Kotor_Perhari, e.pendapatanSuami_Pengeluaran_Keluarga_Perhari, e.pendapatanSuami_Pendapatan_Bersih_Perhari, e.pendapatanSuami_jumlah_Hari_Usaha_Perbulan, e.pendapatanSuami_pendapatan_Bersih_Perbulan, e.pendapatanSuami_pendapatan_Bersih_Perminggu, f.produk_Pembiayaan, f.jumlah_Pembiayaan_Diajukan, f.jangka_Waktu, f.frekuensi_Pembiayaan, f.tanda_Tangan_AOSAO, f.tanda_Tangan_Nasabah, f.tanda_Tangan_SuamiPenjamin, f.tanda_Tangan_Ketua_SubKelompok, f.tanda_Tangan_Ketua_Kelompok, f.nama_tanda_Tangan_Nasabah, f.nama_tanda_Tangan_SuamiPenjamin, f.nama_tanda_Tangan_Ketua_SubKelompok, f.nama_tanda_Tangan_Ketua_Kelompok FROM Table_UK_DataDiri a LEFT JOIN Table_UK_ProdukPembiayaan b ON a.nama_lengkap = b.nama_lengkap LEFT JOIN Table_UK_KondisiRumah c ON a.nama_lengkap = c.nama_lengkap LEFT JOIN Table_UK_SektorEkonomi d ON a.nama_lengkap = d.nama_lengkap LEFT JOIN Table_UK_PendapatanNasabah e ON a.nama_lengkap = e.nama_lengkap LEFT JOIN Table_UK_PermohonanPembiayaan f ON a.nama_lengkap = f.nama_lengkap WHERE a.nama_lengkap = "' + namaNasabah + '"';
        db.transaction(
            tx => {
                tx.executeSql(query, [], async (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri length:', dataLength);
                    if (dataLength > 0) {
                        let data = results.rows.item(0);
                        if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri data:', data);

                        let fotoDataPenjamin = data.foto_ktp_penjamin ? await AsyncStorage.getItem(data.foto_ktp_penjamin) : 'data:image/jpeg;base64,';
                        let fotoDataSuami = data.foto_ktp_suami ?  await AsyncStorage.getItem(data.foto_ktp_suami) : 'data:image/jpeg;base64,';
                        let fotoKartuKeluarga = data.foto_kk ? await AsyncStorage.getItem(data.foto_kk) : 'data:image/jpeg;base64,';
                        let fotoKeteranganDomisili = data.foto_Surat_Keterangan_Domisili ? await AsyncStorage.getItem(data.foto_Surat_Keterangan_Domisili) : 'data:image/jpeg;base64,';
                        let fotoKartuIdentitas = data.foto_Kartu_Identitas ? await AsyncStorage.getItem(data.foto_Kartu_Identitas) : 'data:image/jpeg;base64,';

                        const tandaTanganAOSAO = await AsyncStorage.getItem(data.tanda_Tangan_AOSAO);
                        const tandaTanganNasabah = await AsyncStorage.getItem(data.tanda_Tangan_Nasabah);
                        const tandaTanganSuamiPenjamin = await AsyncStorage.getItem(data.tanda_Tangan_SuamiPenjamin);
                        const tandaTanganKetuaSubKemlompok = await AsyncStorage.getItem(data.tanda_Tangan_Ketua_SubKelompok);
                        const tandaTanganKetuaKelompok = await AsyncStorage.getItem(data.tanda_Tangan_Ketua_Kelompok);

                        let namaBank = data.nama_Bank;
                        let noRekening = data.no_Rekening;
                        let pemilikRekening = data.pemilik_Rekening;
                        if (data.status_Rekening_Bank === 'false') {
                            namaBank = "null";
                            noRekening = "null";
                            pemilikRekening = "null";
                        }

                        let pembiayaan_Dari_Lembaga = '0';
                        let Pembiayaan_Dari_LembagaLain = 'null';
                        if (["2", "3"].includes(data.pembiayaan_Dari_Lembaga) && ["3"].includes(data.Pembiayaan_Dari_LembagaLain)) {
                            pembiayaan_Dari_Lembaga = '1';
                            Pembiayaan_Dari_LembagaLain = data.Pembiayaan_Dari_LembagaLainFreetext;
                        }
                        if (["2", "3"].includes(data.pembiayaan_Dari_Lembaga) && !["3"].includes(data.Pembiayaan_Dari_LembagaLain)) {
                            pembiayaan_Dari_Lembaga = '1';
                            Pembiayaan_Dari_LembagaLain = data.Pembiayaan_Dari_LembagaLain;
                        }
                        
                        let namaProduk = data.produk_Pembiayaan;

                        let idProspek = "";
                        if ((data.id_prospek !== null && data.id_prospek !== "" && typeof data.id_prospek !== 'undefined')) idProspek = data.id_prospek;

                        const body = {
                            "Alamat": data.alamat_Identitas,
                            "AlamatDomisili": data.alamat_Domisili,
                            "Berdasarkan_Kemampuan_Angsuran": data.frekuensi_Pembayaran,
                            "Berdasarkan_Lembaga_Lain": pembiayaan_Dari_Lembaga, // masih ragu
                            "Berdasarkan_Tingkat_Pendapatan": "1",
                            "CreatedBy": uname,
                            "CreatedNIP": nip,
                            "Dinding": data.dinding,
                            "FotoKK": fotoKartuKeluarga.split(',')[1],
                            "FotoKTPPenjamin": fotoDataPenjamin.split(',')[1],
                            "FotoKTPSuami": fotoDataSuami === null || fotoDataSuami === 'null' ? '' : fotoDataSuami.split(',')[1],
                            "FotoKartuIdentitas": fotoKartuIdentitas.split(',')[1],
                            "FotoSuketDomisili": fotoKeteranganDomisili === null || fotoKeteranganDomisili === 'null' ? '' : fotoKeteranganDomisili.split(',')[1],
                            "FrekuensiPembiayaan": data.frekuensi_Pembayaran,
                            "ID_SektorEkonomi": data.sektor_Ekonomi,
                            "ID_SubSektorEkonomi": data.sub_Sektor_Ekonomi,
                            "IsAdaRekening": data.status_Rekening_Bank === 'true' ? '1' : '0',
                            "IsSuamiDitempat": data.suami_diluar_kota === 'true' ? '1' : '0',
                            "Is_AdaAdaToiletPribadi": data.sanitasi_KamarMandi === 'true' ? '1' : '0',
                            "Is_AdaAksesAirBersih": data.sanitasi_Akses_AirBersih === 'true' ? '1' : '0',
                            "Is_AdaPembiayaanLain": pembiayaan_Dari_Lembaga,
                            "JenisAtap": data.jenis_Atap,
                            "JenisIdentitas": data.jenis_Kartu_Identitas,
                            "JenisPembiayaan": data.jenis_Pembiayaan,
                            "Jenis_Usaha": data.jenis_Usaha,
                            "JmlHariUsaha_perBulan": data.jumlah_Hari_Usaha_Perbulan,
                            "JmlHariUsaha_perBulan_Suami": data.pendapatanSuami_jumlah_Hari_Usaha_Perbulan,
                            "JmlhAnak": data.jumlah_anak,
                            "JmlhTanggungan": data.jumlah_tanggungan,
                            "JumlahPinjaman": data.jumlah_Pinjaman,
                            "Kabupaten": data.kabupaten,
                            "KategoriTujuanPembiayaan": data.kategori_Tujuan_Pembiayaan,
                            "Kecamatan": data.kecamatan,
                            "Kelurahan": data.kelurahan,
                            "Latitude": data.latitude,
                            "Longitude": data.longitude,
                            "Kemampuan_Angsuran": data.frekuensi_Pembayaran,
                            "KondisiBangunan": data.kondisi_Bangunan,
                            "LamaTinggal": data.lama_tinggal,
                            "Lantai": data.lantai,
                            "LokasiSos": groupName,
                            "LokasiUK": groupName,
                            "LuasBangunan": data.luas_Bangunan,
                            "NamaAyah": data.nama_ayah,
                            "NamaGadisIBU": data.nama_gadis_ibu,
                            "NamaBank": namaBank,
                            "NamaLengkap": data.nama_lengkap, // double
                            "NamaPemilikRekening": pemilikRekening, // double
                            "NamaPenjamin": data.nama_penjamin,
                            "NamaProduk": namaProduk,
                            "NamaSuami": data.nama_suami,
                            "PekerjaanSuami": data.usaha_pekerjaan_suami,
                            "JmlTenagaKerja": data.jumlah_tenaga_kerja_suami,
                            "Nama_Pembiayaan_Lembaga_Lain": Pembiayaan_Dari_LembagaLain,
                            "NoHP": data.no_tlp_nasabah,
                            "IDAgama": data.agama,
                            "NoKK": data.no_kk,
                            "NoRekening": noRekening, // double
                            "NomorIdentitas": data.nomor_Identitas,
                            "NomorRekening": noRekening, // double
                            "OurBranchID": branchId,
                            "PemilikRekening": pemilikRekening, // double
                            "PendapatanBersih_perBulan": data.pendapatan_Bersih_Perbulan,
                            "PendapatanBersih_perBulan_Suami": data.pendapatanSuami_pendapatan_Bersih_Perbulan,
                            "PendapatanBersih_perHari": data.pendapatan_Bersih_Perhari,
                            "PendapatanBersih_perHari_Suami": data.pendapatanSuami_Pendapatan_Bersih_Perhari,
                            "PendapatanBersih_perMinggu": data.pendapatan_Bersih_Perminggu,
                            "PendapatanBersih_perMinggu_Suami": data.pendapatanSuami_pendapatan_Bersih_Perminggu,
                            "PendapatanKotor_perHari": data.pendapatan_Kotor_perhari,
                            "PendapatanKotor_perHari_Suami": data.pendapatanSuami_Kotor_Perhari,
                            "PengeluaranKel_perHari": data.pengeluaran_Keluarga_Perhari,
                            "PengeluaranKel_perHari_Suami": data.pendapatanSuami_Pengeluaran_Keluarga_Perhari,
                            "ProdukPembiayaan": data.produk_Pembiayaan,
                            "Provinsi": data.provinsi,
                            "StatusPenjamin": data.status_hubungan_keluarga,
                            "StatusRumah": data.status_rumah_tinggal,
                            "Status_Perkawinan": data.status_Perkawinan,
                            "TTD_AO": tandaTanganAOSAO.split(',')[1] || 'null',
                            "TTD_KK": tandaTanganKetuaKelompok.split(',')[1] || 'null',
                            "TTD_KSK": tandaTanganKetuaSubKemlompok.split(',')[1] || 'null',
                            "TTD_Nasabah": tandaTanganNasabah.split(',')[1] || 'null',
                            "TTD_Penjamin": tandaTanganSuamiPenjamin.split(',')[1] || 'null',
                            "TanggalLahir": data.tanggal_Lahir,
                            "TempatLahir": data.tempat_lahir,
                            "TermPembiayaan": data.term_Pembiayaan,
                            "TujuanPembiayaan": data.tujuan_Pembiayaan,
                            "TypePencairan": data.type_Pencairan,
                            "IsPernyataanDibaca": data.is_pernyataan_dibaca,
                            "ID_Prospek": idProspek,
                            "IDProduk": data.nama_Produk,
                            "IDProdukPembiayaan": data.value_produk_Pembiayaan,
                            "Nama_TTD_AO": aoName,
                            "Nama_TTD_KK": data.nama_tanda_Tangan_Ketua_Kelompok,
                            "Nama_TTD_KSK": data.nama_tanda_Tangan_Ketua_SubKelompok,
                            "Nama_TTD_Nasabah": data.nama_tanda_Tangan_Nasabah,
                            "Nama_TTD_Penjamin": data.nama_tanda_Tangan_SuamiPenjamin
                        }
                        if (__DEV__) console.log('doSubmit body:', JSON.stringify(body));

                        fetch(ApiSyncPostInisiasi + 'post_prospek_uk', {
                            method: 'POST',
                            headers: {
                                Accept:
                                    'application/json',
                                    'Content-Type': 'application/json'
                                },
                            body: JSON.stringify(body)
                        })
                        .then((response) => response.json())
                        .then((responseJSON) => {
                            if (__DEV__) console.error('$post /post_inisiasi/post_prospek_uk response', responseJSON);

                            if (responseJSON.responseCode === 200) {
                                const find = 'SELECT * FROM Table_UK_Master WHERE namaNasabah = "'+ namaNasabah +'"';
                                db.transaction(
                                    tx => {
                                        tx.executeSql(find, [], (txFind, resultsFind) => {
                                            let dataLengthFind = resultsFind.rows.length
                                            if (__DEV__) console.log('db.transaction resultsFind:', resultsFind.rows);

                                            let query = '';
                                            if (dataLengthFind === 0) {
                                                alert('UK Master not found');
                                                navigation.goBack();
                                                return;
                                            }

                                            query = 'UPDATE Table_UK_Master SET status = "7" WHERE namaNasabah = "' + namaNasabah + '"';

                                            if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update query:', query);

                                            db.transaction(
                                                tx => {
                                                    tx.executeSql(query);
                                                }, function(error) {
                                                    if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update error:', error.message);
                                                    setSubmitted(false);
                                                },function() {
                                                    if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction insert/update success');
                                                    if (__DEV__) {
                                                        db.transaction(
                                                            tx => {
                                                                tx.executeSql("SELECT * FROM Table_UK_Master", [], (tx, results) => {
                                                                    if (__DEV__) console.log('SELECT * FROM Table_UK_Master RESPONSE:', results.rows);
                                                                })
                                                            }, function(error) {
                                                                if (__DEV__) console.log('SELECT * FROM Table_UK_Master ERROR:', error);
                                                            }, function() {}
                                                        );
                                                    }

                                                    const queryDeleteSosialisasiDatabase = "DELETE FROM Sosialisasi_Database WHERE namaCalonNasabah = '" + namaNasabah + "'";
                                                    const queryDeleteUKDataDiri = "DELETE FROM Table_UK_DataDiri WHERE nama_lengkap = '" + namaNasabah + "'";
                                                    const queryDeleteUKProdukPembiayaan = "DELETE FROM Table_UK_ProdukPembiayaan WHERE nama_lengkap = '" + namaNasabah + "'";
                                                    const queryDeleteUKKondisiRumah = "DELETE FROM Table_UK_KondisiRumah WHERE nama_lengkap = '" + namaNasabah + "'";
                                                    const queryDeleteUKSektorEkonomi = "DELETE FROM Table_UK_SektorEkonomi WHERE nama_lengkap = '" + namaNasabah + "'";
                                                    const queryDeleteUKPendapatanNasabah = "DELETE FROM Table_UK_PendapatanNasabah WHERE nama_lengkap = '" + namaNasabah + "'";
                                                    const queryDeleteUKPermohonanPembiayaan = "DELETE FROM Table_UK_PermohonanPembiayaan WHERE nama_lengkap = '" + namaNasabah + "'";
                                                    db.transaction(
                                                        tx => {
                                                            tx.executeSql(queryDeleteSosialisasiDatabase, [], (tx, results) => {
                                                                if (__DEV__) console.log(`${queryDeleteSosialisasiDatabase} RESPONSE:`, results.rows);
                                                            })
                                                        }, function(error) {
                                                            if (__DEV__) console.log(`${queryDeleteSosialisasiDatabase} ERROR:`, error);
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
                                                    
                                                    /* ============ START REMOVE STORAGE ============ */
                                                    AsyncStorage.removeItem(data.foto_ktp_penjamin);
                                                    AsyncStorage.removeItem(data.foto_ktp_suami);
                                                    AsyncStorage.removeItem(data.foto_kk);
                                                    AsyncStorage.removeItem(data.foto_Surat_Keterangan_Domisili);
                                                    AsyncStorage.removeItem(data.foto_Kartu_Identitas);

                                                    AsyncStorage.removeItem(data.tanda_Tangan_AOSAO);
                                                    AsyncStorage.removeItem(data.tanda_Tangan_Nasabah);
                                                    AsyncStorage.removeItem(data.tanda_Tangan_SuamiPenjamin);
                                                    AsyncStorage.removeItem(data.tanda_Tangan_Ketua_SubKelompok);
                                                    AsyncStorage.removeItem(data.tanda_Tangan_Ketua_Kelompok);
                                                    /* ============ FINISH REMOVE STORAGE ============ */

                                                    const message = responseJSON.data[0].Status_Kelayakan || 'Berhasil';
                                                    Alert.alert(responseJSON.responseDescription, message);
                                                    setSubmitted(false);
                                                    navigation.goBack();
                                                }
                                            );
                                        }, function(error) {
                                            if (__DEV__) console.log('doSubmitDataIdentitasDiri db.transaction find error:', error.message);
                                            setSubmitted(false);
                                        })
                                    }
                                );

                                return true;
                            }

                            Alert.alert('Error', responseJSON.responseDescription);
                            setSubmitted(false);
                        })
                        .catch((error) => {
                            console.error('$post /post_inisiasi/post_prospek_uk response', error);
                            ToastAndroid.show(error.message || 'Something went wrong', ToastAndroid.SHORT);
                            setSubmitted(false);
                        });
                    }
                }, function(error) {
                    if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri error 3:', error.message);
                    ToastAndroid.show(error.message || 'Something went wrong', ToastAndroid.SHORT);
                    setSubmitted(false);
                })
            }
        )
    }

    return(
        <View style={{backgroundColor: "#ECE9E4", width: dimension.width, height: dimension.height, flex: 1}}>
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                marginTop: 40,
                alignItems: "center",
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity onPress={() => navigation.replace('UjiKelayakan', {groupName: groupName})} style={{flexDirection: "row", alignItems: "center", backgroundColor: "#BCC8C6", borderRadius: 10}}>
                    <View>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#2e2e2e" />
                    </View>
                    <Text style={{fontSize: 18, paddingHorizontal: 15, fontWeight: 'bold'}}>UJI KELAYAKAN</Text>
                </TouchableOpacity>
            </View>

            <View style={{height: dimension.height/5, marginHorizontal: 30, borderRadius: 20, marginTop: 30}}>
                <ImageBackground source={require("../../../assets/Image/Banner.png")} style={{flex: 1, resizeMode: "cover", justifyContent: 'center'}} imageStyle={{borderRadius: 20}}>
                    <Text style={{marginHorizontal: 35, fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>Form Uji Kelayakan</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{groupName}</Text>
                    <Text style={{marginHorizontal: 35, fontSize: 15, fontWeight: 'bold', color: '#FFF', marginBottom: 5}}>{namaNasabah}</Text>
                </ImageBackground>
            </View>

            <View style={{flex: 1, marginHorizontal: 20, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FFF'}}>
                <Text style={{fontSize: 30, fontWeight: 'bold', margin: 20}}>Form Uji Kelayakan</Text>

                <ScrollView style={{flex: 1, marginTop: 10, marginHorizontal: 10}}>

                    <TouchableOpacity onPress={() => navigation.navigate('DataDiri', {groupName: groupName, namaNasabah: namaNasabah, nomorHandphone: nomorHandphone, screenState: screenState})} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: '#0c5da0'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'address-card'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Data Diri Pribadi</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={screenState > 0}
                                fillColor={screenState > 0 ? 'green' : 'white'}
                                disableBuiltInState
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => screenState > 0 ? navigation.navigate('ProdukPembiayaan', {groupName: groupName, namaNasabah: namaNasabah, screenState:screenState}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 0 ? '#0c5da0' : 'gray'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'product-hunt'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Produk Pembiayaan</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={screenState > 1}
                                fillColor={screenState > 1 ? 'green' : 'white'}
                                disableBuiltInState
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => screenState > 1 ? navigation.navigate('InisiasiFormUKKondisiRumah', {groupName: groupName, namaNasabah: namaNasabah, screenState:screenState}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 1 ? '#0c5da0' : 'gray'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'home'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Kondisi Rumah</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={screenState > 2}
                                fillColor={screenState > 2 ? 'green' : 'white'}
                                disableBuiltInState
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => screenState > 2 ? navigation.navigate('InisiasiFormUKSektorEkonomi', {groupName: groupName, namaNasabah: namaNasabah, screenState:screenState}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 2 ? '#0c5da0' : 'gray'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'sellsy'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Sektor Ekonomi</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={screenState > 3}
                                fillColor={screenState > 3 ? 'green' : 'white'}
                                disableBuiltInState
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => screenState > 3 ? navigation.navigate('InisiasiFormUKTingkatPendapatan', {groupName: groupName, namaNasabah: namaNasabah, screenState:screenState}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 3 ? '#0c5da0' : 'gray'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'chart-area'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Tingkat Pendapatan</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={screenState > 4}
                                fillColor={screenState > 4 ? 'green' : 'white'}
                                disableBuiltInState
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => screenState > 4 ? navigation.navigate('InisiasiFormUKTandaTanganPermohonan', {groupName: groupName, namaNasabah: namaNasabah, screenState: screenState}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 4 ? '#0c5da0' : 'gray'}}>
                        <View style={{margin: 10, padding: 10, borderRadius: 15, backgroundColor: '#D62828'}}>
                            <FontAwesome5 name={'signature'} size={25} color={'#FFF'} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text numberOfLines={2} style={{fontWeight: 'bold', fontSize: 18, color: '#FFF'}}>Tandatangan dan Permohonan</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <BouncyCheckbox 
                                size={20}
                                isChecked={screenState > 5}
                                fillColor={screenState > 5 ? 'green' : 'white'}
                                disableBuiltInState
                            />
                        </View>
                    </TouchableOpacity>

                    {screenState < 7 && (
                        <View style={{alignItems: 'center', marginBottom: 20}}>
                            <Button
                                title={submitted ? 'MENGIRIM...' : "KIRIM UK"}
                                onPress={() => screenState > 5 ? doSubmit() : null}
                                buttonStyle={{backgroundColor: screenState > 5 ? '#D62828' : 'gray', width: dimension.width/2}}
                                titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                            />
                        </View>
                    )}

                </ScrollView>

            </View>
        </View>
    )
}

export default FormUjiKelayakan

const styles = StyleSheet.create({
    
})