declare module 'react-native' {
  import type { NativeMoneroLwsfModule } from 'monero-native'
  declare const NativeModules: {
    MoneroLwsfModule: NativeMoneroLwsfModule
  }
}
