import React from 'react';
import { WebView } from 'react-native-webview';

export default function HandleSurveiClick(props) {

    const { groupid, nip } = props.route.params;

    var kelompokid = groupid
    var tesnip = nip
    var link = "https://smp.pnm.co.id/pkm/pkm_bermakna?kelompokid="+kelompokid+"&nip="+tesnip

    console.log(link)

    return (
        <WebView
          source={{ uri: link }}
          style={{ marginTop: 0 }}
        />
    )
}

