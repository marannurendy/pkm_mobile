import React from 'react';
import { WebView } from 'react-native-webview';
import 'moment/locale/id';

export default function UMiCornerPage(props) {

    const { UrlLink } = props.route.params;

    // var link = "http://reportdpm.pnm.co.id:8080/jasperserver/rest_v2/reports/reports/PKM_Prod/LPM.html?TrxDate="+ tanggal +"&OurBranchID="+ idcabang +"&GroupID=" + kelompokid //Production
    // var link = "http://reportdpm.pnm.co.id:8080/jasperserver/rest_v2/reports/reports/PKM/LPM.html?KODE_CABANG="+ idcabang +"&GROUPID="+ kelompokid +"&TANGGAL_TRANSAKSI=" + tanggal //Develppment

    return (
        <WebView
            useWebKit
            // userAgent={this.state.userAgent} //Set your useragent (Browser) **Very Important
            originWhitelist={['*']}
            allowsInlineMediaPlayback
            javaScriptEnabled={true}
            source={{ uri: UrlLink }}
        />
    )
}