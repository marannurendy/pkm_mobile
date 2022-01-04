import React from "react"
import {View, Texr} from "react-native"

//---------------------BASE API------------------------//

//let ApiSync = 'http://pkmmekaar.pnm.co.id:9005/' //production_Old
//let ApiSync = 'http://devapipkm.pnm.co.id:9005/' //development
//let ApiSync = 'http://192.168.100.14:9005/' //development
//let ApiSync = 'http://10.50.0.34:9005/' //development
// let ApiSync = 'http://192.168.233.159:9005/'

let ApiSync = 'http://103.105.216.134/v1/pkm/' //development v2
let ApiSyncInisiasi = 'http://103.105.216.134/v1/inisiasi/' //Inisiasi development
let ApiSyncPostInisiasi = 'http://103.105.216.134/v1/post_inisiasi/' 

let ApiPkmb = 'http://103.105.216.134/v1/pkmb/get_pkmb/'

let ApiDukcapil = 'http://api-dukcapilmicro.pnm.co.id/pnm-dukcapil-micro/public'

// let ApiSync = 'http://api-pkmmobile.pnm.co.id/' //production

//---------------------API POST-----------------------//

let PostPKM = 'PostTransaction'

//---------------------API GET------------------------//

//GET NOTIFICATION
let Get_notification = "GetNotification"
let Get_Date = "GetDate"

// export {ApiSync, Get_notification, PostPKM, Get_Date, ApiSyncInisiasi, ApiPkmb}
export {ApiSync, Get_notification, PostPKM, Get_Date, ApiSyncInisiasi, ApiPkmb, ApiSyncPostInisiasi, ApiDukcapil}
