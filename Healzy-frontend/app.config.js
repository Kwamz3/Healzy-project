module.exports = {
  name: 'Healzy',
  slug: 'healzy',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#181848'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.healzy.app',
    buildNumber: '1'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#181848'
    },
    package: 'com.healzy.app',
    versionCode: 1
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: ['expo-router'],
  scheme: 'healzy',
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: 'your-project-id'
    }
  },
  updates: {
    url: 'https://u.expo.dev/your-project-id'
  },
  runtimeVersion: {
    policy: 'appVersion'
  },
  // Add development client configuration
  developmentClient: {
    silentLaunch: true
  },
  // Add network configuration
  networkTimeout: {
    request: 30000,
    upload: 30000,
    download: 30000
  }
}; 