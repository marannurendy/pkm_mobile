import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { startNetworkLogging } from 'react-native-network-logger';

import App from './App';

startNetworkLogging({ forceEnable: true, maxRequests: 100, ignoredHosts: ['localhost'] });

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
