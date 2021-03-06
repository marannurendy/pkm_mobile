import React from 'react'
import { Image, StyleSheet, View, Text, Alert } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import db from '../database/Database'
import Login from '../screens/Login'
import Sync from '../screens/Sync'
import Menu from '../screens/Menu'
import Meeting from '../screens/Meeting'
import Sign from '../screens/Sign'
import TarikUp from '../screens/Tarikup'
import MeetingPAR from '../screens/Meeting_par'
import FormPar from '../screens/FormPar'
import FrontHome from '../screens/Home'
import HandleSurveiClick from '../screens/Survei'
import ReportLPM from '../screens/Report'
import SplashScreen from '../screens/Splashscreen'
import IndividualMeeting from '../screens/IndividualMeeting'
import UpCollection from '../screens/UpCollection'
import Meetingnew from '../screens/MeetingNew'
import UmiCornerLanding from '../screens/UmiCorner'
import UMiCornerPage from '../screens/UMiCornerPage'
import UmiList from '../screens/UmiList'
import DetailUmiList from '../screens/DetailUmiList'
import SignNew from '../screens/SignNew'
import SignAdd from '../screens/SignatureAdd'
import MeetingDay from '../screens/MeetingDay'
import MeetingMenu from '../screens/MeetingMenu'
import GroupCollection from '../screens/groupCollection'
import IndividualCollection from '../screens/individualCollection'
import FormIndividualCollection from '../screens/formIndividualCollection'
import PkmBermakna from '../screens/pkmBermakna'
import NetworkLogging from '../screens/NetworkLogging'

// import { Inisasi, Sosialisasi, Floating, UjiKelayakan, FormUjiKelayakan, DataDiri, ProdukPembiayaan } from '../screens/inisiasi/index'
import { 
    Inisasi,
    Sosialisasi,
    Floating,
    UjiKelayakan,
    FormUjiKelayakan,
    DataDiri,
    ProdukPembiayaan,
    InisiasiFormUKKondisiRumah,
    InisiasiFormUKSektorEkonomi,
    InisiasiFormUKTingkatPendapatan,
    InisiasiFormUKTandaTanganPermohonan,
    InisiasiFormUKSignatureScreen,
    Verifikasi,
    VerifikasiFormReview,
    InisiasiFormPPKelompok,
    InisiasiFormPPKelompokIntro,
    InisiasiFormPPKelompokList,
    InisiasiFormPPKelompokDetail,
    InisiasiFormPPKelompokSub,
    InisiasiFormPPKelompokSubForm,
    InisiasiFormPPKelompokSubMemberVerifikasi,
    InisiasiFormPPH,
    InisiasiFormPP,
    InisiasiFormPPList,
    InisiasiFormPPForm,
    InisiasiFormProspekLamaList,
    InisiasiFormProspekLama,
    InisiasiFormPPAbsen,
    InisiasiFormUKDisiplinNasabah,
    InisiasiFormUKKondisiAirBersihDanSanitasi
} from '../screens/inisiasi/index'

import { 
    KelompokPencairan, 
    FlowPencairan, 
    ListPencairan,
    AkadWakalah,
    AkadMurabahah,
    FinalPencairan,
    Siklus,
    Perjanjian,
    TandaTanganPencairan,
    SyncPencairan,
    Preview,
    FormFP4,
    UploadBuktiPem
} from '../screens/pencairan/index'
import { ApiSyncOther } from '../../dataconfig'


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function LogoTitle() {
    return (
        <Image source={require('../images/mekaar.png')} style={styles.imageHeader} />
    );
}

function PKMmenu() {
    return (
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>PKM</Text>
        </View>
    )
}

function MeetingPage() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Form PKM</Text>
        </View>
    )
}

function MeetingnewPage() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Form PKM</Text>
        </View>
    )
}

function ApprovalSign() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Tanda Tangan</Text>
        </View>
    )
}

