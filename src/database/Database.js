// import SQLite from 'react-native-sqlite-storage';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('dataBaase.db');

db.transaction(tx => {
    
    tx.executeSql(
        `create table if not exists ListGroup(
            GroupID varchar, 
            GroupName varchar, 
            MeetingDay varchar)
        ;`
    );

    tx.executeSql(
        `create table if not exists GroupList(
            OurBranchID varchar, 
            GroupName varchar, 
            GroupID varchar, 
            MeetingDay varchar, 
            AnggotaAktif varchar, 
            JumlahTagihan varchar, 
            MeetingPlace varchar, 
            MeetingTime varchar, 
            CreditOfficerID varchar,
            Status varchar,
            syncby varchar)
        ;`
    );

    tx.executeSql(
        'create table if not exists UpAccountList(OurBranchID varchar, ClientID varchar, ClientName varchar, GroupID varchar, GroupName varchar, MeetingDay varchar, JumlahUP varchar, status varchar, syncby varchar);'
    )

    tx.executeSql(
        `create table if not exists PAR_AccountList(
            OurBranchID varchar,
            ClientID varchar,
            ClientName varchar,
            AccountID varchar,
            ProductID varchar,
            GroupID varchar,
            GroupName varchar,
            ODAmount varchar,
            jumlahbayar varchar,
            status varchar,
            syncby varchar,
            AoSign varchar,
            NasabahSign varchar)
        ;`
    )

    tx.executeSql(
        `create table if not exists AccountList(
            OurBranchID varchar, 
            GroupName varchar, 
            GroupID varchar, 
            MeetingDay varchar, 
            ClientID varchar, 
            ClientName varchar, 
            AccountID varchar, 
            ProductID varchar, 
            InstallmentAmount varchar, 
            rill varchar, 
            ke varchar, 
            VolSavingsBal varchar, 
            StatusPAR varchar, 
            attendStatus varchar,
            savings varchar,
            withDraw varchar,
            totalSetor varchar,
            syncby varchar);`
    );

    tx.executeSql(
        `create table if not exists Totalpkm(
            userName varchar, 
            GroupID varchar, 
            MeetingDay varchar, 
            TotalSetoran varchar, 
            TotalAngsuran varchar, 
            TotalTitipan varchar, 
            TotalUP varchar, 
            TotalNasabahup varchar, 
            IDKetuaKelompok varchar, 
            KetuaKelompok varchar, 
            TtdKetuaKelompok varchar, 
            TtdAccountOfficer varchar, 
            trxdate varchar,
            longitude varchar,
            latitude varchar
        );`
    );

    tx.executeSql(
        'create table if not exists Detailpkm(GroupID varchar, MeetingDay varchar, ClientID varchar, ClientName varchar, Attendance varchar, Angsuran varchar, Setoran varchar, Tarikan varchar, Titipan varchar, TotalSetor varchar);'
    );

    tx.executeSql(
        'create table if not exists pkmTransaction(GroupID varchar, AccountID varchar, Angsuran varchar, Attendance varchar, ClientID varchar, ClientName varchar, MeetingDay varchar, ProductID varchar, Setoran varchar, Tarikan varchar, Titipan varchar, ke varchar, TotalSetor varchar);'
    );

    tx.executeSql(
        'create table if not exists parTransaction(GroupID varchar, AccountID varchar, Angsuran varchar, ClientID varchar, ClientName varchar);'
    );
    
    tx.executeSql(
        'create table if not exists DetailKehadiran(clientid varchar, accountid varchar, statuskehadiran varchar);'
    )

    tx.executeSql(
        'create table if not exists DetailUP(groupid varchar, clientid varchar, jumlahup varchar);'
    )

    tx.executeSql(
        'create table if not exists DetailPAR(cabangid varchar, groupid varchar, clientid varchar, accountid varchar, jumlahpar varchar, clientSign varchar, AOSign varchar, createdby varchar, trxdate varchar);'
    )

    // database PKMB

    tx.executeSql(
        `create table if not exists Survei_Detail(
            clientid varchar,
            accountid varchar,
            groupid varchar,
            id varchar,
            pertanyaan varchar
        );`
    )

    tx.executeSql(
        `create table if not exists Survei_Jawaban(
            clientid varchar,
            id varchar,
            jawaban varchar,
            nilai varchar
        );`
    )

    // database INISIASI

    tx.executeSql(
        `create table if not exists Sosialisasi_Database(
            tanggalInput varchar, 
            sumberId varchar, 
            namaCalonNasabah varchar, 
            nomorHandphone varchar, 
            status varchar, 
            tanggalSosialisas varchar, 
            lokasiSosialisasi varchar,
            type varchar);`
    )

    tx.executeSql(
        `create table if not exists Table_UK(
            date varchar,
            lokasiSos varchar
        );`
    )

    tx.executeSql(
        `create table if not exists Table_UK_Detail(
            date varchar,
            lokasiSos varchar,
            namaProspek varchar
        );`
    )

    tx.executeSql(
        `create table if not exists Table_UK_Master(
            namaNasabah varchar,
            status varchar
        );`
    )
    
    /**
     * dari mulai foto_kk sampai bawah tambahan baru by Muhamad Yusup Hamdani (YPH)
     */
    tx.executeSql(
        `create table if not exists Table_UK_DataDiri(
            foto_Kartu_Identitas varchar,
            jenis_Kartu_Identitas varchar,
            nomor_Identitas varchar,
            nama_lengkap varchar,
            tempat_lahir varchar,
            tanggal_Lahir varchar,
            status_Perkawinan varchar,
            alamat_Identitas varchar,
            alamat_Domisili varchar,
            foto_Surat_Keterangan_Domisili varchar,
            provinsi varchar,
            kabupaten varchar,
            kecamatan varchar,
            kelurahan varchar,
            foto_kk varchar,
            no_kk varchar,
            nama_ayah varchar,
            no_tlp_nasabah varchar,
            jumlah_anak varchar,
            jumlah_tanggungan varchar,
            status_rumah_tinggal varchar,
            lama_tinggal varchar,
            nama_suami varchar,
            usaha_pekerjaan_suami varchar,
            jumlah_tenaga_kerja_suami varchar,
            foto_ktp_suami varchar,
            suami_diluar_kota varchar,
            status_hubungan_keluarga varchar,
            nama_penjamin varchar,
            foto_ktp_penjamin varchar,
            longitude varchar,
            latitude varchar,
            agama varchar,
            status_Verif varchar
        );`
    )

    tx.executeSql(
        `create table if not exists Table_UK_ProdukPembiayaan(
            nama_lengkap varchar,
            jenis_Pembiayaan varchar,
            nama_Produk varchar, 
            produk_Pembiayaan varchar, 
            jumlah_Pinjaman varchar,
            term_Pembiayaan varchar,
            kategori_Tujuan_Pembiayaan varchar,
            tujuan_Pembiayaan varchar,
            type_Pencairan varchar,
            frekuensi_Pembayaran varchar,
            status_Rekening_Bank varchar,
            nama_Bank varchar,
            no_Rekening varchar,
            pemilik_Rekening varchar
        );`
    )

    tx.executeSql(
        `create table if not exists Table_UK_KondisiRumah(
            nama_lengkap varchar,
            luas_Bangunan varchar,
            kondisi_Bangunan varchar,
            jenis_Atap varchar,
            dinding varchar,
            lantai varchar,
            sanitasi_Akses_AirBersih varchar,
            sanitasi_KamarMandi varchar
        );`
    )

    tx.executeSql(
        `create table if not exists Table_UK_SektorEkonomi(
            nama_lengkap varchar,
            sektor_Ekonomi varchar,
            sub_Sektor_Ekonomi varchar,
            jenis_Usaha varchar
        );`
    )

    /**
     * Pembiayaan_Dari_LembagaLainFreetext tambahan baru by Muhamad Yusup Hamdani (YPH)
     */
    tx.executeSql(
        `create table if not exists Table_UK_PendapatanNasabah(
            nama_lengkap varchar,
            pendapatan_Kotor_perhari varchar,
            pengeluaran_Keluarga_Perhari varchar,
            pendapatan_Bersih_Perhari varchar,
            jumlah_Hari_Usaha_Perbulan varchar,
            pendapatan_Bersih_Perbulan varchar,
            pendapatan_Bersih_Perminggu varchar,
            pembiayaan_Dari_Lembaga varchar,
            Pembiayaan_Dari_LembagaLain varchar,
            Pembiayaan_Dari_LembagaLainFreetext varchar,
            jumlah_Angsuran varchar,
            pendapatanSuami_Kotor_Perhari varchar,
            pendapatanSuami_Pengeluaran_Keluarga_Perhari varchar,
            pendapatanSuami_Pendapatan_Bersih_Perhari varchar,
            pendapatanSuami_jumlah_Hari_Usaha_Perbulan varchar,
            pendapatanSuami_pendapatan_Bersih_Perbulan varchar,
            pendapatanSuami_pendapatan_Bersih_Perminggu varchar
        )`
    )

    tx.executeSql(
        `create table if not exists Table_UK_PermohonanPembiayaan(
            nama_lengkap varchar,
            produk_Pembiayaan varchar,
            jumlah_Pembiayaan_Diajukan varchar,
            jangka_Waktu varchar,
            frekuensi_Pembiayaan varchar,
            tanda_Tangan_AOSAO varchar,
            tanda_Tangan_Nasabah varchar,
            tanda_Tangan_SuamiPenjamin varchar,
            tanda_Tangan_Ketua_SubKelompok varchar,
            tanda_Tangan_Ketua_Kelompok,
            nama_tanda_Tangan_Nasabah varchar,
            nama_tanda_Tangan_SuamiPenjamin varchar,
            nama_tanda_Tangan_Ketua_SubKelompok varchar,
            nama_tanda_Tangan_Ketua_Kelompok varchar
        )`
    )

    tx.executeSql(
        `create table if not exists Table_PP_Kelompok(
            kelompok_Id varchar,
            kelompok varchar,
            group_Produk varchar,
            tanggal_Pertama varchar,
            hari_Pertemuan varchar,
            waktu_Pertemuan varchar,
            lokasi_Pertemuan varchar,
            branchid varchar,
            input_Date varchar,
            status varchar
        );`
    )

    tx.executeSql(
        `create table if not exists Table_PP_SubKelompok(
            kelompok_Id varchar,
            subKelompok_Id varchar,
            kelompok varchar,
            subKelompok varchar,
            num varchar,
            branchid varchar,
            status varchar
        );`
    )

    tx.executeSql(
        `create table if not exists Table_PP_ListNasabah(
            kelompok_Id varchar,
            subKelompok_Id varchar,
            kelompok varchar,
            subKelompok varchar,
            Nasabah_Id varchar,
            Nama_Nasabah varchar,
            is_Ketua_Kelompok varchar,
            is_KetuaSubKelompok varchar,
            lokasiSos varchar,
            branchid varchar,
            syncBy varchar,
            isPP varchar,
            isPP1 varchar,
            isPP2 varchar,
            AbsPP varchar,
            AbsPP1 varchar,
            AbsPP2 varchar,
            jumlah_pembiayaan varchar,
            jangka_waktu varchar,
            jasa varchar,
            Angsuran_per_minggu varchar,
            status varchar
        )`
    )

    // tx.executeSql('DROP TABLE IF EXISTS ListGroup')
    // tx.executeSql('DROP TABLE IF EXISTS GroupList')
    // tx.executeSql('DROP TABLE IF EXISTS UpAccountList')
    // tx.executeSql('DROP TABLE IF EXISTS PAR_AccountList')
    // tx.executeSql('DROP TABLE IF EXISTS AccountList')
    // tx.executeSql('DROP TABLE IF EXISTS Totalpkm')
    // tx.executeSql('DROP TABLE IF EXISTS Detailpkm')
    // tx.executeSql('DROP TABLE IF EXISTS pkmTransaction')
    // tx.executeSql('DROP TABLE IF EXISTS parTransaction')
    // tx.executeSql('DROP TABLE IF EXISTS DetailKehadiran')
    // tx.executeSql('DROP TABLE IF EXISTS DetailUP')
    // tx.executeSql('DROP TABLE IF EXISTS DetailPAR')
    // tx.executeSql('DROP TABLE IF EXISTS Survei_Detail')
    // tx.executeSql('DROP TABLE IF EXISTS Survei_Jawaban')
    // tx.executeSql('DROP TABLE IF EXISTS Sosialisasi_Database')
    // tx.executeSql('DROP TABLE IF EXISTS Table_UK')
    // tx.executeSql('DROP TABLE IF EXISTS Table_UK_Detail')
    // tx.executeSql('DROP TABLE IF EXISTS Table_UK_Master')
    // tx.executeSql('DROP TABLE IF EXISTS Table_UK_DataDiri')
    // tx.executeSql('DROP TABLE IF EXISTS Table_UK_ProdukPembiayaan')
    // tx.executeSql('DROP TABLE IF EXISTS Table_UK_KondisiRumah')
    // tx.executeSql('DROP TABLE IF EXISTS Table_UK_SektorEkonomi')
    // tx.executeSql('DROP TABLE IF EXISTS Table_UK_PendapatanNasabah')
    // tx.executeSql('DROP TABLE IF EXISTS Table_UK_PermohonanPembiayaan')
    // tx.executeSql('DROP TABLE IF EXISTS Table_PP_Kelompok')
    // tx.executeSql('DROP TABLE IF EXISTS Table_PP_SubKelompok')
    // tx.executeSql('DROP TABLE IF EXISTS Table_PP_ListNasabah')

},function(error) {
            console.log('Transaction ERROR: ' + error.message);
        }, function() {
            console.log('Populated database OK');
        }
);




export default db;