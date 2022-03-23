import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import NetworkLogger from 'react-native-network-logger';

const NetworkLogging = () => {
    return(
        <View style={{ flex: 1 }}> 
            <NetworkLogger theme="dark" />
        </View>
    )
}

export default NetworkLogging;