function TarikUangTanggungjawab() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Tarik Uang Pertanggungjawaban</Text>
        </View>
    )
}

function PKM_PAR() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>PKM Individual</Text>
        </View>
    )
}

function Form_par() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Form PKM Individual</Text>
        </View>
    )
}

function MenuPKM() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>PKM</Text>
        </View>
    )
}

function UmiCorner() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>SenyuM Mobile</Text>
        </View>
    )
}

function Home() {
    return(
        <Tab.Navigator 
            activeColor="black"
            barStyle={{ backgroundColor: '#fff' }}
        >
            <Tab.Screen
                name="Home"
                component={Sync}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={'black'} size={26} />
                    ),
                }} />
        </Tab.Navigator>
    );
}

function Report() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Report LPM</Text>
        </View>
    )
}

function UMiCornerHeader() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>SenyuM Mobile Input Referal</Text>
        </View>
    )
}

function UmiListHeader() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>Daftar Nasabah SenyuM Mobile</Text>
        </View>
    )
}

function DetailUmiListHeader() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>Detail Nasabah UMi Corner</Text>
        </View>
    )
}

function SurveiPKU() {
    return(
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>PKM Bermakna</Text>
        </View>
    )
}

function CustomDrawerContent(props) {
    const navigation = useNavigation();

    const LogOutButton = async (source = 'none') => {
        const responseProspekMap = await AsyncStorage.getItem('ProspekMap');
        const token = await AsyncStorage.getItem('token');
        const roleUser = await AsyncStorage.getItem('roleUser');
        if (__DEV__) console.log('LogOutButton responseProspekMap:', responseProspekMap);
        if (__DEV__) console.log('ACTIONS TOKEN', token);
        if (__DEV__) console.log('ACTIONS ROLE USER', roleUser);

        if (responseProspekMap && ["AO", "SAO"].includes(roleUser)) {
            const body = {
                "ID_Prospek": JSON.parse(responseProspekMap)
            }
            fetch(ApiSyncOther + 'AuthLogout', {
                method: 'POST',
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then((response) => response.json())
            .then((responseJSON) => {
                if (__DEV__) console.log('$post /other/AuthLogout response', body, responseJSON);
            })
            .catch((error) => {
                if (__DEV__) console.log('$post /other/AuthLogout response', body, error);
            });
        }

        if (source === 'remove-all-asyncstorage') {
            let keys = await AsyncStorage.getAllKeys();
            try {
                AsyncStorage.multiRemove(keys)
            } catch(error) {
                alert(error)
            }
            alert('Data berhasil di hapus');
        } else {
            AsyncStorage.removeItem('userData');
            AsyncStorage.removeItem('SyncBy');
        }

        navigation.replace('Login');
    }

    const LogOuthandler = () => {
        Alert.alert(
            "Logout Alert",
            "Apakah anda yakin ingin keluar ?",
            [
                { text: "OK", onPress: () => LogOutButton()}
            ],
            { cancelable: true }
        );
    }

    const ClearDataHandler = async () => {
        Alert.alert(
            "Logout Alert",
            "Clear Data akan menghapus semua data, termasuk data yang sudah diinput. Apakah Anda yakin untuk melanjutkan?",
            [
                { text: "OK", onPress: () => {
                    db.transaction(
                        tx => {
                            tx.executeSql('DELETE FROM ListGroup');
                            tx.executeSql('DELETE FROM GroupList');
                            tx.executeSql('DELETE FROM UpAccountList');
                            tx.executeSql('DELETE FROM PAR_AccountList');
                            tx.executeSql('DELETE FROM AccountList');
                            tx.executeSql('DELETE FROM Totalpkm');
                            tx.executeSql('DELETE FROM Detailpkm');
                            tx.executeSql('DELETE FROM pkmTransaction');
                            tx.executeSql('DELETE FROM parTransaction');
                            tx.executeSql('DELETE FROM DetailKehadiran');
                            tx.executeSql('DELETE FROM DetailUP');
                            tx.executeSql('DELETE FROM DetailPAR');
                            tx.executeSql('DELETE FROM Survei_Detail');
                            tx.executeSql('DELETE FROM Survei_Jawaban');
                            tx.executeSql('DELETE FROM Sosialisasi_Database');
                            tx.executeSql('DELETE FROM Table_UK');
                            tx.executeSql('DELETE FROM Table_UK_Detail');
                            tx.executeSql('DELETE FROM Table_UK_Master');
                            tx.executeSql('DELETE FROM Table_UK_DataDiri');
                            tx.executeSql('DELETE FROM Table_UK_ProdukPembiayaan');
                            tx.executeSql('DELETE FROM Table_UK_KondisiRumah');
                            tx.executeSql('DELETE FROM Table_UK_SektorEkonomi');
                            tx.executeSql('DELETE FROM Table_UK_PendapatanNasabah');
                            tx.executeSql('DELETE FROM Table_UK_PermohonanPembiayaan');
                            tx.executeSql('DELETE FROM Table_PP_Kelompok');
                            tx.executeSql('DELETE FROM Table_PP_SubKelompok');
                            tx.executeSql('DELETE FROM Table_PP_ListNasabah');
                            tx.executeSql('DELETE FROM Table_Pencairan');
                            tx.executeSql('DELETE FROM Table_Pencairan_Nasabah');
                            tx.executeSql('DELETE FROM Table_Pencairan_Post');
                            tx.executeSql('DELETE FROM Table_Prospek_Lama_PP_Nasabah');
                        },function(error) {
                            alert('Transaction ERROR: ' + error.message);
                        }, async function() {
                            LogOutButton('remove-all-asyncstorage');
                        }
                    )
                }}
            ],
            { cancelable: true }
        );
    }

    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label="About"/>
        <DrawerItem label="Log Out" onPress={() => LogOuthandler()} />
        <DrawerItem label="Clear Data" onPress={() => ClearDataHandler()} />
      </DrawerContentScrollView>
    );
  }

function HalamanDepan() {
    return(
        <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Front Home" component = {FrontHome} options={{ headerShown: false }} />
        </Drawer.Navigator>
    )
}

export default function AppNavigator() {
    
    return (
      <NavigationContainer>
          <Stack.Navigator>
              <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="FrontHome" component={HalamanDepan} options={{ headerShown: false }} />
              <Stack.Screen name="MeetingMenu" component={MeetingMenu} options={{ headerShown: false }} />
              <Stack.Screen name="GroupCollection" component={GroupCollection} options={{ headerShown: false }} />
              <Stack.Screen 
                name="DetailUmiList"
                component={DetailUmiList}
                options={{
                    headerShown: true,
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },
                    headerTitle: props => <DetailUmiListHeader />
                }} 
                />
              <Stack.Screen 
                name="UmiList"
                component={UmiList}
                options={{
                    headerShown: true,
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },
                    headerTitle: props => <UmiListHeader />
                }} 
                />
              <Stack.Screen 
                name ="UmiCornerLanding" 
                component={UmiCornerLanding} 
                options={{ 
                    headerShown: true,
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },
                    headerTitle: props => <UmiCorner />
                }} 
                />

              <Stack.Screen 
                name="Menu" 
                component={Menu} 
                options={{ 
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0D67B2'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleStyle: {
                        color: '#fff'
                    },
                    headerTitle: props => <PKMmenu />
                }}
                />
              <Stack.Screen 
                name="Survei"
                component={HandleSurveiClick} 
                options={{ 
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0D67B2'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleStyle: {
                        color: '#fff'
                    },
                    headerTitle: props => <SurveiPKU />
                }}
                />

              <Stack.Screen 
                name="Report" 
                component={ReportLPM} 
                options={{ 
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0D67B2'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleStyle: {
                        color: '#fff'
                    },
                    headerTitle: props => <Report />
                }}
                />

                <Stack.Screen 
                    name="UMiCornerPage" 
                    component={UMiCornerPage} 
                    options={{ 
                        headerShown: true,
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerTitle: props => <UMiCornerHeader />
                    }}
                    />

              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    headerLeft: null,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitle: props => <LogoTitle />
                }}
                />

                {/* <Stack.Screen
                name="MenuPage"
                component={MenuPage}
                options={{
                    headerShown: false,
                    headerLeft: null,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitle: props => <GroupName />
                }}
                /> */}
                
                <Stack.Screen 
                name="Meeting" 
                component={Meeting}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0D67B2'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleStyle: {
                        color: '#fff'
                    },
                    headerTitle: props => <MeetingPage />
                }} />

                <Stack.Screen 
                name="Meetingnew" 
                component={Meetingnew}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0D67B2'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleStyle: {
                        color: '#fff'
                    },
                    headerTitle: props => <MeetingnewPage />
                }} />

                <Stack.Screen 
                name="Sign" 
                component={Sign}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0D67B2'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleStyle: {
                        color: '#fff'
                    },
                    headerTitle: props => <ApprovalSign />
                }} />

                <Stack.Screen 
                name="SignNew" 
                component={SignNew}
                options={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: '#0D67B2'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleStyle: {
                        color: '#fff'
                    },
                    headerTitle: props => <ApprovalSign />
                }} />

                <Stack.Screen name="SignAdd" component={SignAdd} options={{headerShown: false}} />

                <Stack.Screen 
                name="TarikUp" 
                component={TarikUp}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0D67B2'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleStyle: {
                        color: '#fff'
                    },
                    headerTitle: props => <TarikUangTanggungjawab />
                }} />

                <Stack.Screen 
                name="UpCollection" 
                component={UpCollection}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0D67B2'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleStyle: {
                        color: '#fff'
                    },
                    headerTitle: props => <TarikUangTanggungjawab />
                }} />

                <Stack.Screen 
                name="MeetingPAR" 
                component={MeetingPAR}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0D67B2'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleStyle: {
                        color: '#fff'
                    },
                    headerTitle: props => <PKM_PAR />
                }} />

                <Stack.Screen 
                name="IndividualMeeting" 
                component={IndividualMeeting}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0D67B2'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleStyle: {
                        color: '#fff'
                    },
                    headerTitle: props => <PKM_PAR />
                }} />

                <Stack.Screen 
                name="FormPar" 
                component={FormPar}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#0D67B2'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleStyle: {
                        color: '#fff'
                    },
                    headerTitle: props => <Form_par />
                }} />
                <Stack.Screen 
                name="Sync" 
                component={MeetingDay} 
                options={{
                    headerShown: false,
                    // headerStyle: {
                    //     backgroundColor: '#0D67B2'
                    // },
                    // headerTitleStyle: {
                    //     fontWeight: 'bold',
                    // },
                    // headerBackTitleStyle: {
                    //     color: '#fff'
                    // },
                    // headerTitle: props => <MenuPKM />
                }}
                />

                {/* PKM */}

                <Stack.Screen name="IndividualCollection" component={IndividualCollection} options={{ headerShown: false }} />
                <Stack.Screen name="FormIndividualCollection" component={FormIndividualCollection} options={{ headerShown: false }} />
                <Stack.Screen name="PkmBermakna" component={PkmBermakna} options={{ headerShown: false }} />

                {/* INISIASI */}

                <Stack.Screen name="Inisiasi" component={Inisasi} options={{ headerShown: false }} />
                <Stack.Screen name="Sosialisasi" component={Sosialisasi} options={{ headerShown: false }} />
                <Stack.Screen name="Floating" component={Floating} options={{ headerShown: false }} />
                <Stack.Screen name="UjiKelayakan" component={UjiKelayakan} options={{ headerShown: false }} />
                <Stack.Screen name="FormUjiKelayakan" component={FormUjiKelayakan} options={{ headerShown: false }} />
                <Stack.Screen name="DataDiri" component={DataDiri} options={{ headerShown: false }} />
                <Stack.Screen name="ProdukPembiayaan" component={ProdukPembiayaan} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormUKKondisiRumah" component={InisiasiFormUKKondisiRumah} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormUKSektorEkonomi" component={InisiasiFormUKSektorEkonomi} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormUKTingkatPendapatan" component={InisiasiFormUKTingkatPendapatan} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormUKTandaTanganPermohonan" component={InisiasiFormUKTandaTanganPermohonan} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormUKSignatureScreen" component={InisiasiFormUKSignatureScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Verifikasi" component={Verifikasi} options={{ headerShown: false }} />
                <Stack.Screen name="VerifikasiFormReview" component={VerifikasiFormReview} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormPPKelompok" component={InisiasiFormPPKelompok} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormPPKelompokList" component={InisiasiFormPPKelompokList} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormPPKelompokIntro" component={InisiasiFormPPKelompokIntro} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormPPKelompokSub" component={InisiasiFormPPKelompokSub} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormPPKelompokDetail" component={InisiasiFormPPKelompokDetail} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormPPKelompokSubForm" component={InisiasiFormPPKelompokSubForm} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormPPKelompokSubMemberVerifikasi" component={InisiasiFormPPKelompokSubMemberVerifikasi} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormPPH" component={InisiasiFormPPH} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormPP" component={InisiasiFormPP} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormPPList" component={InisiasiFormPPList} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormPPForm" component={InisiasiFormPPForm} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormProspekLamaList" component={InisiasiFormProspekLamaList} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormProspekLama" component={InisiasiFormProspekLama} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormUKDisiplinNasabah" component={InisiasiFormUKDisiplinNasabah} options={{ headerShown: false }} />
                <Stack.Screen name="InisiasiFormUKKondisiAirBersihDanSanitasi" component={InisiasiFormUKKondisiAirBersihDanSanitasi} options={{ headerShown: false }} />
                
                <Stack.Screen name="InisiasiFormPPAbsen" component={InisiasiFormPPAbsen} options={{ headerShown: false }} />

                {/* Pencairan */}
                <Stack.Screen name="Pencairan" component={KelompokPencairan} options={{ headerShown: false }} />
                <Stack.Screen name="FlowPencairan" component={FlowPencairan} options={{ headerShown: false }} />
                <Stack.Screen name="ListPencairan" component={ListPencairan} options={{ headerShown: false }} />
                <Stack.Screen name="AkadWakalah" component={AkadWakalah} options={{ headerShown: false }} />
                <Stack.Screen name="AkadMurabahah" component={AkadMurabahah} options={{ headerShown: false }} />
                <Stack.Screen name="FinalPencairan" component={FinalPencairan} options={{ headerShown: false }} />
                <Stack.Screen name="Siklus" component={Siklus} options={{ headerShown: false }} />
                <Stack.Screen name="Perjanjian" component={Perjanjian} options={{ headerShown: false }} />
                <Stack.Screen name="TandaTanganPencairan" component={TandaTanganPencairan} options={{ headerShown: false }} />
                <Stack.Screen name="SyncPencairan" component={SyncPencairan} options={{ headerShown: false }} />
                <Stack.Screen name="Preview" component={Preview} options={{ headerShown: false }} />
                <Stack.Screen name="FormFP4" component={FormFP4} options={{ headerShown: false }} />
                <Stack.Screen name="UploadBuktiPem" component={UploadBuktiPem} options={{ headerShown: false }} />

                <Stack.Screen name="NetworkLogging" component={NetworkLogging} />

          </Stack.Navigator>
      </NavigationContainer>
    );
  }

  const styles = StyleSheet.create({
      imageHeader: {
          width: 127,
          height: 40,
      },
      groupTitle: {
          alignItems: 'center',
      },
      textStyle: {
          fontWeight: 'bold',
          fontSize: 18,
      } 
  })
