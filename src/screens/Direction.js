import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  StyleSheet,
  StatusBar,
  ToastAndroid,
  Dimensions,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  Linking,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import base64 from "react-native-base64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { showMessage } from "react-native-flash-message";

const window = Dimensions.get("window");

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

const Item = ({ title, distance, coords, latitude, longitude }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.titleDistance}>{distance} Km</Text>
    <TouchableOpacity
      style={styles.loginButtonContainer}
      onPress={() => {
        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&origin=${coords.latitude},${coords.longitude}&destination=${latitude},${longitude}`
        );
      }}
    >
      <Text style={styles.loginButtonText}>View</Text>
    </TouchableOpacity>
  </View>
);

export default function Direction() {
  const [data, setData] = useState([]);
  const [coords, setCoords] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      let { coords } = await Location.getCurrentPositionAsync();
      try {
        const response = await fetch(
          `http://10.61.3.221:9006/v1/other/Jarak_cabang_by_longlat/${coords.latitude}/${coords.longitude}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        const json = await response.json();
        setCoords(coords);
        setData(json);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  });

  const renderItem = ({ item }) => (
    <Item
      title={item.kabko}
      distance={item.km2}
      coords={coords}
      latitude={item.lat}
      longitude={item.long}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.km2}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 28,
  },
  titleDistance: {
    fontSize: 15,
  },
  loginButtonContainer: {
    elevation: 8,
    borderColor: "#166cf5",
    borderRadius: 20,
    backgroundColor: "#166cf5",
    paddingVertical: 7,
    paddingHorizontal: 35,
  },
  loginButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
