import React, {useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, Dimensions, ImageBackground, StyleSheet, SafeAreaView, ScrollView, ToastAndroid } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Button } from 'react-native-elements'
import db from '../../database/Database';
import { ApiSyncPostInisiasi } from '../../../dataconfig/apisync/apisync'

const FormUjiKelayakan = ({route}) => {
    const { groupName, namaNasabah } = route.params
    const dimension = Dimensions.get('screen')
    const navigation = useNavigation()

    let [currentDate, setCurrentDate] = useState();
    let [dataDiri, setDataDiri] = useState(false);
    let [screenState, setScreenState] = useState(0);
    let [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setInfo();
            getUKMaster();
        });
        return unsubscribe;
    }, [navigation]);

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

    const doSubmit = async () => {
        if (__DEV__) console.log('doSubmit loaded');

        if (submitted) return true;

        setSubmitted(true);

        const fotoDataPenjamin = await AsyncStorage.getItem(`formUK_dataPenjamin_${namaNasabah}`);
        const fotoDataSuami = await AsyncStorage.getItem(`formUK_dataSuami_${namaNasabah}`);
        const fotoKartuKeluarga = await AsyncStorage.getItem(`formUK_kartuKeluarga_${namaNasabah}`);
        const fotoKeteranganDomisili = await AsyncStorage.getItem(`formUK_keteranganDomisili_${namaNasabah}`);
        const fotoKartuIdentitas = await AsyncStorage.getItem(`formUK_kartuIdentitas_${namaNasabah}`);

        let query = 'SELECT a.*, b.jenis_Pembiayaan, b.nama_Produk, b.produk_Pembiayaan, b.jumlah_Pinjaman, b.term_Pembiayaan, b.kategori_Tujuan_Pembiayaan, b.tujuan_Pembiayaan, b.type_Pencairan, b.frekuensi_Pembayaran, b.status_Rekening_Bank, b.nama_Bank, b.no_Rekening, b.pemilik_Rekening, c.luas_Bangunan, c.kondisi_Bangunan, c.jenis_Atap, c.dinding, c.lantai, c.sanitasi_Akses_AirBersih, c.sanitasi_KamarMandi, d.sektor_Ekonomi, d.sub_Sektor_Ekonomi, d.jenis_Usaha, e.pendapatan_Kotor_perhari, e.pengeluaran_Keluarga_Perhari, e.pendapatan_Bersih_Perhari, e.jumlah_Hari_Usaha_Perbulan, e.pendapatan_Bersih_Perbulan, e.pendapatan_Bersih_Perminggu, e.pembiayaan_Dari_Lembaga, e.Pembiayaan_Dari_LembagaLain, e.Pembiayaan_Dari_LembagaLainFreetext, e.jumlah_Angsuran, e.pendapatanSuami_Kotor_Perhari, e.pendapatanSuami_Pengeluaran_Keluarga_Perhari, e.pendapatanSuami_Pendapatan_Bersih_Perhari, e.pendapatanSuami_jumlah_Hari_Usaha_Perbulan, e.pendapatanSuami_pendapatan_Bersih_Perbulan, e.pendapatanSuami_pendapatan_Bersih_Perminggu, f.produk_Pembiayaan, f.jumlah_Pembiayaan_Diajukan, f.jangka_Waktu, f.frekuensi_Pembiayaan, f.tanda_Tangan_Nasabah, f.tanda_Tangan_SuamiPenjamin, f.tanda_Tangan_Ketua_SubKelompok, f.tanda_Tangan_Ketua_Kelompok FROM Table_UK_DataDiri a LEFT JOIN Table_UK_ProdukPembiayaan b ON a.nama_lengkap = b.nama_lengkap LEFT JOIN Table_UK_KondisiRumah c ON a.nama_lengkap = c.nama_lengkap LEFT JOIN Table_UK_SektorEkonomi d ON a.nama_lengkap = d.nama_lengkap LEFT JOIN Table_UK_PendapatanNasabah e ON a.nama_lengkap = e.nama_lengkap LEFT JOIN Table_UK_PermohonanPembiayaan f ON a.nama_lengkap = f.nama_lengkap WHERE a.nama_lengkap = "' + namaNasabah + '"';
        db.transaction(
            tx => {
                tx.executeSql(query, [], (tx, results) => {
                    let dataLength = results.rows.length;
                    if (__DEV__) console.log('SELECT * FROM Table_UK_DataDiri length:', dataLength);
                    if (dataLength > 0) {
                        let data = results.rows.item(0);
                        const body = {
                            "Alamat": "1",
                            "AlamatDomisili": "1",
                            "AlamatPenjamin": "1",
                            "Berdasarkan_Kemampuan_Angsuran": "1",
                            "Berdasarkan_Lembaga_Lain": "1",
                            "Berdasarkan_Tingkat_Pendapatan": "1",
                            "CreatedBy": "1",
                            "CreatedNIP": "1",
                            "DaerahTinggal": "1",
                            "Dinding": "1",
                            "FotoKK": fotoKartuKeluarga,
                            "FotoKTPPenjamin": fotoDataPenjamin,
                            "FotoKTPSuami": fotoDataSuami,
                            "FotoKartuIdentitas": fotoKartuIdentitas,
                            "FotoPenjamin": "1",
                            "FotoProspek": "1",
                            "FotoRumah1": "1",
                            "FotoRumah2": "1",
                            "FotoSuami": "1",
                            "FotoSuketDomisili": fotoKeteranganDomisili,
                            "Foto_Dinding": "1",
                            "Foto_Jenis_Atap": "1",
                            "Foto_Lantai": "1",
                            "Foto_PraRenov": "1",
                            "Foto_RAB": "1",
                            "Foto_Usaha": "1",
                            "FrekuensiPembiayaan": data.frekuensi_Pembiayaan,
                            "IDAgama": "1",
                            "IDJenisPekerjaanSuami": "1",
                            "ID_SektorEkonomi": "1",
                            "ID_SubSektorEkonomi": "1",
                            "IsAdaRekening": "1",
                            "IsDitempat": "1",
                            "IsPernyataanDibaca": "1",
                            "IsProductVerified": "1",
                            "IsSesuaiDukcapil": "1",
                            "IsSuami": "1",
                            "Is_AdaAdaToiletPribadi": "1",
                            "Is_AdaAksesAirBersih": "1",
                            "Is_AdaKMPribadi": "1",
                            "Is_AdaPembiayaanLain": "1",
                            "Is_AdaToiletPribadi": "1",
                            "Is_AirBerasa": "1",
                            "Is_AirBerbau": "1",
                            "Is_AirBerlumpur": "1",
                            "Is_AirBerwarna": "1",
                            "Is_AirNormal": "1",
                            "Is_AirRefill_utkMandi": "1",
                            "Is_AirRefill_utkMinum": "1",
                            "Is_AtapKM_Terbuka": "1",
                            "Is_AtapKM_Tertutup": "1",
                            "Is_AtapWC_Terbuka": "1",
                            "Is_AtapWC_Tertutup": "1",
                            "Is_Atap_Anyaman": "1",
                            "Is_Atap_Galvalum": "1",
                            "Is_Atap_None": "1",
                            "Is_BakAirWC_Ember": "1",
                            "Is_BakAirWC_Fiber": "1",
                            "Is_BakAirWC_Keramik": "1",
                            "Is_BakAirWC_Semen": "1",
                            "Is_BakAir_Ember": "1",
                            "Is_BakAir_Fiber": "1",
                            "Is_BakAir_Keramik": "1",
                            "Is_BakAir_Semen": "1",
                            "Is_BeliAirMandi": "1",
                            "Is_BeliAirMinum": "1",
                            "Is_DPVerified": "1",
                            "Is_DebitAirBerlimpah": "1",
                            "Is_DebitAirKering": "1",
                            "Is_DebitAirNormal": "1",
                            "Is_DindingKM_Anyaman": "1",
                            "Is_DindingKM_BatakoBata": "1",
                            "Is_DindingKM_KayuBambu": "1",
                            "Is_DindingKM_TerbukaSebagian": "1",
                            "Is_DindingKM_Tertutup": "1",
                            "Is_DindingWC_Anyaman": "1",
                            "Is_DindingWC_BatakoBata": "1",
                            "Is_DindingWC_KayuBambu": "1",
                            "Is_DindingWC_TerbukaSebagian": "1",
                            "Is_DindingWC_Tertutup": "1",
                            "Is_Dinding_None": "1",
                            "Is_Dinding_Tertutup": "1",
                            "Is_Dinding_TertutupSebagian": "1",
                            "Is_KMdanToiletTerpisah": "1",
                            "Is_KRVerified": "1",
                            "Is_Lainnya_utkMandi": "1",
                            "Is_Lainnya_utkMinum": "1",
                            "Is_LantaiKM_KayuBambu": "1",
                            "Is_LantaiKM_Keramik": "1",
                            "Is_LantaiKM_Semen": "1",
                            "Is_LantaiKM_Tanah": "1",
                            "Is_LantaiWC_KayuBambu": "1",
                            "Is_LantaiWC_Keramik": "1",
                            "Is_LantaiWC_Semen": "1",
                            "Is_LantaiWC_Tanah": "1",
                            "Is_Lantai_KayuBambu": "1",
                            "Is_Lantai_Keramik": "1",
                            "Is_Lantai_None": "1",
                            "Is_Lantai_Semen": "1",
                            "Is_MAtaAir_utkMinum": "1",
                            "Is_MataAir_utkMandi": "1",
                            "Is_Material_Batako": "1",
                            "Is_Material_GRC": "1",
                            "Is_Material_KayuBambu": "1",
                            "Is_Material_None": "1",
                            "Is_Material_Seng": "1",
                            "Is_PDAM_utkMandi": "1",
                            "Is_PDAM_utkMinum": "1",
                            "Is_REnov_Baru": "1",
                            "Is_Renov_Atap": "1",
                            "Is_Renov_Dinding": "1",
                            "Is_Renov_Existing": "1",
                            "Is_Renov_Lainnya": "1",
                            "Is_Renov_Lantai": "1",
                            "Is_SEVerified": "1",
                            "Is_SUmur_utkMinum": "1",
                            "Is_SewerWC_Kolam": "1",
                            "Is_SewerWC_SaluranAir": "1",
                            "Is_SewerWC_SepticTank": "1",
                            "Is_SewerWC_Sungai": "1",
                            "Is_Sewer_Kolam": "1",
                            "Is_Sewer_SaluranAir": "1",
                            "Is_Sewer_SepticTank": "1",
                            "Is_Sewer_Sungai": "1",
                            "Is_Sumur_utkMandi": "1",
                            "Is_TPVerified": "1",
                            "Is_WC_Duduk": "1",
                            "Is_WC_Jamban": "1",
                            "Is_WC_Jongkok": "1",
                            "Is_WC_NonJamban": "1",
                            "JenisAtap": "1",
                            "JenisIdentitas": "1",
                            "JenisIdentitasPenjamin": "1",
                            "JenisKelamin": "1",
                            "JenisPembiayaan": "1",
                            "Jenis_Usaha": "1",
                            "JmlHariUsaha_perBulan": "1",
                            "JmlHariUsaha_perBulan_Suami": "1",
                            "JmlhAnak": "1",
                            "JmlhTanggungan": "1",
                            "JumlahPinjaman": "1",
                            "Jumlah_Pendapatan_Bersih": "1",
                            "Kabupaten": "1",
                            "KategoriTujuanPembiayaan": "1",
                            "Kecamatan": "1",
                            "Kelurahan": "1",
                            "Kemampuan_Angsuran": "1",
                            "Ket_Renov_Lainnya": "1",
                            "KodePOS": "1",
                            "KondisiBangunan": "1",
                            "LamaTinggal": "1",
                            "LanjutUK": "1",
                            "Lantai": "1",
                            "Lbr_Atap": "1",
                            "Lbr_Dinding": "1",
                            "Lbr_Lt": "1",
                            "LokasiSos": "1",
                            "LokasiTinggal": "1",
                            "LokasiUK": "1",
                            "Lokasi_Usaha_1": "1",
                            "Lokasi_Usaha_2": "1",
                            "LuasBangunan": "1",
                            "NamaAyah": "1",
                            "NamaBank": "1",
                            "NamaBankPemilik": "1",
                            "NamaCalonNasabah": "1",
                            "NamaGadisIBU": "1",
                            "NamaLengkap": "1",
                            "NamaPemilikRekening": "1",
                            "NamaPenjamin": "1",
                            "NamaProduk": "1",
                            "NamaSuami": "1",
                            "Nama_Pembiayaan_Lembaga_Lain": "1",
                            "Nama_Tipe": "1",
                            "Nilai_Total": "1",
                            "NoHP": "1",
                            "NoIdentitasPenjamin": "1",
                            "NoKK": "1",
                            "NoRekening": "1",
                            "NoTelp": "1",
                            "NoTelpPenjamin": "1",
                            "NomorIdentitas": "1",
                            "NomorRekening": "1",
                            "OurBranchID": "1",
                            "Pekerjaan": "1",
                            "PekerjaanSuami": "1",
                            "PemilikRekening": "1",
                            "PendapatanBersih_perBulan": "1",
                            "PendapatanBersih_perBulan_Suami": "1",
                            "PendapatanBersih_perHari": "1",
                            "PendapatanBersih_perHari_Suami": "1",
                            "PendapatanBersih_perMinggu": "1",
                            "PendapatanBersih_perMinggu_Suami": "1",
                            "PendapatanKotor_perHari": "1",
                            "PendapatanKotor_perHari_Suami": "1",
                            "Pendidikan": "1",
                            "PendidikanAnak": "1",
                            "PendidikanTerkahirSuami": "1",
                            "PengeluaranKel_perHari": "1",
                            "PengeluaranKel_perHari_Suami": "1",
                            "Pj_Atap": "1",
                            "Pj_Dinding": "1",
                            "Pj_Lt": "1",
                            "ProdukPembiayaan": "1",
                            "RT": "1",
                            "RW": "1",
                            "RekeningBank": "1",
                            "Siklus": "1",
                            "Sisipan": "1",
                            "StatusPenjamin": "1",
                            "StatusRumah": "1",
                            "Status_Perkawinan": "1",
                            "Sumber": "1",
                            "TTD_AO": data.tanda_Tangan_Nasabah,
                            "TTD_KC_SAO": data.tanda_Tangan_Nasabah,
                            "TTD_KK": data.tanda_Tangan_Nasabah,
                            "TTD_KSK": data.tanda_Tangan_Nasabah,
                            "TTD_Nasabah": data.tanda_Tangan_Nasabah,
                            "TTD_Penjamin": data.tanda_Tangan_SuamiPenjamin,
                            "TTD_Suami": data.tanda_Tangan_SuamiPenjamin,
                            "TanggalLahir": "2021-12-20",
                            "TanggalReleaseID": "2021-12-20",
                            "TanggalSos": "2021-12-20",
                            "TempatLahir": "1",
                            "TempatLahirSuami": "1",
                            "TermPembiayaan": "1",
                            "TglLahirSuami": "2021-12-20",
                            "Tingkat_Pendapatan_Bersih": "1",
                            "TujuanPembiayaan": "1",
                            "TypePencairan": "1",
                            "Umur": "1"
                        };

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
                            console.error('$post /post_inisiasi/post_prospek_uk response', responseJSON);
                            ToastAndroid.show("Submit UK berhasil!", ToastAndroid.SHORT);
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

                    <TouchableOpacity onPress={() => navigation.navigate('DataDiri', {groupName: groupName, namaNasabah: namaNasabah})} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: '#0c5da0'}}>
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

                    <TouchableOpacity onPress={() => screenState > 0 ? navigation.navigate('ProdukPembiayaan', {groupName: groupName, namaNasabah: namaNasabah}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 0 ? '#0c5da0' : 'gray'}}>
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

                    <TouchableOpacity onPress={() => screenState > 1 ? navigation.navigate('InisiasiFormUKKondisiRumah', {groupName: groupName, namaNasabah: namaNasabah}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 1 ? '#0c5da0' : 'gray'}}>
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

                    <TouchableOpacity onPress={() => screenState > 2 ? navigation.navigate('InisiasiFormUKSektorEkonomi', {groupName: groupName, namaNasabah: namaNasabah}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 2 ? '#0c5da0' : 'gray'}}>
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

                    <TouchableOpacity onPress={() => screenState > 3 ? navigation.navigate('InisiasiFormUKTingkatPendapatan', {groupName: groupName, namaNasabah: namaNasabah}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 3 ? '#0c5da0' : 'gray'}}>
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

                    <TouchableOpacity onPress={() => screenState > 4 ? navigation.navigate('InisiasiFormUKTandaTanganPermohonan', {groupName: groupName, namaNasabah: namaNasabah}) : null} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginBottom: 20, backgroundColor: screenState > 4 ? '#0c5da0' : 'gray'}}>
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

                    <View style={{alignItems: 'center', marginBottom: 20}}>
                        <Button
                            title={submitted ? 'MENGIRIM...' : "SUBMIT UK"}
                            onPress={() => screenState > 5 || submitted === false ? doSubmit() : null}
                            buttonStyle={{backgroundColor: screenState > 5 || submitted === false ? '#D62828' : 'gray', width: dimension.width/2}}
                            titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                        />
                    </View>

                </ScrollView>

            </View>
        </View>
    )
}

export default FormUjiKelayakan

const styles = StyleSheet.create({
    
})