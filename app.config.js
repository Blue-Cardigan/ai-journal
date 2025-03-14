export default {
  name: 'AI Journal',
  slug: 'ai-journal',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'light',
  owner: "cardigan",
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.aijournal',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.aijournal'
  },
  scheme: "ai-journal",
  extra: {
    eas: {
      projectId: '17cf0595-1cef-40cd-823e-14ab8a7fa2ba'
    }
  },
  web: {
    bundler: "webpack",
    favicon: "./assets/images/icon.png",
    name: "AI Journal",
    shortName: "AI Journal",
    lang: "en",
    themeColor: "#ffffff",
    backgroundColor: "#ffffff"
  },
  plugins: [
    "expo-router"
  ],
  experiments: {
    typedRoutes: true
  },
  platforms: ["ios", "android", "web"]
} 