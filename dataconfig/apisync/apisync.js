import React from "react"
import {View, Texr} from "react-native"

//---------------------BASE API------------------------//

//let ApiSync = 'http://pkmmekaar.pnm.co.id:9005/' //production_Old
//let ApiSync = 'http://devapipkm.pnm.co.id:9005/' //development
//let ApiSync = 'http://192.168.100.14:9005/' //development
//let ApiSync = 'http://10.50.0.34:9005/' //development
// let ApiSync = 'http://192.168.233.159:9005/'

const IS_DEVELOPMENT = true;

let MAJOR_VERSION = '0';
let MINOR_VERSION = '0';
let PATCH_VERSION = '12';
let BUILD = '001';
let TANGGAL = '2022-04-28';

// let base_url = 'http://192.168.121.80:9006';
let base_url = 'http://pkmmekaar.kresnasaraswati.id';
let api_version = 'v1';

// let BRI_base_url = 'https://UmiCornerPNM.pnm.co.id';
let BRI_base_url = 'http://devumicornerpnm.pnm.co.id';


if (IS_DEVELOPMENT) {
    MAJOR_VERSION = '0';
    MINOR_VERSION = '0';
    PATCH_VERSION = '14';
    BUILD = '002';
    TANGGAL = '2022-05-27';
    
    base_url = 'http://103.105.216.134';

    BRI_base_url = 'http://devumicornerpnm.pnm.co.id';
}

let VERSION = `${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION}-${BUILD}-${IS_DEVELOPMENT ? 'dev' : 'prod'} @ ${TANGGAL}`
let ApiSync = `${base_url}/${api_version}/pkm/`;
let ApiSyncInisiasi = `${base_url}/${api_version}/inisiasi/`;
let ApiSyncPostInisiasi = `${base_url}/${api_version}/post_inisiasi/`;
let ApiSyncOther = `${base_url}/${api_version}/other/`;
let ApiPkmb = `${base_url}/${api_version}/pkmb/get_pkmb/`;
let ApiDukcapil = `http://api-dukcapilmicro.pnm.co.id/pnm-dukcapil-micro/public`;

//------------------API POST PKM----------------------//

let PostPKM = 'PostTransaction'
let PostIndividualPKM = `${ApiSync}/PostIndividualTransaction/`

//---------------------API GET------------------------//

let Get_notification = "GetNotification"
let Get_Date = "GetDate"

//------------------SENYUM Mobile---------------------//

let BRI_webAuth = `${BRI_base_url}/webAuth`
let Get_UmiList = `${BRI_base_url}/listUmi`

//--------------------Notification--------------------//


let NotificationCheck = `${ApiSyncOther}NotifImages`


const GET_CUSTOM_MESSAGES = {
    'mssql: Error converting data type varchar to money.': 'Salah Input Data. Silakan cek data input UK yang berupa angka.',
    'mssql: Error converting data type varchar to int.': 'Salah Input Data. Silakan cek data input UK yang berupa angka.'
}


export { ApiSync, Get_notification, PostPKM, Get_Date, ApiSyncInisiasi, ApiPkmb, ApiSyncPostInisiasi, ApiDukcapil, IS_DEVELOPMENT, ApiSyncOther, VERSION, GET_CUSTOM_MESSAGES, Get_UmiList, BRI_webAuth, PostIndividualPKM, NotificationCheck }
