import React from "react"
import {View, Texr} from "react-native"

//---------------------BASE API------------------------//

//let ApiSync = 'http://pkmmekaar.pnm.co.id:9005/' //production_Old
//let ApiSync = 'http://devapipkm.pnm.co.id:9005/' //development
//let ApiSync = 'http://192.168.100.14:9005/' //development
//let ApiSync = 'http://10.50.0.34:9005/' //development
// let ApiSync = 'http://192.168.233.159:9005/'

const IS_DEVELOPMENT = false;
let base_url = 'http://pkmmekaar.kresnasaraswati.id';
let api_version = 'v1';
if (IS_DEVELOPMENT) {
    base_url = 'http://103.105.216.134';
}

let ApiSync = `${base_url}/${api_version}/pkm/`;
let ApiSyncInisiasi = `${base_url}/${api_version}/inisiasi/`;
let ApiSyncPostInisiasi = `${base_url}/${api_version}/post_inisiasi/`;
let ApiSyncOther = `${base_url}/${api_version}/other/`;
let ApiPkmb = `${base_url}/${api_version}/pkmb/get_pkmb/`;
let ApiDukcapil = `http://api-dukcapilmicro.pnm.co.id/pnm-dukcapil-micro/public`;

// let ApiSync = 'http://api-pkmmobile.pnm.co.id/' //production

//---------------------API POST-----------------------//

let PostPKM = 'PostTransaction'

//---------------------API GET------------------------//

//GET NOTIFICATION
let Get_notification = "GetNotification"
let Get_Date = "GetDate"

// export {ApiSync, Get_notification, PostPKM, Get_Date, ApiSyncInisiasi, ApiPkmb}
export { ApiSync, Get_notification, PostPKM, Get_Date, ApiSyncInisiasi, ApiPkmb, ApiSyncPostInisiasi, ApiDukcapil, IS_DEVELOPMENT, ApiSyncOther }
