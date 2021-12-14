import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions } from 'react-native'
// import styles from '../../styles/styles';
import { Card, CardItem, Body } from "react-native-elements";
// import ImageViewer from 'react-native-image-zoom-viewer'; 
import {useNavigation, useRoute} from '@react-navigation/native';

const screenHeight = Dimensions.get('screen').height

function ClientList() {

  const [modal, setModal] = useState(false);

  const images = [{
    props: {
        source: require("../../assets/poster.jpeg")
    }
  }]

  const ImageView = () => {
    modal === true ? setModal(false) : setModal(true)
  }

  const ListData = () => {
    return(
      <TouchableOpacity onPress={() => onclickClient()}>
          <Card containerStyle={{backgroundColor:"#f5f9fe"}} >       
              <Text style={stylesApp.textStyle}>900010078 - Indah2 Maulina</Text>
          </Card>
      </TouchableOpacity>
    )
  }
  
  const navigation = useNavigation()
  const route = useRoute()
  
//   const onclickClient = () => {
//       route.name === "SurveyScreen" ? navigation.navigate("PKMScreen") : navigation.navigate("PKMScreen")
//   }

    return(
    
      <View style={styles.container,{height: screenHeight, paddingBottom:15, backgroundColor:"#FFFF"}}>
          {/* <Modal visible={modal} transparent={modal}>
            <ImageViewer backgroundColor={'#fff'} enableSwipeDown={true} imageUrls={images} onSwipeDown={() => ImageView()} />
          </Modal> */}
  
          <View>
            <Card containerStyle={{borderRadius: 5}}>
              <Card.Image source={require("../assets/poster.jpeg")} />
            </Card>
          </View>

          <ScrollView>
              <ListData  />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
              <ListData />
          </ScrollView>
      </View>
    )
}

export default ClientList

const stylesApp = StyleSheet.create({
  textStyle : {
    fontSize: 14,
    fontWeight: "500"
  },
});