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
            syncby varchar)
        ;`
    );

    tx.executeSql(
        'create table if not exists UpAccountList(OurBranchID varchar, ClientID varchar, ClientName varchar, GroupID varchar, GroupName varchar, MeetingDay varchar, JumlahUP varchar, status varchar, syncby varchar);'
    )

    tx.executeSql(
        'create table if not exists PAR_AccountList(OurBranchID varchar, ClientID varchar, ClientName varchar, AccountID varchar, ProductID varchar, GroupID varchar, GroupName varchar, ODAmount varchar, jumlahbayar varchar, status varchar, syncby varchar);'
    )

    tx.executeSql(
        'create table if not exists AccountList(OurBranchID varchar, GroupName varchar, GroupID varchar, MeetingDay varchar, ClientID varchar, ClientName varchar, AccountID varchar, ProductID varchar, InstallmentAmount varchar, rill varchar, ke varchar, VolSavingsBal varchar, StatusPAR varchar, attendStatus varchar, syncby varchar);'
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
            kelurahan varchar
        );`
    )




    // tx.executeSql(
    //     // 'DROP TABLE IF EXISTS GroupList'
    //     'DROP TABLE IF EXISTS PAR_AccountList;'
    //     // 'create table if not exists ListGroup(GroupID varchar, GroupName varchar, GroupID varchar, MeetingDay varchar);'        
    // );

    // tx.executeSql(
    //     // 'DROP TABLE IF EXISTS GroupList'
    //     'DROP TABLE IF EXISTS parTransaction;'
    //     // 'create table if not exists ListGroup(GroupID varchar, GroupName varchar, GroupID varchar, MeetingDay varchar);'        
    // );

    // tx.executeSql(
    //     // 'DROP TABLE IF EXISTS GroupList'
    //     'DROP TABLE IF EXISTS ListGroup;'
    //     // 'create table if not exists ListGroup(GroupID varchar, GroupName varchar, GroupID varchar, MeetingDay varchar);'        
    // );

    // tx.executeSql(
    //     // 'DROP TABLE IF EXISTS GroupList'
    //     'DROP TABLE IF EXISTS DetailKehadiran;'
    //     // 'create table if not exists ListGroup(GroupID varchar, GroupName varchar, GroupID varchar, MeetingDay varchar);'        
    // );

    // tx.executeSql(
    //     // 'DROP TABLE IF EXISTS GroupList'
    //     'DROP TABLE IF EXISTS UpAccountList;'
    //     // 'create table if not exists ListGroup(GroupID varchar, GroupName varchar, GroupID varchar, MeetingDay varchar);'        
    // );

    // tx.executeSql(
    //     // 'DROP TABLE IF EXISTS GroupList'
    //     'DROP TABLE IF EXISTS GroupList;'
    //     // 'create table if not exists GroupList(OurBranchID varchar, GroupName varchar, GroupID varchar, MeetingDay varchar, AnggotaAktif varchar, JumlahTagihan varchar, MeetingPlace varchar, MeetingTime varchar, CreditOfficerID varchar);'        
    // );

    // tx.executeSql(
    //     'DROP TABLE IF EXISTS AccountList;'
    //     // 'create table if not exists AccountList(OurBranchID varchar, GroupName varchar, GroupID varchar, MeetingDay varchar, MeetingPlace varchar, MeetingTime varchar, ClientID varchar, ClientName varchar, AccountID varchar, InstallmentAmount varchar, VolSavingsBal varchar, CompSavingsBal varchar);'
    // );

    // tx.executeSql(
    //     'DROP TABLE IF EXISTS Totalpkm;'
    //     // 'create table if not exists Totalpkm(GroupID varchar, MeetingDay varchar, TotalSetoran varchar, TotalAngsuran varchar, TotalTitipan varchar);'
    // )

    // tx.executeSql(
    //     'DROP TABLE IF EXISTS LisDetailpkmtGroup;'
    //     // 'create table if not exists Detailpkm(GroupID varchar, MeetingDay varchar, ClientID varchar, ClientName varchar, Attendance varchar, Angsuran varchar, Setoran varchar, Titipan varchar, TotalSetor varchar);'
    // )

    // tx.executeSql(
    //     'DROP TABLE IF EXISTS pkmTransaction;'
    //     // 'create table if not exists Detailpkm(GroupID varchar, MeetingDay varchar, ClientID varchar, ClientName varchar, Attendance varchar, Angsuran varchar, Setoran varchar, Titipan varchar, TotalSetor varchar);'
    // )

    // tx.executeSql(
    //     'DROP TABLE IF EXISTS DetailUP;'
    //     // 'create table if not exists Detailpkm(GroupID varchar, MeetingDay varchar, ClientID varchar, ClientName varchar, Attendance varchar, Angsuran varchar, Setoran varchar, Titipan varchar, TotalSetor varchar);'
    // )

    // tx.executeSql(
    //     'DROP TABLE IF EXISTS DetailPAR;'
    //     // 'create table if not exists Detailpkm(GroupID varchar, MeetingDay varchar, ClientID varchar, ClientName varchar, Attendance varchar, Angsuran varchar, Setoran varchar, Titipan varchar, TotalSetor varchar);'
    // )

    //     tx.executeSql(
    //     'DROP TABLE IF EXISTS Sosialisasi_Database;'
    //     // 'create table if not exists Detailpkm(GroupID varchar, MeetingDay varchar, ClientID varchar, ClientName varchar, Attendance varchar, Angsuran varchar, Setoran varchar, Titipan varchar, TotalSetor varchar);'
    // )


},function(error) {
            console.log('Transaction ERROR: ' + error.message);
        }, function() {
            console.log('Populated database OK');
        }
);




export default db;