import React from 'react';
import { WebView } from 'react-native-webview';
import moment from 'moment';
import 'moment/locale/id';

export default function ReportLPM(props) {

    const { groupid, cabangid } = props.route.params;

    moment.locale('id');
    var tanggal = moment().format('YYYY-MM-DD')

    var kelompokid = groupid
    var idcabang = cabangid
    // var link = "http://reportdpm.pnm.co.id:8080/jasperserver/rest_v2/reports/reports/PKM_Prod/LPM.html?TrxDate="+ tanggal +"&OurBranchID="+ idcabang +"&GroupID=" + kelompokid //Production
    // var link = "http://reportdpm.pnm.co.id:8080/jasperserver/rest_v2/reports/reports/PKM/LPM.html?KODE_CABANG="+ idcabang +"&GROUPID="+ kelompokid +"&TANGGAL_TRANSAKSI=" + tanggal //Develppment

    var link = "http://reportlhtksystem.yakinbisa.id/jasperserver/rest_v2/reports/reports/PKM_Prod/LPM.pdf?TrxDate="+ tanggal +"&OurBranchID="+ idcabang +"&GroupID="+ kelompokid

    return (
        <WebView
            source={{ uri: link }}
            style={{ marginTop: 20 }}
        />
    )
}